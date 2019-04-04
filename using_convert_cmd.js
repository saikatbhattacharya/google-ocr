var cors = require('cors');
const PDFImage = require('pdf-image').PDFImage;
const express = require('express');
const fileUpload = require('express-fileupload');
const exec = require('child_process').exec;
const fs = require('fs')
const app = express();

const PORT = 8080;
const HOST = '0.0.0.0';
app.use(cors());

// default options
app.use(fileUpload());

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.post('/fileupload', function(req, res) {
  let filename;
  let uploadPath;

  if (Object.keys(req.files).length == 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  filename = req.files.filename;

  uploadPath = __dirname + '/uploads/' + filename.name;

  filename.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
	if (filename.mimetype.toLowerCase() === 'application/pdf'){
		
	}
    res.send('File uploaded to ' + uploadPath);
  });
});

//****************************************************
//****************************************************

const convert_pdf = filepath => {
	for (let i = 0; i < 10; i++) {		
		exec(`convert -geometry 3600x3600 -density 300x300 -quality 100 ${filepath}[${i+1}] -resize 50% /usr/src/app/uploads/NR${i+1}.jpg`);
}

convert_pdf('/usr/src/app/uploads/NRISINGHA-RAHASYA.pdf');
//****************************************************
//****************************************************

app.listen(PORT, HOST);
console.log(`--UPLOAD API-- Running on http://${HOST}:${PORT}`);

