module.exports.auth = function auth(req, res, next) {
  if (req.cookies.uid) {
    next();
    return;
  }
  res.redirect("/login");
};
