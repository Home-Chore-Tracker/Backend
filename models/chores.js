const db = require('../database/config')

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Object} options
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */
const findChores = async (userId, options = { filter: {} }) => {
  const chores = await db('chores').where({ user_id: userId, ...options.filter })
  return chores
}

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Integer} choreId id of the chore to look for and return if found
 * @param {Object} options
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */
const findChoreById = async (userId, choreId, options = { filter: {} }) => {
  const [chore] = await db('chores')
    .where({ user_id: userId, id: choreId, ...options.filter })
    return chore
}

module.exports = {
  findChores,
  findChoreById
}
