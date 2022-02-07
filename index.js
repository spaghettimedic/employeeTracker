const inquirer = require('inquirer');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');

let department = new Department(db);
let role = new Role(db);
let employee = new Employee(db);

const mainMenu = () => {
  console.log(`
  ==========================
  Welcome to your Workplace!
  ==========================

  NOTE:
  - You will need to CREATE Departments before you can assign a Role to a department.
  - You will need to CREATE Managers before you can assign a Manager to an Employee.
  `);

  inquirer.prompt(
    {
      type: 'list',
      name: 'menuChoice',
      message: 'What would you like to do?',
      choices: [
        'VIEW Department budgets',
        'VIEW all Departments',
        'VIEW all Roles',
        'VIEW all Employees',
        'VIEW Employees by manager',
        'VIEW Employees by department',
        `UPDATE an Employee's manager`,
        'CREATE Department',
        'CREATE Role',
        'CREATE Employee',
        'DELETE Department',
        'DELETE Role',
        'DELETE Employee']
    }
  )
  .then(({ menuChoice }) => {
    switch (menuChoice) {
      case 'VIEW all Departments':
        department.showAllDepts();
        mainMenu();
        break;
      case 'VIEW Department budgets':
        department.showBudgets();
        mainMenu();
        break;
      case 'VIEW all Roles':
        role.showAllRoles();
        mainMenu();
        break;
      case 'VIEW all Employees':
        employee.showAllEmployees();
        mainMenu();
        break;
      case 'VIEW Employees by manager':
        viewEmpByMan();
        break;
      case 'VIEW Employees by department':
        viewEmpByDept();
        break;
      case `UPDATE an Employee's manager`:
        updEmpMan();
        break;
      case 'CREATE Department':
        newDept();
        break;
      case 'CREATE Role':
        newRole();
        break;
      case 'CREATE Employee':
        newEmployee();
        break;
      case 'DELETE Department':
        removeDept();
        break;
      case 'DELETE Role':
        removeRole();
        break;
      case 'DELETE Employee':
        removeEmployee();
        break;
    };
  });
};

const newEmployee = () => {
  let roles = [];
  let managers = [];
  let roleTitles = [];
  let managerNames = [];

  // get all available roles
  db.promise().query(`SELECT * FROM roles`)
  .then(([roleRes]) => {
    if (!roleRes) {
      console.log('There are no roles yet! Please add roles before adding an employee.');
      mainMenu();
    };
    for (let i = 0; i < roleRes.length; i++) {
      roles.push(roleRes[i]);
      roleTitles.push(roleRes[i].title);
    };
  });

  // get all available managers
  db.promise().query(`SELECT * FROM employees WHERE role_id = 1`)
  .then(([manRes]) => {
    if (!manRes) {
      console.log(`There are no managers yet! If you want to assign a manager to this employee, you'll have to create some managers first, then update this employee's manager.`);
    };
    for (let i = 0; i < manRes.length; i++) {
      if (manRes[i].first_name) {
        managers.push(manRes[i]);
        managerNames.push(manRes[i].first_name + ' ' + manRes[i].last_name);
      };
    };
  })
  .then(() => {
    console.log(roleTitles, managerNames);
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: `What is this Employee's first name?`,
        validate: firstNameInput => {
          if (firstNameInput) {
            return true;
          } else {
            console.log(`First name is required!`);
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: `What is this Employee's last name?`,
        validate: last_nameInput => {
          if (last_nameInput) {
            return true;
          } else {
            console.log(`Last name is required!`);
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'employeeRole',
        message: `What is this Employee's role?`,
        choices: roleTitles
      },
      {
        type: 'list',
        name: 'employeeManager',
        message: "Who is this Employee's manager?",
        choices: managerNames
      }
    ])
    .then(({firstName, lastName, employeeRole, employeeManager}) => {
      // set user answer to database id value for role and manager with these loops
      let role_id = null;
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === employeeRole) {
          role_id = roles[i].id;
        };
      };
      let manager_id = null;
      for (let i = 0; i < managers.length; i++) {
        if (managers[i].first_name + ' ' + managers[i].last_name === employeeManager) {
          manager_id = managers[i].id;
        };
      };
  
      employee.createEmployee(firstName, lastName, role_id, manager_id);
      mainMenu();
    });
  });
};

