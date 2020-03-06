var express = require("express");
var router = express.Router();
var config = require("../config/index");
var Post = require("../models/post");
var moment = require("moment-timezone");

router.get("/", function(req,res){
    Post.find({display: true}).sort('-meta.createTime').exec(function(err, posts){
        if(err) {
            req.flash("err",err);
            return res.redirect("back");
        } else {
            return res.render("archive", {posts: posts, moment: moment})
        }
    });
});

module.exports = router;