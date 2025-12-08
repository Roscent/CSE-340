// middleware/authMiddleware.js
module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.account = decoded;
        return next();
      } catch (error) {
        res.clearCookie("jwt");
        req.flash("notice", "Please log in to continue.");
        return res.redirect("/account/login");
      }
    }
    
    req.flash("notice", "Please log in to access this page.");
    res.redirect("/account/login");
  }
};