const newRole = () => {
  let departments = [];
  let departmentNames = [];

  // get all available roles
  db.promise().query(`SELECT * FROM departments`)
  .then(([deptRes]) => {
    if (!deptRes) {
      console.log(`There are no departments in the database yet!`);
      return;
    }
    for (let i = 0; i < deptRes.length; i++) {
      departments.push(deptRes[i]);
      departmentNames.push(deptRes[i].name);
    };
    console.log(departments, departmentNames);
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: `What is this Role's title?`,
        validate: titleInput => {
          if (titleInput) {
            return true;
          } else {
            console.log(`The Role's title is required!`);
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'roleDept',
        message: `What department is this Role in?`,
        choices: departmentNames
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the annual salary for this Role?',
        validate: salaryInput => {
          if (salaryInput) {
            return true;
          } else {
            console.log('You must give every role a salary and commas are not accepted');
            return false;
          }
        }
      }
    ])
    .then(({title, roleDept, salary}) => {
      // set user answer to database id value for department with this loop
      let department_id;
      for (let i = 0; i < departments.length; i++) {
        if (departments[i] === roleDept) {
          department_id = departments[i].id;
          console.log(department_id);
        };
      };
      role.createRole(title, salary, department_id);
      mainMenu();
    });
  });
};

// works but creates duplicates
const newDept = () => {

  inquirer.prompt({
    type: 'input',
    name: 'deptName',
    message: 'What is the name of this Department?',
    validate: deptNameInput => {
      if (deptNameInput) {
        return true;
      } else {
        console.log(`The Department's name is required!`);
        return false;
      }
    }
  })
  .then(({deptName}) => {
    department.createDept(deptName);
    mainMenu();
  });
};

// goes straight back to mainMenu() after 1st time being selected,
// shows the question but immediately closes the program after 2nd time being selected
const viewEmpByMan = () => {
  let managers = [];

  // get all available managers
  const manager_sql = `SELECT * FROM employees WHERE role_id = 1`;
  db.query(manager_sql, (err, manRes) => {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i < manRes.length; i++) {
      managers.push(manRes[i].first_name + ' ' + manRes[i].last_name);
    };
    return manRes;
  });

  inquirer.prompt({
    type: 'list',
    name: 'employeeManager',
    message: 'Which manager would you like to see the employees for?',
    choices: managers
  })
  .then(({employeeManager}, manRes) => {
    // set user answer to database id value for manager_id
    let manager_id = null;
    for (let i = 0; i < manRes.length; i++) {
      if (manRes[i].first_name + ' ' + manRes[i].last_name === employeeManager) {
        manager_id = manRes[i].id;
      };
    };
    employee.showEmployeesByManager(manager_id);
    mainMenu();
  });
};

// goes straight back to mainMenu() after 1st time being selected,
// shows the question but immediately closes the program after 2nd time being selected
const viewEmpByDept = () => {
  let departments = [];

  // get all available departments
  const dept_sql = `SELECT name FROM departments`;
  db.query(dept_sql, (err, deptRes) => {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i < deptRes.length; i++) {
      departments.push(deptRes[i].name);
    };
    return deptRes;
  });

  inquirer.prompt({
    type: 'list',
    name: 'department',
    message: 'Which department would you like to see the employees for?',
    choices: departments
  })
  .then(({department}, deptRes) => {
    // set user answer to database id value for department_id
    let department_id = null;
    for (let i = 0; i < deptRes.length; i++) {
      if (deptRes[i].name === department) {
        department_id = deptRes[i].id;
      };
    };
    employee.showEmployeesByDept(department_id);
    mainMenu();
  });
};

