const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
const PDFImage = require('pdf-image').PDFImage;

const image2base64 = require('image-to-base64');

const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyATwGub6h3WxIja3LADI8V79F84_sry03k";
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
    .then((noOfPages) => {
      console.log(noOfPages);
      for (let i = 0; i < noOfPages; i++) {
        pdf_converter(i, pdfImage);
      }
    })
    .catch((err) => console.log(err))
}

const base64_encode = (file) => {
  // let bitmap = fs.readFileSync(file);
  // console.log(bitmap)
  // return new Buffer(bitmap).toString('base64');
  var request = require('request').defaults({ encoding: null });

  request.get(file, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = new Buffer(body).toString('base64');
      console.log(data);
    }
  });
};

const google_api = (fileArray) => {
  _.map(fileArray, each => {
    // const encodedFile = base64_encode(each);
    const fileObj = {
      "image": {
        "source": {
          "imageUri": each
        }
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
  console.log(JSON.stringify(requestObj))
  axios.post(url, requestObj)
    .then(outPut => {
      console.log(outPut.data.responses[0].textAnnotations[0].description);
      _.forEach(outPut.data.responses, (each, i) => {
        fs.writeFileSync('./output-' + i + '.txt', each.textAnnotations[0].description, 'utf8');
      })
    })
    .catch(err => console.log(err.responses))
};

// pdf_to_image('./test.pdf');
google_api(['test-0.png'])
