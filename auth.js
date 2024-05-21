module.exports.auth = function auth(req, res, next) {
  if (req.cookies.uid) {
    console.log("here");
    next();
    return;
  }
  res.redirect("/");
};
