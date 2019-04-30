const express = require('express');
const app = express();
let PORT = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  return res.json({
    status: "succeed",
    data: "Hello World !",
    message: "201"
  });
});

app.get('/hello/:name', (req, res) => {
  return res.json({
    status: "succeed",
    data: `Hello ${req.params.name}`
    message: "201"
  });
});



app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);
