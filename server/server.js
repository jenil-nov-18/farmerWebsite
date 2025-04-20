import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let products = [];

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Add a new product
app.post('/api/products', (req, res) => {
  try {
    const product = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    products.push(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(product => product.id !== id);
  res.status(200).json({ message: 'Product deleted successfully' });
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(product => product.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});