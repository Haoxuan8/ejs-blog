var express = require("express");
var router = express.Router();
var config = require("../config/index");
var User = require("../models/user"),
    Post = require("../models/post");
var passport = require("passport");
var moment = require("moment-timezone");

var postsNumEachPage = config.app.eachPageShow;

router.get("/", function(req,res){
    Post.find({display: true}).sort('-meta.createTime').limit(postsNumEachPage).populate('tags').exec(function(err, posts){
        if(posts.length == 0 && Number(req.params.num)!= 1) return res.redirect("/");
        Post.countDocuments({display: true}, function(err, count){
            res.render("index", {posts: posts, count: count, moment: moment, page: 1, postsNumEachPage: postsNumEachPage});
        });
    });
});

router.get("/page/:num", function(req,res){
    Post.find({display: true}).sort('-meta.createTime').skip(postsNumEachPage*(Number(req.params.num)-1))
    .limit(postsNumEachPage).populate('tags').exec(function(err, posts){
        if(posts.length == 0 && Number(req.params.num)!= 1) return res.redirect("/");

        Post.countDocuments({display: true}, function(err, count){
            res.render("index", {posts: posts, count: count, moment: moment, page: req.params.num, postsNumEachPage: postsNumEachPage});
        });
    });
});

router.get("/login", function(req,res){
    if(req.user){
       return res.redirect("/page/1");
    }
    res.render("login");
});

router.post("/login", checkLogin,function(req,res){
});

//logout
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/page/1");
});


//validLogin?
function checkLogin(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.redirect("/"); }
        if (!user) { 
            req.flash("error", "WRONG!");
            return res.redirect('/login');
         }
        req.logIn(user, function(err) {
          if (err) { return res.redirect("/"); }
          req.flash("success", "Welcome!");
          return res.redirect("/");
        });
      })(req, res, next);
}

module.exports = router;