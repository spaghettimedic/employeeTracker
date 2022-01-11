class Role {
  constructor(db, id = '', title = '', salary = '', departmentId = '') {
    this.db = db;
    this.id = id;
    this.title = title;
    this.salary = salary;
    this.departmentId = departmentId;
  }

  showAllRoles() {
    const sql = `SELECT r.title, r.salary, d.name AS 'department'
                FROM roles r
                LEFT JOIN departments d
                ON r.department_id = d.id`;
    
    this.db.query(sql, (err, rows) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('\n');
      console.table(rows);
    });
  };

  createRole(title, salary, department_id) {
    const sql = `INSERT INTO roles (title, salary, department_id)
      VALUES (?, ?, ?)`;
    const params = [title, salary, department_id];
    
    this.db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('\n');
      console.table(`${title} successfully added to the database.`)
    });
  };
  
  deleteRole(roleTitle, id) {
    const sql = `DELETE FROM roles WHERE id = ?`;
  
    this.db.query(sql, id, (err, result) => {
      if (err) {
        console.log(err.message);
      } else if (!result.affectedRows) {
        console.log('Role not found in database');
      } else {
        console.log(`${roleTitle} DELETED from database`);
      }
    });
  };
};

module.exports = Role;
