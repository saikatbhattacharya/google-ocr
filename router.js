var bodyParser = require('body-parser');
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var path = require('path');
var OCR = require('./requestHandler');

module.exports = function (app) {
  // parse application/x-www-form-urlencoded 
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json 
  app.use(bodyParser.json())

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  })

  app.post("/fileupload", upload.single("filename"), function (req, res) {
    OCR(req.file, res);
  });

  // app.get('/:filename', function (req, res) {
  //   requestHandler.getFile(req, res);
  // })
}