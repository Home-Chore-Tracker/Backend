/*
# Authentication
POST /api/auth/login
POST /api/auth/register (this acts like POST /api/users)
POST /api/auth/logout
*/

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/config");
const { generateToken } = require("../middleware");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({
      error: "`email`, `name` and `password` are required!"
    });
  }
  try {
    const hash = bcrypt.hashSync(password, 10);
    const [id] = await db("users").insert({
      email,
      name,
      password: hash
    });
    const [user] = await db("users").where({ id });
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "`email` and `password` are required!"
    });
  }

  try {
    const [user] = await db("users").where({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      console.log(token);
      return res.status(200).json({ message: `Welcome ${user.email}`, token });
    } else {
      return res.status(401).json({
        error:
          "You're killing me smalls! You need to provide matching and existing credentials"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});
module.exports = router;
