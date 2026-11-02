const express = require('express');
const { hitungTotal } = require('./cart');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/cart/total', (req, res) => {
  const { items, voucher } = req.body;
  try {
    res.json(hitungTotal(items, voucher));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = app;
