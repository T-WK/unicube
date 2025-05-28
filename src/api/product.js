const express = require('express');
const router = express.Router();

// GET /api/product
router.get('/', (req, res) => {
    res.json({ message: 'Get products' });
  });
  
  // POST /api/product
  router.post('/', (req, res) => {
    res.json({ message: 'Create product' });
  });
  
  // PATCH /api/product/:id
  router.patch('/:id', (req, res) => {
    res.json({ message: `Update product ${req.params.id}` });
  });
  
  // DELETE /api/product/:id
  router.delete('/:id', (req, res) => {
    res.json({ message: `Delete product ${req.params.id}` });
  });
  
  module.exports = router;