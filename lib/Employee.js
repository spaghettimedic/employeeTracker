class Employee {
  constructor(db, id = 0, first_name = '', last_name = '', role_id = 0, manager_id = 0) {
    this.db = db;
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }

  showAllEmployees() {
    const sql = `SELECT CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name', r.title, r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS 'Manager Name', d.name AS 'Department'  
                FROM employees e
                LEFT JOIN roles r ON e.role_id = r.id
                LEFT JOIN departments d ON r.department_id = d.id
                LEFT JOIN employees m ON e.manager_id = m.id`;
    
    this.db.promise().query(sql)
    .then(([rows]) => {
      if (!rows) {
        console.log(`There are no employees in the database yet!`)
        return;
      }
      console.log('\n');
      console.table(rows);
    });
  };

  showEmployeesByManager(employeeManager, manager_id) {
    const sql = `SELECT
                CONCAT(first_name, ' ', last_name) AS "${employeeManager}'s subordinates"
                FROM employees
                WHERE manager_id = ?`;
    
    this.db.promise().query(sql, manager_id)
    .then(([rows]) => {
      if (!rows) {
        console.log(`There are no employees in the database yet!`);
        return;
      }
      console.log('\n');
      console.table(rows);
    });
  };

  showEmployeesByDept(department, department_id) {
    const sql = `SELECT
                CONCAT(first_name, ' ', last_name) AS "${department} department's employees"
                FROM employees, departments, roles
                WHERE department_id = ?
                AND departments.id = roles.department_id
                AND roles.id = employees.role_id`;
    
    this.db.promise().query(sql, department_id)
    .then(([rows]) => {
      if (!rows) {
        console.log(`There are employees in that department!`);
        return;
      }
      console.log('\n');
      console.table(rows);
    });
  };

  createEmployee(first_name, last_name, role_id, manager_id) {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
    const params = [first_name, last_name, role_id, manager_id];
  
    this.db.promise().query(sql, params)
    .then((err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(`${first_name + ' ' + last_name} was successfully added to the database`);
    });
  };

  deleteEmployee(employeeName, id) {
    this.db.promise().query(`DELETE FROM employees WHERE id = ?`, id)
    .then((err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(`${employeeName} DELETED from database`);
    })
  };

  updateManager(manager_id, id, employeeName, managerName) {
    const sql = `UPDATE employees SET manager_id = ?
                WHERE id = ?`;
    const params = [manager_id, id];
  
    this.db.promise().query(sql, params)
    .then((err, result) => {
      if (err) {
        console.log(err.message);
      } else if (!result.affectedRows) {
        console.log('Employee not found in database')
      } else {
        console.log(`${employeeName}'s manager has been UPDATED to ${managerName} in the database`)
      }
    });
  };
};

module.exports = Employee;
