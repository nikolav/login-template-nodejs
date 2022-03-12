const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

// const { User } = require("./config/db");

const appPath = path.resolve(__dirname, ".");
const app = express();
const indexRouter = require(`${appPath}/api/routes/index`);
const apiRouter = require(`${appPath}/api/routes/api`);

app.use(logger("dev")); // combined
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // use `qs`
app.use(cookieParser());
app.use(cors());

// setup session usage
////// Access the session as req.session
// app.get('/', function(req, res, next) {
//     if (req.session.views) {
//       req.session.views++
//       res.setHeader('Content-Type', 'text/plain')
//       res.write('#views: ' + req.session.views)
//       res.end()
//     } else {
//       req.session.views = 1
//       res.end('welcome to the session demo. refresh!')
//     }
//   })
app.use(
  session({
    secret: password.env.EXPRESS_SESSION_APIKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// and session-flash messages
app.use(flash());
// set global flash messages
// run: `req.flash(<msg_name>, <msg_value>)`
// before redirects to set variables for next page
app.use((req, res, next) => {
  res.locals.error_message   = req.flash("error_message")   || null;
  res.locals.error           = req.flash("error")           || null;
  res.locals.success_message = req.flash("success_message") || null;
  // run other mdwares
  next();
});


// require("./config/passport-local")(passport);



app.use(express.static(path.join(__dirname, "app", "public")));

app.set("views", "views");
app.set("view engine", "ejs");

// ejs-layouts setup
// https://github.com/soarez/express-ejs-layouts.git
app.set("layout", "layout/index");
app.set("layout extractMetas", true);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(require("express-ejs-layouts"));

app.use("/", indexRouter);
app.use("/api", apiRouter);

module.exports = app;
