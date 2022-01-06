const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// READ all Roles
router.get('/roles', (req, res) => {
  const sql = `SELECT * FROM roles`;
  
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

// CREATE Role
router.post('/roles', ({ body }, res) => {

  const sql = `INSERT INTO roles (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const params = [body.title, body.salary, body.department_id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Role CREATED successfully',
      data: body
    });
  });
});

// DELETE Role
router.delete('/roles/:id', (req, res) => {

  const sql = `DELETE FROM roles WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'Role DELETED successfully',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;
