const fs = require('fs');
const axios = require('axios');
const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyATwGub6h3WxIja3LADI8V79F84_sry03k";

const process_file = (file, res) => {
  const requestObj = {
    requests: []
  };
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
  axios.post(url, requestObj)
    .then(outPut => {
      fs.unlink(file, function (err) {
        if (err) console.log(err)
        let resData = '';
        outPut.data.responses.forEach((each, i) => {
          resData = resData + each.textAnnotations[0].description;
          res.send({ resData });
        })
      })
    })
    .catch(err => res.send(err.responses))
}

const google_api = (file, res) => {
  process_file("./uploads/" + file.filename, res);
};

module.exports = google_api;