const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'spaghettimedic',
    password: 'Shelly4!',
    database: 'workplace'
  },
  console.log('Connected to the workplace database')
);

module.exports = db;
