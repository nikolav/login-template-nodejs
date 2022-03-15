
const dotenv = require("dotenv");
// dotenv.config();
  dotenv.config();

const path         = require("path");
const appPath      = path.resolve(__dirname, ".");

const express      = require("express");
const cookieParser = require("cookie-parser");
const logger       = require("morgan");
const cors         = require("cors");
const session      = require("express-session");
const flash        = require("connect-flash");
const passport     = require("passport");
const MongoStore   = require("connect-mongo");
const override     = require("method-override");

const indexRouter = require(`${appPath}/api/routes/index`);
const apiRouter   = require(`${appPath}/api/routes/api`);

const app = express();


// method POST request to DELETE
//   usage: <form action="/action?_method=DELETE" method="POST">
app.use(override("_method"));

// app.use(logger("combined")); // prod.
app.use(logger("dev")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // use `qs`
app.use(cookieParser());
app.use(cors());

// session setup
// access @ `req.session`
app.use(
  session({

    secret: process.env.EXPRESS_SESSION_APIKEY,

    // ignore blank sessions
    resave: false,
    saveUninitialized: false,

    // mongodb session storage engine
    store: MongoStore.create({
      mongoUrl       : process.env.MONGODB_URI, 
      collectionName : process.env.MONGODB_COLLECTION_SESSIONDATA,   
    }),

    // invalidate session cookie in 14 days
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

// session-flash messages
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// passport-local strategy login setup
require("./config/passport-local-strategy")(passport);


// global flash messages
//   accessible in views
// run: `req.flash(<msg_name>, <msg_value>)`
//   before redirects to set messages for next page
app.use((req, res, next) => {
  
  // generic message
  res.locals.message  = req.flash("message")  || null;
  
  // general app status messages
  res.locals.error    = req.flash("error")    || null;
  res.locals.success  = req.flash("success")  || null;
  res.locals.info     = req.flash("info")     || null;
  res.locals.warning  = req.flash("warning")  || null;
  res.locals.danger   = req.flash("danger")   || null;

  // vardump locals
  // debug only in dev
  res.locals.locals = 
    JSON.stringify(res.locals, null, 2) || null;


  // other mwares
  next();

});

// send static content
app.use(express.static(path.join(__dirname, "app", "public")));


// setup view engine
app.set("views", "views");

// use layouts
app.use(require("express-ejs-layouts"));
app.set("view engine", "ejs");

// ejs-layouts setup
// https://github.com/soarez/express-ejs-layouts.git
app.set("layout", "layout/index");
app.set("layout extractMetas"  , true);
app.set("layout extractStyles" , true);
app.set("layout extractScripts", true);



// mount routes
app.use("/", indexRouter);
app.use("/api", apiRouter);


module.exports = app;
