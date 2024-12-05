import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const dataDir = path.join(__dirname, 'data'); // Absolute path to 'data' directory

app.use(bodyParser.json());
app.use(express.static('public'));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// GET /meals endpoint
app.get('/meals', async (req, res) => {
  try {
    const mealsPath = path.join(dataDir, 'available-meals.json');
    const meals = await fs.readFile(mealsPath, 'utf8');
    res.json(JSON.parse(meals));
  } catch (error) {
    res.status(500).json({ message: 'Error reading meals data.', error: error.message });
  }
});

// POST /orders endpoint
app.post('/orders', async (req, res) => {
  const orderData = req.body.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Missing order items.' });
  }

  const { customer } = orderData;
  if (
    !customer ||
    !customer.email?.includes('@') ||
    !customer.name?.trim() ||
    !customer.street?.trim() ||
    !customer['postal-code']?.trim() ||
    !customer.city?.trim()
  ) {
    return res.status(400).json({ message: 'Incomplete customer data.' });
  }

  try {
    const ordersPath = path.join(dataDir, 'orders.json');
    const orders = await fs.readFile(ordersPath, 'utf8');
    const allOrders = JSON.parse(orders);

    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toString(),
    };

    allOrders.push(newOrder);
    await fs.writeFile(ordersPath, JSON.stringify(allOrders, null, 2));
    res.status(201).json({ message: 'Order created!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order.', error: error.message });
  }
});

// Handle OPTIONS requests (CORS preflight)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
