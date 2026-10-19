import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // === BACKEND API ROUTES FIRST ===
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'csenzo x ndure', timestamp: new Date().toISOString() });
  });

  // GET /api/products
  app.get('/api/products', (req, res) => {
    let products = db.getProducts();
    const { gender, category, search, minPrice, maxPrice, capsule, sale, sort } = req.query;

    if (gender && gender !== 'All') {
      products = products.filter(
        (p) => p.gender === gender || p.gender === 'Unisex'
      );
    }

    if (category && typeof category === 'string') {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (capsule === 'true') {
      products = products.filter((p) => p.isCapsule);
    }

    if (sale === 'true') {
      products = products.filter((p) => p.isSale || (p.discountPercent && p.discountPercent > 0));
    }

    if (minPrice) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json({ total: products.length, products });
  });

  // GET /api/products/:identifier
  app.get('/api/products/:identifier', (req, res) => {
    const product = db.getProductBySlugOrId(req.params.identifier);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // GET /api/orders (Listing orders)
  app.get('/api/orders', (req, res) => {
    try {
      const orders = db.getOrders();
      res.json({ total: orders.length, orders });
    } catch (err: any) {
      console.error('Failed to get orders:', err);
      res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  });

  // POST /api/orders (Create Order & Decrement Stock)
  app.post('/api/orders', (req, res) => {
    try {
      const orderPayload = req.body;
      if (!orderPayload || typeof orderPayload !== 'object') {
        return res.status(400).json({ error: 'Invalid order payload format' });
      }
      if (!orderPayload.items || !Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      // Validate each item
      for (const item of orderPayload.items) {
        if (!item.product || !item.product.id || !item.selectedSize) {
          return res.status(400).json({ error: 'Each item must have a valid product and selected size' });
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          return res.status(400).json({ error: 'Quantity must be greater than zero' });
        }
      }

      if (!orderPayload.shippingAddress || !orderPayload.shippingAddress.fullName || !orderPayload.shippingAddress.phone) {
        return res.status(400).json({ error: 'Full recipient name and contact phone number are required' });
      }
      if (orderPayload.shippingAddress.phone.replace(/[^0-9]/g, '').length < 10) {
        return res.status(400).json({ error: 'Please provide a valid 11-digit Pakistani phone number (e.g. 0300 1234567)' });
      }
      if (!orderPayload.shippingAddress.address || !orderPayload.shippingAddress.city) {
        return res.status(400).json({ error: 'Complete street delivery address and destination city are required' });
      }

      // Safeguard total
      const calculatedSubtotal = orderPayload.items.reduce(
        (sum: number, item: any) => sum + (Number(item.product.price) || 0) * (Number(item.quantity) || 1),
        0
      );
      const discount = Math.max(0, Number(orderPayload.discountAmount) || 0);
      const shipping = calculatedSubtotal > 5000 ? 0 : 250;
      const verifiedTotal = Math.max(0, calculatedSubtotal - discount + shipping);

      // Determine & verify payment status
      const method = orderPayload.paymentMethod || 'cod';
      const isOnlinePaid = method === 'card' || method === 'wallet' || method === 'bnpl';
      const paymentStatus = orderPayload.paymentStatus || (isOnlinePaid ? 'PAID' : 'PENDING_COD');
      const transactionId = orderPayload.transactionId || (isOnlinePaid ? `TXN-${Date.now().toString().slice(-8)}` : undefined);

      const order = db.createOrder({
        ...orderPayload,
        subtotal: calculatedSubtotal,
        shippingFee: shipping,
        discountAmount: discount,
        total: verifiedTotal,
        paymentStatus,
        transactionId,
      });

      res.status(201).json({ 
        success: true, 
        order,
        paymentConfirmed: paymentStatus === 'PAID',
        message: paymentStatus === 'PAID' 
          ? `Payment settled via online gateway. Transaction ID: ${transactionId}` 
          : 'Order booked under Cash on Delivery (COD). Payment due upon parcel handover.'
      });
    } catch (err: any) {
      console.error('Failed to create order in database:', err);
      res.status(500).json({ error: 'Failed to process and record order in database' });
    }
  });

  // PATCH /api/orders/:id/status (Update order or payment status)
  app.patch('/api/orders/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status, paymentStatus, transactionId, note } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid Order ID is required' });
      }

      const updated = db.updateOrderStatus(id, {
        status,
        paymentStatus,
        transactionId,
        note,
      });

      if (!updated) {
        return res.status(404).json({ error: `Order "${id}" not found in database` });
      }

      res.json({ 
        success: true, 
        order: updated,
        message: `Order ${updated.id} updated to status "${updated.status}" (${updated.paymentStatus})` 
      });
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      res.status(500).json({ error: 'Failed to update order in database' });
    }
  });

  // GET /api/orders/track
  app.get('/api/orders/track', (req, res) => {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Tracking number, Order ID, or Phone number required' });
    }

    const order = db.findOrder(query);
    if (!order) {
      return res.status(404).json({ error: `No consignment found for "${query}"` });
    }
    res.json(order);
  });

  // POST /api/coupons/verify
  app.post('/api/coupons/verify', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });
    const result = db.verifyCoupon(code, Number(subtotal || 0));
    res.json(result);
  });

  // POST /api/newsletter
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    const result = db.addSubscriber(email);
    res.json(result);
  });

  // GET /api/stores
  app.get('/api/stores', (req, res) => {
    res.json(db.getStores());
  });

  // === VITE MIDDLEWARE (Single Port Full-Stack SPA) ===
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? undefined : false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Csenzo x Ndure Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
