const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const middleware = require("../middleware");

//Insert router requires here

const server = express();

//Insert Session options here

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);

module.exports = server;
