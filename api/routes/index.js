const dotenv     = require("dotenv");
const { Router } = require("express");
const passport   = require("passport");
const bcrypt     = require("bcryptjs");

dotenv.config();


const router = Router();

router.get("/dashboard", 
  auth_, 
  (req, res) => {
    return res.render("dashboard", { user: req.user || null });
  });

// handle user logins
// send login form
router.get("/login", 
  authenticated_, 
  (req, res) => res.render("login"));
// authenticate user with `passport`
router.post("/login", 
  authenticated_, 
  // (req, res, next) => {
  //   console.log({name: req.body.username, email: req.body.email, password: req.body.password});
  //   next()
  // },
  passport.authenticate("local", {
    successRedirect : "/dashboard",
    failureRedirect : "/login",
    failureFlash    : true,
  }), 
  (req, res, next) => {
    console.log(`login done`)
    next()
  }
  );

//
// display register/signup form
router.get("/register", 
  authenticated_ , 
  (req, res) => {
    return res.render("register");
  });
// handle user persistence
router.post("/register", 
authenticated_, 
(req, res) => {

  // const validation = userInputValidation(req);
  let user = { ...req.body };
  
  // handle registration errors,
  //   passwords not matching,
  //   weak passwords,
  //   existing user data, etc.
  // rerender signup form if validation failed
  // if (validation.errors.length)
  //   return res.render("register", { validation });
  
  
  const { User } = require(process.env.MONGODB_CONFIG);

  User.findOne({ email: user.email })
  .then(user_ => {

    if (user_) {
      req.flash("error_message", "that email is already taken");
      return res.redirect("/register");
    }

    // persist user with encrypted password
    // use bcrypt to hash passwords
    // bcrypt.genSalt -> bcrypt.hash -> .then
    // validation.user.passwordHash = bycrypt-hash
    // User.save()
    bcrypt.genSalt(10, (error, salt) => {
      

      if (error) {
        req.flash("error_message", "try again #yzae#");
        return res.redirect("/register");
      }

      bcrypt.hash(user.password, salt, 
        (error, passwordHash) => {

        if (error) {
          req.flash("error_message", "try again #oiha#")
          return res.redirect("/register");
        }

        user = new User({
          name  : user.name,
          email : user.email,
          passwordHash,
        });

        user.save()
        .then(id => {
          req.flash("success_message", "successfully signed up");
          return res.redirect("/login", 201);
        });

      });

    });

  });

});

// logout
router.delete("/logout", 
  // authenticated_,
  (req, res) => {

    req.logOut();
    req.flash("success_message", "logged out successfully");
    return res.redirect("/login");

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

//
// protect routes with middleware
function auth_ (req, res, next) {

  if (req.isAuthenticated())
    return next();

  req.flash("error_message", "you are not logged in");
  return res.redirect("/login");
}

//
// redirect authenticated users
function authenticated_ (req, res, next) {

  if (req.isAuthenticated()) {
    req.flash("info", "you are logged in");
    return res.redirect("/dashboard");
  }
  
  next();
}
