/*
# Authentication
POST /api/auth/login
POST /api/auth/register (this acts like POST /api/users)
POST /api/auth/logout
*/

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "`username` and `password` are both required!"
    });
  }
  try {
    const hash = bcrypt.hashSync(password, 10);
    const [id] = await db("/* Insert db name */").insert({
      username,
      password: hash
    });
    const [user] = await db("/* Insert db name */").where({ id });
    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
