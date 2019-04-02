const fs = require('fs');
const axios = require('axios');
const PDFImage = require('pdf-image').PDFImage;

const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyATwGub6h3WxIja3LADI8V79F84_sry03k";

const process_file = (files, res) => {
  const requestObj = {
    requests: []
  };
  files.slice(0, 10).map(file => {
    let bitmap = fs.readFileSync(file);
    const encodedFile = new Buffer(bitmap).toString('base64');
    const fileObj = {
      "image": {
        "content": encodedFile
      },
      "features": [{
        "type": "TEXT_DETECTION",
        "maxResults": 1
      }],
      "imageContext": {
        "languageHints": ["bn"]
      }
    };
    requestObj.requests.push(fileObj);
  })
  axios.post(url, requestObj)
    .then(outPut => {
      for (const file of files) {
        fs.unlink(file, err => {
          if (err) throw err;
        });
      }
      let resData = [];
      outPut.data.responses.forEach((each, i) => {
        resData.push(each.textAnnotations[0].description);
      })
      res.send({ resData });
    })
    .catch(err => {
      res.send(err)
    })
};

const google_api = (file, res) => {
  process_file(["./uploads/" + file.filename], res);
};

const pdf_converter = (i, pdfImage) => {
  return new Promise((resolve) => {
    pdfImage.convertPage(i).then(function (imagePath) {
      resolve();
    });
  });
};

const process_pdf = (file, res) => {
  let pdfImage = new PDFImage("./uploads/" + file.filename);
  pdfImage.convertFile().then(function (imagePaths) {
    process_file(imagePaths, res);
  })
    .catch((err) => res.send(err))
};

module.exports = {
  process_pdf,
  google_api
};