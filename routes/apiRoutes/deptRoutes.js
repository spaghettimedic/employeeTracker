const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// READ all Departments
router.get('/departments', (req, res) => {
  const sql = `SELECT * FROM departments`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// READ department budgets
router.get('/departments/:id', (req, res) => {
  const sql = `SELECT SUM(salary)
              FROM employees
              WHERE role_id = `;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

module.exports = router;
