const express = require('express');
const Visitor = require('../models/visitor');
const authenticate = require('../authenticate');
const cors = require('./cors');

const contactusRouter = express.Router();

contactusRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.get(cors.cors, (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end('respond with a resource for the home page');
})
.post(cors.corsWithOptions, (req, res, next) =>{
  Visitor.create(req.body)
  .then(visitor => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(visitor);
  })
  .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) =>{
  res.statusCode = 403;
  res.end('PUT operation not supported for /contactus');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) =>{
  res.statusCode = 403;
  res.end('DELETE operation not supported for /contactus');
});

contactusRouter.route('/visitors')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Visitor.find()
      .then(visitors =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(visitors);
      })
      .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) =>{
  res.statusCode = 403;
  res.end('POST operation is not supported on /contactus/visitors');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) =>{
  res.statusCode = 403;
  res.end('PUT operation is not supported on /contactus/visitors');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
      Visitor.deleteMany()
      .then(response => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
      })
      .catch(err =>next(err));
  });

  contactusRouter.route('/visitors/:visitorId')
  .options(cors.corsWithOptions, (req, res) => res.statusCode(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Visitor.findById(req.params.visitorId)
        .then(visitor =>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(visitor);
        })
        .catch(err => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) =>{
    res.statusCode = 403;
    res.end(`POST operation is not supported on /contactus/visitors/${req.params.visitorId}/`);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) =>{
    res.statusCode = 403;
    res.end(`PUT operation is not supported on /contactus/visitors/${req.params.visitorId}/`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
        Visitor.findByIdAndDelete(req.params.visitorId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err =>next(err));
    });

module.exports = contactusRouter;
