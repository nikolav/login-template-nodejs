const { Router } = require("express");
const passport = require("passport");

const router = Router();

router.get("/dashboard", mw_auth, (req, res) => {
  return res.render("dashboard", { user: req.user });
});

// handle user logins
// send login form
router.get("/login", (req, res) => {
  return res.render("login");
});
// authenticate user with `passport`
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_message", "logged out successfully");
  res.redirect("/login");
});

//
// display register/signup form
router.get("/register", mw_auth, (req, res) => {
  return res.render("register");
});
// hhandle user persistence
router.post("/register", (req, res) => {
  const validation = userInputValidation(req);

  // handle registration errors,
  //   passwords not matching,
  //   weak passwords,
  //   existing user data, etc.
  // rerender signup form if validation failed
  if (validation.errors.length)
    return res.status(403).render("register", { validation });

  // persist user with encrypted password
  // use bcrypt to hash passwords
  // bcrypt.genSalt -> bcrypt.hash -> .then
  // validation.user.passwordHash = bycrypt-hash
  // User.save()
});

//
module.exports = router;
//

//
// helpers
//
function userInputValidation(req) {
  // return validation{}; no throw
  return {
    errors: [],
    input: {},
    user: {},
  };
}

function mw_auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error_message", "youre not logged in");
  res.redirect("/login");
}
