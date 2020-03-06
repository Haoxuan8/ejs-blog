var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local");

var User = require("./models/user");
var config = require("./config/index");
var fs = require("fs");
var MarkdownIt = require('markdown-it');
var sassMiddleware = require("node-sass-middleware");

var indexRoutes = require("./routes/index"),
    postRoutes = require("./routes/posts"),
    tagRoutes = require("./routes/tags"),
    archiveRoutes = require("./routes/archive"),
    friendRoutes = require("./routes/friends");

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


//use sass
app.use(
    sassMiddleware({
      src: __dirname + '/scss',
      dest: __dirname + '/public/css',
      debug: true,
      outputStyle: 'compressed',
      prefix: '/css'
    })
);

mongoose.connect(config.database.url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//password configuration
app.use(require("express-session")({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.menu = config.app.navbarMenu;
    next();
});

app.use('/',indexRoutes);
app.use('/posts',postRoutes);
app.use('/tags',tagRoutes);
app.use('/archive',archiveRoutes);
app.use('/friends', friendRoutes);

app.get("/about", function(req,res){
    fs.readFile("./config/about.md", {encoding: 'utf-8'}, function(err, data){
        var aboutHTML = md.render(data);
        res.render("about", {content: aboutHTML});
    });
});

app.get("*", function(req,res){
    return res.redirect("/");
});

app.listen(config.port, function(){
    console.log("Server Has Started!"); 
});


module.exports = app;