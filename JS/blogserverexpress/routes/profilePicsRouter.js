const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const path = require('path'); //to extract file extension as path.extname('abc.jpeg') => '.jpeg'
const crypto = require('crypto'); //to create random file name -- let id = crypto.randomBytes(8).toString('hex')
//TODO - resize images

const authenticate = require('../authenticate');
const User = require('../models/users');


//storage options
const storage = multer.diskStorage({
    destination: (req, file,cb ) => {
        cb(null, 'public/images/profilePics');
    },
    filename: (req, file, cb) => {
        const filename = crypto.randomBytes(8).toString('hex');
        const fExtension = path.extname(file.originalname);
        cb(null, filename+fExtension)
    }
});

// allowing only certain file types
const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('You can upload only image files'), false)
    }
    cb(null,true);
};

const upload = multer({storage: storage, fileFilter: imageFilter});

const profilePicsRouter = express.Router();
profilePicsRouter.use(bodyParser.json());

profilePicsRouter.route('/')
//issues when using authentication.. if using postman, need to send the authentication as bearer tokend
.get(passport.authenticate('local'), (req, res, next) => {
//do it later
    res.end("Will send pictures");
})
.post(upload.single('imageFile'), (req, res, next) => {
    console.log('image upload request received');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
}) 

module.exports = profilePicsRouter;