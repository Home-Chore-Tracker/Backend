/*
# Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
*/

//Instantiate express router
const router = require("express").Router();
//Instantiate bcrypt
const bcrypt = require("bcryptjs");
//Create db that is pointed to the config file for Knex
const db = require("../database/config");
//Import the function from the middleware folder
const { generateToken } = require("../middleware");
//Instantiate the jsonwebtoken
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  //Pull the email password and name from the body
  const { email, password, name } = req.body;
  //Checks to make sure that they were all provided
  if (!email || !password || !name) {
    //If not, send a HTTP 400 and and error message
    return res.status(400).json({
      error: "`email`, `name` and `password` are required!"
    });
  }
  //If they are then use a try catch to handle the promise
  try {
    //This line hashes the pw
    const hash = bcrypt.hashSync(password, 10);
    //[id] is the created user in the db table "users"
    const [id] = await db("users").insert({
      email,
      name,
      password: hash
    });
    //[user] is the newly created user account
    const [user] = await db("users").where({ id });
    //Return a 201 status and the user object
    return res.status(201).json(user);
    //If there is an issue or error
  } catch (error) {
    //Then return the 500 HTTP code and an error message
    res.status(500).json({
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  //Pulls the email and pw from the body
  const { email, password } = req.body;
  //checks to see if there is both a username and pw
  if (!email || !password) {
    //If not, then return a http 400 and an error message
    return res.status(400).json({
      error: "`email` and `password` are required!"
    });
  }
  //If they are
  try {
    //Pulls the user from the db where the email matches
    const [user] = await db("users").where({ email });
    //If the email matches a record AND the hashed pw is the same
    if (user && bcrypt.compareSync(password, user.password)) {
      //Generate a token for the user
      const token = generateToken(user);
      //Print the token in the console
      console.log(token);
      //Return the http status of 200 and a message addressing the user by email and their token
      return res.status(200).json({ message: `Welcome ${user.email}`, token });
      //If the email and hashed pw doesnt match
    } else {
      //Then return an http status code of 401
      return res.status(401).json({
        //And this error message
        error: "The credentials you provided do not match"
      });
    }
    //If they match, but there is an issue
  } catch (error) {
    //Return the http 500 code
    res.status(500).json({
      //And this error message
      error: error.message
    });
  }
});

router.get("/logout", (req, res, next) => {
  //If there is an active session
  if (req.session) {
    //Destroy the session for the user
    req.session.destroy(function(err) {
      //If there is an error
      if (err) {
        //Return the error and stop the action
        return next(err);
        //If it was successful
      } else {
        //Redirect the user to the main urk%%
        return res.redirect("/");
      }
    });
  }
});
module.exports = router;
