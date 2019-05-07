const mysql = require('mysql');

let pool;
exports.getPool = () => {
  if (pool)
    return pool;

  let dbHost = process.env.DB_URL;
  let dbUser = process.env.DB_USER;
  let dbPwd = process.env.DB_PWD;
  let dbDB = process.env.DB_DB;

  pool = mysql.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB,
    charset: 'utf8mb4'
  });

  return pool;
}
