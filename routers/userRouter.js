const router = require('express').Router()
const bcrypt = require('bcryptjs');
const { findUserById, updateUser, destroyUser } = require('../models/users')

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
