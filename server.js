const express = require('express');
const app = express();
let PORT = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  return res.json({
    status: "succeed",
    data: "Hello World !",
    message: "200"
  });
});

app.get('/hello/:name', (req, res) => {
  return res.json({
    status: "succeed",
    data: `Hello ${req.params.name}`,
    message: "200"
  });
});



app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);

console.log(process.env);

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
