const jwt = require("jsonwebtoken");

var express = require("express");
var router = express.Router();

const data = [
  {
    id: 1,
    name: "rfgi",
  },
  {
    id: 2,
    name: "hmhl",
  },
];

const user_ = {
  id: "001",
  name: "nikolav",
  password: "111",
};


router.get("/data", mw_auth, (req, res) => {

  return res.json({ user: req.user, data });
});

router.post("/login", (req, res) => {
  const { user } = req.body;
  if (user !== user_.name) 
    return res.sendStatus(401);

  const token = jwt.sign({ user }, "111");

  return res.json({ token });
});

module.exports = router;



function mw_auth (req, res, next) {
  const headerAutorization = req.headers["authorization"];
  const token = headerAutorization?.split(" ")[1];

  if (!token) return res.sendStatus(400);

  jwt.verify(token, "111", (err, user) => {
    if (err) return res.sendStatus(401);

    req.user = user;
    next();
  });
}
