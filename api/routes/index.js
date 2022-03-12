const dotenv     = require("dotenv");
const { Router } = require("express");
const passport   = require("passport");
const bcrypt     = require("bcryptjs");

dotenv.config();


const router = Router();

// #protected
router.get("/dashboard", 
  auth_, 
  (req, res) => {
    return res.render("dashboard", { user: req.user || null });
  });

// #protected
router.get("/dashboard-2", 
  auth_, 
  (req, res) => {
    return res.render("dashboard-2", { user: req.user || null });
  });


// handle user logins
// send login form
router.get("/login", 
  authenticated_, 
  (req, res) => res.render("login"));


// authenticate user with `passport-local`
router.post("/login", 

  authenticated_, 

  passport.authenticate("local", {
    successRedirect : "/dashboard",
    successFlash    : true,
    failureRedirect : "/login",
    failureFlash    : true,
  }));

//
// display register/signup form
router.get("/register", 
  authenticated_, 
  (req, res) => {
    return res.render("register");
  });
//
// handle user persistence
router.post("/register", 
  authenticated_,
  (req, res) => {

    // const validation = userInputValidation(req);
    const user = { ...req.body };
    
    // handle registration errors,
    //   passwords not matching,
    //   weak passwords,
    //   existing user data, etc.
    // rerender signup form if validation failed
    // if (validation.errors.length)
    //   return res.render("register", { validation });
    // // `express-validator`
    
    const { User } = require(process.env.MONGODB_CONFIG);

    // `email` lookup
    User.findOne({ email: user.email })
    .then(user_ => {

      if (user_) {
        req.flash("error", "the email is already taken");
        return res.redirect("/register");
      }

      // persist user with encrypted password
      // use bcrypt to hash passwords
      // bcrypt.genSalt -> bcrypt.hash -> .then
      // validation.user.passwordHash = bycrypt-hash
      // User.save()
      bcrypt.genSalt(10, (error, salt) => {
        

        if (error) {
          req.flash("error", "try again  #yzae");
          return res.redirect("/register");
        }

        bcrypt.hash(user.password, salt, 
          (error, passwordHash) => {

          if (error) {
            req.flash("error", "try again  #oiha")
            return res.redirect("/register");
          }

          const newUser = new User({
            name  : user.name,
            email : user.email,
            passwordHash,
          });

          newUser.save()
            .then(newUser_ => {
              req.flash("success", "successfully registered");
              return res.redirect("/login");
            })
            .catch(error => {
              req.flash("error", "try again  #ojxk");
              return res.redirect("/register");
            });
          

        });

      });

    });

  });

// logout
router.delete("/logout", 

  (req, res) => {

    req.logOut();
    req.flash("success", "successfully logged out");
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
// protect routes with this middleware
function auth_ (req, res, next) {

  if (req.isAuthenticated())
    return next();

  req.flash("error", "you are not logged in");
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
