const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");
const db = require("../database/config");

async function restricted(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({
      error: 'Missing token from `Authorization` header!'
    })
  }
  try {
    const [user] = await db('users').where({ jwt: token })
    if (!user && token) {
      return res.status(401).json({
        error: 'Invalid token, please try again after re-logging in.'
      })
    } else {
      jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
        if (error) {
          switch (error.name) {
            case 'TokenExpiredError':
            case 'JsonWebTokenError':
              return res.status(401).json({ ...error })
            default:
              return res.status(401).json({
                error: 'Could not verify JWT token. Re-login and try again.'
              })
          }
        } else {
          //The token is a good token!
          req.decodedJwt = decodedToken;
          next();
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
    name: user.name
  };

  const options = {
    expiresIn: "1d"
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = {
  generateToken,
  restricted
};
