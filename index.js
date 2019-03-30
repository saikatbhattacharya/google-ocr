var express = require('express');
var app = express();
var routes = require('./router.js');
const PORT = process.env.PORT || 4000;
routes(app);

app.listen(PORT, () => console.log('Server is starting on ', PORT));