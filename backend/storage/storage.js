const express = require('express');
var multer = require('multer');
const app = express();

global.__basedir = __dirname;
let dir = 'C:\\Users\\kenneth\\tech-system\\tech-system-backend\\uploads' 

app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir)                    
  },
  filename: (req, file, cb) => {
     
      cb(null, (file.fieldname || 'test123') + "-" + Date.now() + "-" + (file.originalname || 'or1234'))
  }
});

const upload = multer({ storage: storage });

module.exports = upload