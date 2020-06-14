var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Posts = require('../models/posts');

var postRouter = express.Router();
postRouter.use(bodyParser.json());

postRouter.route('/')
.get((req,res,next) => {
    Posts.find({})
    .then((posts) => {
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(posts);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    Posts.create(req.body)
    .then((posts) => {
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(posts);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not suppprted right now");
})
.delete((req, res, next) => {
    Posts.remove({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))
})

module.exports = postRouter;
