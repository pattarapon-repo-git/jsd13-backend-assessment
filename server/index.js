const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
let products = [
  { id: '1', name: 'Mechanical Keyboard', price: 2990, quantity: 5 },
  { id: '2', name: 'Gaming Mouse', price: 1490, quantity: 10 },
  { id: '3', name: 'USB-C Hub', price: 890, quantity: 3 },
];

// ─── Custom Middleware: Request Logger ────────────────────────────────────────
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /products — get all products, supports ?name= and ?sort=price
app.get('/products', (req, res) => {
  let result = [...products];

  // Filter by name (query string: ?name=keyboard)
  if (req.query.name) {
    const searchTerm = req.query.name.toLowerCase();
    result = result.filter((p) =>
      p.name.toLowerCase().includes(searchTerm)
    );
  }

  // Sort by price (query string: ?sort=price or ?sort=-price for desc)
  if (req.query.sort === 'price') {
    result.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === '-price') {
    result.sort((a, b) => b.price - a.price);
  }

  res.status(200).json(result);
});

// GET /products/:id — get a single product by id
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: `Product with id "${req.params.id}" not found.` });
  }

  res.status(200).json(product);
});

// POST /products — create a new product
app.post('/products', (req, res) => {
  const { name, price, quantity } = req.body;

  // Validate required fields
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Field "name" is required and cannot be empty.' });
  }
  if (price === undefined || price === null) {
    return res.status(400).json({ error: 'Field "price" is required.' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Field "price" must be a non-negative number.' });
  }
  if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
    return res.status(400).json({ error: 'Field "quantity" must be a non-negative number.' });
  }

  const newProduct = {
    id: String(Date.now()),
    name: name.trim(),
    price,
    quantity: quantity !== undefined ? quantity : 1,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id — update an existing product
app.put('/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: `Product with id "${req.params.id}" not found.` });
  }

  const { name, price, quantity } = req.body;

  // Validate fields if provided
  if (name !== undefined && name.trim() === '') {
    return res.status(400).json({ error: 'Field "name" cannot be empty.' });
  }
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ error: 'Field "price" must be a non-negative number.' });
  }
  if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
    return res.status(400).json({ error: 'Field "quantity" must be a non-negative number.' });
  }

  // Merge existing product with updated fields
  const updatedProduct = {
    ...products[index],
    ...(name !== undefined && { name: name.trim() }),
    ...(price !== undefined && { price }),
    ...(quantity !== undefined && { quantity }),
  };

  products[index] = updatedProduct;
  res.status(200).json(updatedProduct);
});

// DELETE /products/:id — delete a product
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: `Product with id "${req.params.id}" not found.` });
  }

  const deleted = products.splice(index, 1)[0];
  res.status(200).json({ message: `Product "${deleted.name}" deleted successfully.`, deleted });
});

// ─── Error Handling Middleware (must be last) ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error. Please try again.',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`   Products loaded: ${products.length} items`);
});
