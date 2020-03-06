var express = require("express");
var router = express.Router();
var Tag = require("../models/tag");
var middleWare = require("../middleware");
var config = require("../config/index");
var moment = require("moment-timezone");

router.post("/", middleWare.checkAdmin, function(req,res){
    var newTag = {
        name: req.body.tag.name
    }
    Tag.create(newTag, function(err,createdTag){
        if(err){
            req.flash("error",err);
            console.log(err);
            return res.redirect("back");
        }
        res.redirect("back");
    })
});

router.get("/", function(req,res){
    Tag.find({}).exec(function(err, tags) {
        if(err) {
            req.flash("error", err);
            return res.redirect("back");
        } else {
            return res.render("tags/index", {tags: tags, color: config.tagsColor});
        }
    });
});

router.get("/:id", function(req,res){
    Tag.findById(req.params.id).populate("posts").exec(function(err, tag){
        if(err) {
            req.flash("error", err);
            return res.redirect("back");
        } else {
            return res.render("tags/show", {tag: tag, moment: moment});
        }
    });
});

module.exports = router;