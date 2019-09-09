const db = require('../database/config');

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Object} options
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */
const findChores = async (userId, options = { filter: {} }) => {
  const chores = await db('chores').where({
    user_id: userId,
    ...options.filter
  });
  return chores;
};

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Integer} choreId id of the chore to look for and return if found
 * @param {Object} options
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */
const findChoreById = async (userId, choreId, options = { filter: {} }) => {
  const [chore] = await db('chores').where({
    user_id: userId,
    id: choreId,
    ...options.filter
  });
  return chore;
};

const addChore = async (userId, chore) => {
  const [id] = await db('chores').insert({ ...chore, user_id: userId });

  return findChoreById(userId, id);
};

const updateChore = async (userId, choreId, updates) => {
  await db('chores')
    .where({ user_id: userId, id: choreId })
    .update(updates);
  return findChoreById(userId, choreId);
};

const destroyChore = async (userId, choreId) => {
  await db('chores')
    .where({ id: choreId, user_id: userId })
    .delete();
};

module.exports = {
  findChores,
  findChoreById,
  addChore,
  updateChore,
  destroyChore
};
