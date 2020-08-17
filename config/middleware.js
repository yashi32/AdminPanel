//this file contains the middleware we will use for showing flash messages using Noty, we set locals flash and update values when page reloads
module.exports.setFlash = function(req,res,next){
    res.locals.flash = {
        'success':req.flash('success'),
        'error':req.flash('error')
    }

    next();
}