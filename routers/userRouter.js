const router = require('express').Router()
const bcrypt = require('bcryptjs');
const { findUserById, updateUser, destroyUser } = require('../models/users')

/**
 * @swagger
 * /users/me:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns the identity of the currently-logged in user
 *    description: Returns the identity of the currently-logged in user
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Information about the logged-in user
 *        schema:
 *          $ref: '#/definitions/UserExpanded'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.get('/me', async (req, res) => {
  const { decodedJwt } = req
  const userId = decodedJwt.subject
  try {
    const user = await findUserById(userId)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

/**
 * @swagger
 * /users/me:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Edit the current user's information
 *    description: Edit the current user's information (`name`, `email`, and/or
 *             `password`)
 *    tags: [Users]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: updates
 *        description: Info to update for an existing user
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: returns the user with their updated information
 *        schema:
 *          $ref: '#/definitions/User'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if 
 *                     any of `email`, `name` or `password` are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.put('/me', async (req, res) => {
  const { decodedJwt } = req
  const userId = decodedJwt.subject
  const updates = req.body
  if (Object.entries(updates).length === 0 && updates.constructor === Object) {
    return res.status(400).json({
      error: 'Invalid request body! Must provide at least one of the ' +
        'following: `name`, `email`, and/or `password`'
    })
  }
  if (updates.password) {
    const hash = bcrypt.hashSync(updates.password, 10)
    updates.password = hash
  }
  try {
    const user = await updateUser(userId, updates)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

/**
 * @swagger
 * /users/me:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the user from the database
 *    description: Permanently delete the user from the database
 *    tags: [Users]
 *    responses:
 *      204:
 *        description: returns nothing if successful
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.delete('/me', async (req, res) => {
  const { decodedJwt } = req
  const userId = decodedJwt.subject
  try {
    await destroyUser(userId)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

module.exports = router
