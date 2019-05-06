const mysql = require('mysql');

let pool;
exports.getPool = () => {
  if (pool)
    return pool;

  pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'discoveruser',
    password: 'discoverAPI1+',
    database: 'discover',
    charset: 'utf8mb4'
  });

  return pool;
}
