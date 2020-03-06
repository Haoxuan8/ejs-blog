var middlewareObj = {};

middlewareObj.checkAdmin = function(req,res,next) {
    if(req.user && req.user.role == "admin") {
        return next();
    }
    else {
        req.flash("error", "Access Denied.")
        res.redirect("/");
    }
}

module.exports = middlewareObj