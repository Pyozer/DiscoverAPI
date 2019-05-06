const mysql = require('mysql');

let pool;
exports.getPool = () => {
  if (pool)
    return pool;

  pool = mysql.createPool({
    host: 'r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'crxdngx2s38j66t7',
    password: 'ciu21nrzhhtkjtfr+',
    database: 'omdo9pxou6s2ysd5',
    charset: 'utf8mb4'
  });

  return pool;
}
