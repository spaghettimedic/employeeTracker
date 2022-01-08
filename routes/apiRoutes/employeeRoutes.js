const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// READ all Employees
router.get('/employees', (req, res) => {
  const sql = `SELECT * FROM employees`;
  
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

// READ Employees by manager
router.get('/employees/manager/:manager_id', (req, res) => {
  const sql = `SELECT * FROM employees
              WHERE manager_id = ?`;
  const params = [req.params.manager_id];
  
  db.query(sql, params, (err, rows) => {
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

// READ Employees by department
router.get('/employees/departments/:department_id', (req, res) => {
  const sql = `SELECT name AS 'Department',
              CONCAT(first_name, ' ', last_name) AS 'Employee Name'
              FROM employees, departments, roles
              WHERE department_id = ?
              AND departments.id = roles.department_id
              AND roles.id = employees.role_id`;
  const params = [req.params.department_id];
  
  db.query(sql, params, (err, rows) => {
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

// UPDATE Employee manager
router.put('/employees/:id', (req, res) => {

  const sql = `UPDATE employees SET manager_id = ?
              WHERE id = ?`;
  const params = [req.body.manager_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// CREATE Employee then update their salary and department from roles table
router.post('/employees', ({ body }, res) => {

  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Employee CREATED successfully',
      data: body
    });
  });
});

// DELETE Employee
router.delete('/employees/:id', (req, res) => {

  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'Employee DELETED successfully',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;
