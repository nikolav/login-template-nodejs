
// use local strategy for user authentication
//   usernames/passwords
const { Strategy } = require("passport-local");
const { User }     = require("./db");
const bcrypt       = require("bcryptjs");

module.exports = (passport) => {

  passport.use(

    new Strategy({
      usernameField: "email",
    }),


    // authenticate user with this credentials
    //  done(<error>, <result>, <options>)
    (email, password, done) => {
      
      User.findOne({ email })
        .then(user => {
            if (!user)
              return done(null, null, { message: "email is not registered" });
            
            // verify password
            bcrypt.compare(password, user.passwordHash, (error, matches) => {

                if (error)
                  return done(error, null, {message: "try again"});

                if (!matches)
                  return done(null, null, {message: "invalid credentials"})
                
                if (matches)
                  return done(null, user, {message: "validation passed"});
                
            });
        })
        .catch((error) => done(error, null, {message: "try again"}));
    }
  );

  // assign serialize/deserialize functions to store user data under sesion cookie
  passport.serializeUser(   (user, done) => done(null, user.id)     );
  passport.deserializeUser( (id  , done) => User.findById(id, done) );

};

