const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const secrets = require("../config/secrets.js");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const middleware = require("../middleware");

//Insert router requires here

const server = express();

//Insert Session options here
const sessionOptions = {
  name: "sprintCookie",
  secret: secrets.jwtSecret,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("../database/dbConfig"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);

module.exports = server;
