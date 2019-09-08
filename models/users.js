const db = require('../database/config')
const { findFamilies } = require('../models/families')

/**
 * 
 * @param {Integer} userId id of the currently-authenticated user
 */
const findUserById = async userId => {
  const [user] = await db('users').where({ id: userId })
  const families = await findFamilies(userId)
  if (user) {
    return {
      ...user,
      families
    }
  }
}

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Object} updates object containing the desired properties of user to
 *                         update (any of `name`, `email`, or `password`)
 */
const updateUser = async (userId, updates) => {
  await db('users').where({ id: userId }).update(updates)
  const user = await findUserById(userId)
  return user
}

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 */
const destroyUser = async userId => {
  await db('users').where({ id: userId }).delete()
}

module.exports = {
  findUserById,
  updateUser,
  destroyUser
}
