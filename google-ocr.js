const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
const PDFImage = require('pdf-image').PDFImage;

const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBp9japjtkdEq_z72nGSiu2vo7JuJT5JTE";
const requestObj = {
  "requests": []
};

const pdf_converter = (i, pdfImage) => {
  return new Promise((resolve) => {
    pdfImage.convertPage(i).then(function (imagePath) {
      resolve();
    });
  });
}

const pdf_to_image = async (filepath) => {
  let pdfImage = new PDFImage(filepath);
  
  pdfImage.numberOfPages()
    .then((noOfPages) => console.log(noOfPages))
    .catch((err) => console.log(err))
}

const base64_encode = (file) => {
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
};

const google_api = (fileArray) => {
  _.map(fileArray, each => {
    const encodedFile = base64_encode(each);
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
  });
  axios.post(url, requestObj)
    .then(outPut => {
      console.log(outPut.data.responses[0].textAnnotations[0].description);
      _.forEach(outPut.data.responses, (each, i) => {
        fs.writeFileSync('./output-'+i+'.txt', each.textAnnotations[0].description, 'utf8');
      })
    })
    .catch(err => console.log(err.error))
};

google_api(['./p1.jpg']);
// pdf_to_image('./test.pdf');