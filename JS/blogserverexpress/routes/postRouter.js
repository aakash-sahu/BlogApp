var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Posts = require('../models/posts');

var postRouter = express.Router();
postRouter.use(bodyParser.json());

postRouter.route('/')
.get((req,res,next) => {
    const page = parseInt(req.query.page)?parseInt(req.query.page):1;
    // console.log(page);
    pageSize=5;
    const skip = (page - 1)*pageSize;
    Posts.estimatedDocumentCount({})
    .then((totalCount)=> {
        totalPages = Math.ceil(totalCount/pageSize);
        if (page>totalPages) {
            res.statusCode=404;
            res.send("Page not found");
            return;           
        }
        Posts.find({})
        .sort('-datePosted') //sort by date posted descending
        .skip(skip)
        .limit(pageSize)
        .populate('author')
        .then((posts) => {
            // console.log(totalPages);
            res.statusCode=200;
            res.setHeader("Content-Type", "application/json");
            res.json({posts: posts, totalPages:totalPages, currentPage:page})
    
        }, (err) => next(err))
    })
    .catch((err) => next(err))
})
.post((req, res, next) => {
    console.log(req.isAuthenticated(), req.body);
    if (req.isAuthenticated()) {
        req.body.author = req.user._id; //add id of currently logged user to the body
        Posts.create(req.body)
        .then((post) => {
            Posts.findById(post._id)
            .populate('author')
            .then((post) => {
                res.statusCode=200;
                res.setHeader("Content-Type", "application/json");
                res.json(post);
            })
        }, (err) => next(err))
        .catch((err) => next(err))
    }
    else {
        err = new Error('Post could not be submitted! Try again later!');
        err.status= 500;
        return next(err);
    }
})
.put((req, res, next) => {
    console.log(req.isAuthenticated(), req.body);
    if (req.isAuthenticated()) {
        // req.body.author = req.user._id; //add id of currently logged user to the body
        Posts.findByIdAndUpdate(req.body._id, {$set:req.body}, {new:true, useFindAndModify:false})
        .then((post) => {
            Posts.findById(post._id)
            .populate('author')
            .then((post) => {
                res.statusCode=200;
                res.setHeader("Content-Type", "application/json");
                res.json(post);
            })
        }, (err) => next(err))
        .catch((err) => next(err))
    }
    else {
        err = new Error('Post could not be updated! Try again later!');
        err.status= 500;
        return next(err);
    }
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

//delete by post Id
postRouter.route('/:postId').delete((req, res, next) => {
    if (req.isAuthenticated() ) {
        Posts.findById(req.params.postId)
        .then((post) => {
            if (post != null) {
                if (!post.author.equals(req.user._id)) {
                    res.statusCode=403;
                    res.send("You can delete only your post!!");
                    return;
                }
                else {
                    Posts.findByIdAndDelete(post._id)
                    .then(post => {
                        res.statusCode=200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json(post);
                        
                    })
                }
            }
            else {
                res.statusCode = 404;
                return res.end("Post was not found!")
            }

        })
        .catch((err) => next(err))
    }
    else {
        res.statusCode=401;
        res.end("You are not authenticated!!");
    }
})

//get by post Id
postRouter.route('/:postId').get((req, res, next) => {

        Posts.findById(req.params.postId)
        .populate('author')
        .then((post) => {
          // console.log(posts);
          if (!post) {
            res.statusCode = 404;
            res.end("Send correct post id!!");
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(post);
        })
        .catch((err) => next(err))
})

module.exports = postRouter;
