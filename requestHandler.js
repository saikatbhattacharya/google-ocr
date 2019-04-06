const fs = require('fs');
const axios = require('axios');
const im = require('imagemagick');

const url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyATwGub6h3WxIja3LADI8V79F84_sry03k";

const process_file = (files = [], res, fileName = '') => {
  fs.unlinkSync(`./uploads/${fileName}`);
  const requestObj = {
    requests: []
  };
  fs.readdir('./uploads', (fileError, fileList) => {
    files = files.length ? files : fileList.filter(f => f.includes(fileName) && f.includes('.jpg'));
    console.log(files);
    files.map(file => {
      let bitmap = fs.readFileSync(`./uploads/${file}`);
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
          fs.unlink(`./uploads/${file}`, err => {
            if (err) throw err;
          });
        }
        let resData = [];
        console.log(outPut.data);
        outPut.data.responses.forEach((each, i) => {
          resData.push(each.textAnnotations[0].description);
        })
        res.send({ resData });
      })
      .catch(err => {
        console.log(err)
        res.status(400)
        res.send(err)
      })
  })

};

const google_api = (file, res) => {
  process_file([file.filename], res);
};

const process_pdf = async (file, res) => {
  im.convert(['convert', '-geometry', '3600x3600', '-density', '300x300', '-quality', '100', `./uploads/${file.filename}[0-10]`, '-resize', '50%', `./uploads/${file.filename}.jpg`], (err) => {
    console.log(err);
    process_file([], res, file.filename);
  })
};

module.exports = {
  process_pdf,
  google_api
};
