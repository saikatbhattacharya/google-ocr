const fs = require('fs');
const axios = require('axios');
const im = require('imagemagick');

const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyATwGub6h3WxIja3LADI8V79F84_sry03k";

const process_file = (files = [], res) => {
  const requestObj = {
    requests: []
  };
  files = files.length ? files : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(f => `./uploads/NR-${f}.jpg`);
  console.log(files);
  files.map(file => {
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
  });
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
      res.sendStatus(500)
      res.send(err)
    })
};

const google_api = (file, res) => {
  process_file(["./uploads/" + file.filename], res);
};

const process_pdf = async (file, res) => {
  im.convert(['convert', '-geometry', '3600x3600', '-density', '300x300', '-quality', '100', `./uploads/${file.filename}[0-10]`, '-resize', '50%', `./uploads/NR.jpg`], (err) => {
    console.log(err);
    process_file([], res);
  })
};

module.exports = {
  process_pdf,
  google_api
};
