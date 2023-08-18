const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('The file format to upload is not a picture format.  Please submit a correct format file.'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const fileRouter = express.Router();

fileRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('<html><body><h1>GET operation not supported.</h1></body></html>');
})
.post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end('<html><body><h1>POST operation not supported</h1></body></html>');
})
.put(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end('<html><body><h1>PUT operation not supported</h1></body></html>');
})
.delete(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end('<html><body><h1>DELETE operation not supported</h1></body></html>');
});

fileRouter.route('/upload')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation is not supported on imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation is not supported on imageUpload');
});


fileRouter.route('/download/:filename')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../files/download/', filename);

    res.download(filePath, filename, err => {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('<html><body><h1>POST operation not supported</h1></body></html>');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported.');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation is not supported.');
});



module.exports = fileRouter;