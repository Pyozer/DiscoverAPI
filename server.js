const express = require('express');
const app = express();
let PORT = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  return res.json({
    status: "succeed",
    message: "Hello World !"
  });
});

app.get('/hello/:name', (req, res) => {
  return res.json({
    status: "succeed",
    message: `Hello ${req.params.name}`
  });
});



app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);
