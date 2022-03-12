
const dotenv = require("dotenv");
dotenv.config();

// use local strategy for user authentication
//   usernames/passwords
const { Strategy } = require("passport-local");
const { User }     = require(process.env.MONGODB_CONFIG);
const bcrypt       = require("bcryptjs");

module.exports = passport => {
  
  passport.use(

    new Strategy(
      
    {
      usernameField: "email",
    },

    // authenticate user with this credentials
    //  done(<error>, <result>, <options>)
    (email, password, done) => {

      User.findOne({ email })
        .then(user => {
            
            if (!user)
              return done(null, null, { message: "you are not registered" });
            
            // verify password
            bcrypt.compare(password, user.passwordHash, (error, match) => {

                if (error)
                  return done(error, null, { message: "try again  #uyju#" });

                if (!match)
                  return done(null, null, { message: "invalid credentials" });
                
                if (match)
                  return done(null, user, { message: "successfully authenticated" });
                
            });
        })
        .catch(error => done(error, null, { message: "try again  #ihxi#" }));
    })
  );

  // assign serialize/deserialize functions
  //  store user data under sesion cookie
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => 
    User.findById(id).then(user => done(null, user)));

};

