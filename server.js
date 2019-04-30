// const express = require('express');
// const app = express();
// let PORT = process.env.PORT || 3000;
//
// app.get('/hello', (req, res) => {
//   return res.json({
//     status: "succeed",
//     data: "Hello World !",
//     message: "200"
//   });
// });
//
// app.get('/hello/:name', (req, res) => {
//   return res.json({
//     status: "succeed",
//     data: `Hello ${req.params.name}`,
//     message: "200"
//   });
// });
//
//
//
// app.listen(PORT, () =>
//   console.log(`Example app listening on port ${PORT}!`),
// );
const http = require('http');
const { Client } = require('pg');

const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;
const server = http.createServer((req, res) => {
  const client = new Client({
    connectionString: DATABASE_URL,
  });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  client.connect()
    .then(() => client.query('SELECT * FROM hellotable'))
    .then((result) => {
      res.end(`${result.rows[0].name}\n`);
      client.end();
    })
    .catch(() => {
      res.end('ERROR');
      client.end();
    });
});
server.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server running on ${PORT}/`);
});
