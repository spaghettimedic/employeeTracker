class Department {
  constructor(db, id = 0, name = '') {
    this.db = db;
    this.id = id;
    this.name = name;
  };

  // set this object's data
  setProperties(data) {
    Object.getOwnPropertyNames(this).forEach((property) => {
      if (property !== 'db') {
        this[property] = data[property];
      }
    });
  };

  // READ all departments
  showAllDepts() {
    const sql = `SELECT name AS department FROM departments`;
    
    this.db.query(sql, (err, rows) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('\n');
      console.table(rows);
    });
  };

  // READ all departments and their budgets
  showBudgets() {
    const sql = `SELECT departments.name AS "department",
                SUM(salary) AS "budget"
                FROM departments
                LEFT JOIN roles
                ON departments.id = roles.department_id
                GROUP BY department_id`;
    
    this.db.query(sql, (err, rows) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('\n');
      console.table(rows);
    });
  };

  // CREATE a new department in the database
  createDept(deptName = this.name) {
    const sql = `INSERT INTO departments (name)
      VALUES (?)`;
    
    this.db.query(sql, deptName, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(`${deptName} department CREATED successfully`);
    });
  };
  
  // DELETE a department from the database
  deleteDept(deptName, id) {
    const sql = `DELETE FROM departments WHERE id = ?`;
  
    this.db.query(sql, id, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(`${deptName} department DELETED from database`);
    });
  };
};

module.exports = Department;