// errors out and crashes after employee selection
const removeEmployee = () => {
  let employees = [];
  let employeeNames = [];

  // gets list of current employees
  db.promise().query('SELECT * FROM employees')
  .then(([rows]) => {
    if (!rows) {
      console.log(`There are no employees in the database yet!`);
      mainMenu();
    }
    for (let i = 0; i < rows.length; i++) {
      employees.push(rows[i]);
      employeeNames.push(rows[i].first_name + ' ' + rows[i].last_name);
    }
    console.log(employees, employeeNames);
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeName',
        message: 'Which Employee would you like to DELETE?',
        choices: employeeNames
      }
    ])
    .then(({employeeName}) => {
      for (let i = 0; i < employees.length; i++) {
        if (employeeNames[i] === employeeName) {
          employee.deleteEmployee(employeeName, employees[i].id);
          console.log(employeeName, employees[i].id);
        };
      };
      mainMenu();
    });
  });
};

// errors out and creates exponential multiples of everything shown in the terminal
const removeRole = () => {
  let roles = [];
  let roleTitles = [];

  // gets list of current roles
  db.promise().query(`SELECT * FROM roles`)
  .then(([rows]) => {
    if (!rows) {
      console.log(`There are no roles in the database!`);
      return mainMenu();
    };
    for (let i = 0; i < rows.length; i++) {
      roles.push(rows[i]);
      roleTitles.push(rows[i].title);
    };
    console.log(roles, roleTitles);
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'roleTitle',
        message: 'Which Role would you like to DELETE?',
        choices: roleTitles
      }
    ])
    .then(({roleTitle}) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === roleTitle) {
          let role_id;
          role_id = roles[i].id;
          role.deleteRole(roleTitle, role_id);
        };
      };
      mainMenu();
    });
  })
};

// works but duplicates everything shown in the terminal
const removeDept = () => {
  let departments = [];

  // gets list of current departments
  const dept_sql = 'SELECT * FROM departments';
  db.query(dept_sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].name) {
        departments.push(rows[i]);
      }
    }

    inquirer.prompt([
      {
        type: 'list',
        name: 'deptName',
        message: 'Which Department would you like to DELETE?',
        choices: departments
      }
    ])
    .then(({deptName}) => {
      for (let i = 0; i < departments.length; i++) {
        if (departments[i].name === deptName) {
          department.setProperties(departments[i]);
          department.deleteDept(deptName, departments[i].id);
        };
        mainMenu();
      };
    });
  });
};

const updEmpMan = () => {
  let employees = [];
  let managers = [];
  let employeeNames = [];
  let managerNames = [];
  
  // gets list of current employees
  const emp_sql = 'SELECT * FROM employees';
  db.query(emp_sql, (err, empRes) => {
    if (err) {
      console.log(err);
    };
    for (let i = 0; i < empRes.length; i++) {
      employees.push(empRes[i]);
      employeeNames.push(empRes[i].first_name + ' ' + empRes[i].last_name);
    };
  });
  
  // gets list of current managers, set all info to managers, just names to managerNames
  const man_sql = 'SELECT * FROM employees WHERE role_id = 1';
  db.query(man_sql, (err, manRes) => {
    if (err) {
      console.log(err);
    };
    for (let i = 0; i < manRes.length; i++) {
      managers.push(manRes[i]);
      managerNames.push(manRes[i].first_name + ' ' + manRes[i].last_name);
    };
  });

  inquirer.prompt([
    {
      type: 'list',
      name: 'employeeName',
      message: 'Which Employee would you like to UPDATE?',
      choices: employeeNames
    },
    {
      type: 'list',
      name: 'managerName',
      message: 'Who would like to be their new manager?',
      choices: managerNames
    }
  ])
  .then(({employeeName}) => {
    let managerName = NULL;
    let manager_id = NULL;
    let id = NULL;

    for (let i = 0; i < managerNames.length; i++) {
      if (managerNames[i] === managerName) {
        managers[i].id = manager_id;
        managers[i] = managerName;
      }
      
    }
    for (let i = 0; i < employeeNames.length; i++) {
      if (employeeNames[i] === employeeName) {
        employees[i].id = id;
        employee.updateManager(manager_id, id, employeeName, managerName);
      };
      mainMenu();
    };
  });
}

mainMenu();
