const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/config");
const { generateToken, restricted } = require("../middleware");


/**
 * @swagger
 * tags:
 *  - name: Auth
 *    description:
 *  - name: Users
 *    description:
 *  - name: Families
 *    description:
 *  - name: Children
 *    description:
 *  - name: Chores
 *    description:
 * 
 * securityDefinitions:
 *  JWTKeyHeader:
 *    type: apiKey
 *    in: header
 *    name: Authorization
 */


/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Create a new user account
 *    description: Create a new user account
 *    tags: [Auth]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - password
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      201:
 *        description: returns the newly-created user
 *      400:
 *        description: returned if any of `email`, `name` or `password` are
 *                     missing
 *      500:
 *        description: returned in the event of a server error
 */
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

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Login with an existing user account
 *    description: Login with an existing user account
 *    tags: [Auth]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: credentials
 *        description: Credentials matching an existing user in the database
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: returns the JSON Web Token (JWT) needed to make requests
 *                     against all other routes
 *      400:
 *        description: returned if any of `email` or `password` are missing
 *      401:
 *        description: returned when invalid credentials are supplied
 *      500:
 *        description: returned in the event of a server error
 */
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
      await db('users').where({ email }).update({ jwt: token })
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

/**
 * @swagger
 * /auth/logout:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Logout of logged in account, destroying current session and
 *             invalidating JWT
 *    description: Logout of logged in account, destroying current session and
 *             invalidating JWT
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: current session destroyed and JWT invalidated successfully
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.post("/logout", restricted, async (req, res, next) => {
  // Access to this route handler is granted if a token is supplied via the
  // `Authorization` header as enforced by the `restricted` middleware.
  // Thus, we can ensure there is a `userId` from the decodedJwt.
  const userId = req.decodedJwt.subject
  try {
    // Invalidate the current jwt associated with this user
    await db('users').where({ id: userId }).update({ jwt: null })
    // Next, handle deleting sessions for this user
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          return next(error);
        } else {
          return res.redirect("/");
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
});

module.exports = router;
