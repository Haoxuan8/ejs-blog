var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middleWare = require("../middleware");
var Post = require("../models/post"),
    User = require("../models/user"),
    Tag = require("../models/tag");
var hljs = require("../public/js/highlight.min.js");
var MarkdownIt = require('markdown-it');
var moment = require("moment-timezone");


var md = require('markdown-it')({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }  
      return ''; // use external default escaping
    }
});

router.get("/create", middleWare.checkAdmin, function(req,res){
    Tag.find({}, function(err, tags){
        res.render("posts/create",{tags:tags});
    })
})

router.post("/create", middleWare.checkAdmin, function(req,res){
    //save post and tags
    var resultHTML = md.render(req.body.post.content);
    var post = {
        title: req.body.post.title,
        contentMd: req.body.post.content,
        contentHTML: resultHTML,
        coverImg: req.body.post.coverImg,
        description: req.body.post.desc,
        display: true,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Post.create(post, function(err, createdPost){
        if(err){
            req.flash("error",err);
            return res.redirect("back");
        }
        for (var key in req.body.tags){
            Tag.findById(key, function(err, foundTag){
                foundTag.posts.push(createdPost._id);
                foundTag.save()
            });
            Post.findByIdAndUpdate(createdPost._id, {$push: {'tags': {'_id': key}}}, {new: true, safe: true, upsert: true },
            function(err, result){
                if(err) console.log(err);
            });
        }
        res.redirect("/");
    })
});


//get post show page
router.get("/:id", function(req,res){
    Post.findById(req.params.id).populate('tags').exec(function(err, foundPost){
        if(err) {
            req.flash("error", err);
            return res.redirect("back");
        }
        else{
            if(!foundPost.display) {
                return res.redirect("back");
            }
            foundPost.meta.views = foundPost.meta.views + 1;
            foundPost.save();
            res.render("posts/show", {post: foundPost, moment: moment});
        }
    });
});

//update
router.get("/:id/edit", middleWare.checkAdmin, function(req,res){
    Post.findById(req.params.id).populate('tags').exec(function(err, foundPost){
        if(err) {
            req.flash("error", err);
            return res.redirect("back");
        }
        else{
            res.render("posts/edit", {post: foundPost});
        }
    });
});

router.put("/:id", middleWare.checkAdmin, function(req,res){
    var resultHTML = md.render(req.body.post.content);
    var post = {
        title: req.body.post.title,
        contentMd: req.body.post.content,
        contentHTML: resultHTML,
        coverImg: req.body.post.coverImg,
        description: req.body.post.desc
    };
    Post.findByIdAndUpdate(req.params.id, post, function(err, updatedPost){
        if(err){
            req.flash("error",err);
            return res.redirect("back");
        }
        res.redirect("/posts/" + req.params.id);
    });
});

//delete -- change to display to false
router.delete("/:id", middleWare.checkAdmin, function(req,res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err) {
            req.flash("error",err);
            return res.redirect("back");
        } else {
            foundPost.display = false;
            foundPost.save();
            return res.redirect("/");
        }
    })
})

module.exports = router;