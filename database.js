const mysql = require('mysql');

let pool;
exports.getPool = () => {
  if (pool)
    return pool;

  pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'crxdngx2s38j66t7',
    password: 'ciu21nrzhhtkjtfr+',
    database: 'omdo9pxou6s2ysd5',
    charset: 'utf8mb4'
  });

  return pool;
}
