var bodyParser = require('body-parser');
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var path = require('path');
var cors = require('cors');
var OCR = require('./requestHandler');

module.exports = function (app) {
  // parse application/x-www-form-urlencoded 
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json 
  app.use(bodyParser.json())
  app.use(cors());
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  })

  app.post("/fileupload", upload.single("filename"), function (req, res) {
    if (req.file.mimetype === 'application/pdf') OCR.process_pdf(req.file, res);
    else if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') OCR.google_api(req.file, res);
    else res.send({ resData: 'File type is not supported' })
  });

  // app.get('/:filename', function (req, res) {
  //   requestHandler.getFile(req, res);
  // })
}