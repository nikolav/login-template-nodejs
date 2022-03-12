
const dotenv = require("dotenv");
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
const override     = require("method-override");
// const { User } = require("./config/db");
const indexRouter = require(`${appPath}/api/routes/index`);
const apiRouter   = require(`${appPath}/api/routes/api`);


const app         = express();

// method POST request to DELETE
// usage: <form action="/action?_method=DELETE" method="POST">...
app.use(override("_method"));
app.use(logger("dev")); // combined
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // use `qs`
app.use(cookieParser());
app.use(cors());


// setup session usage
// access the session @ `req.session`
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_APIKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// session-flash messages
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// passport-local strategy login setup
require("./config/passport-local-strategy")(passport);


// set global flash messages
// run: `req.flash(<msg_name>, <msg_value>)`
//   before redirects to set messages for next page
app.use((req, res, next) => {
  
  // generic messages
  res.locals.message         = req.flash("message")         || null;
  
  // general app status messages
  res.locals.error           = req.flash("error")           || null;
  res.locals.success         = req.flash("success")         || null;
  res.locals.info            = req.flash("info")            || null;
  res.locals.warning         = req.flash("warning")         || null;
  res.locals.danger          = req.flash("danger")          || null;

  // form status messages
  res.locals.error_message   = req.flash("error_message")   || null;
  res.locals.success_message = req.flash("success_message") || null;
  
  // other mwares
  next();

});


app.use(express.static(path.join(__dirname, "app", "public")));


app.use(require("express-ejs-layouts"));
app.set("views", "views");
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
