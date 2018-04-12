exports.signin = (req, res, next) => {
    res.render('signin');
};

exports.manual = (req, res, next) => {
    res.render('manual', {username: req.user.name});
};