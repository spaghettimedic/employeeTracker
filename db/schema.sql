DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(9, 2) NOT NULL UNIQUE,
  department_id INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL DEFAULT 1,
  manager_id INTEGER DEFAULT NULL,
  department_id INTEGER DEFAULT NULL,
  employee_salary DECIMAL(9, 2),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employees(id),
  CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES departments(id),
  CONSTRAINT fk_salary FOREIGN KEY (employee_salary) REFERENCES roles(salary)
);
