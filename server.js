const app = require('./app.js');
const port = process.env.PORT || 3000; // used to create, sign, and verify tokens

// === START THE SERVER ===
app.listen(port, (error) => {
    console.log('Server listening at port %d', port);
});
