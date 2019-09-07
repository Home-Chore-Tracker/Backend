const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

//Import routes here
const authRouter = require("../routers/authRouter");
const childRouter = require("../routers/childRouter");
const choreRouter = require("../routers/choreRouter");
const familyRouter = require("../routers/familyRouter");
// const userRouter = require("../routers/userRouter");

const secrets = require("../config/secrets.js");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const { restricted } = require("../middleware");

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
    knex: require("../database/config"),
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

//Insert router requires here
server.use("/api/auth", authRouter);
// server.use("/api/users", restricted, userRouter);
server.use("/api/families", restricted, familyRouter);
server.use("/api/children", restricted, childRouter);
server.use("/api/chores", restricted, choreRouter);

module.exports = server;
