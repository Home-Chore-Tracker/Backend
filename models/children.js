const db = require('../database/config');
const { findChores } = require('./chores');

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Object} options
 * @param {Boolean} options.expand whether or not to expand nested resources
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */
const findChildren = async (
  userId,
  options = { expand: false, filter: {} }
) => {
  const children = await db('children').where({
    user_id: userId,
    ...options.filter
  });
  if (options.expand) {
    return Promise.all(
      children.map(async child => {
        const chores = await findChores(userId, {
          filter: { child_id: child.id }
        });
        return {
          ...child,
          chores
        };
      })
    );
  }
  return children;
};

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Integer} childId id of the child to look for and return if found
 * @param {Object} options
 * @param {Boolean} options.expand whether or not to expand nested resources
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */
const findChildById = async (
  userId,
  childId,
  options = { expand: false, filter: {} }
) => {
  const [child] = await db('children').where({
    user_id: userId,
    id: childId,
    ...options.filter
  });
  if (child && options.expand) {
    const chores = await findChores(userId, { filter: { child_id: child.id } });
    return {
      ...child,
      chores
    };
  }
  return child;
};

const addChild = async (userId, familyId, child) => {
  const [id] = await db('children').insert({
    ...child,
    family_id: familyId,
    user_id: userId
  });
  return findChildById(userId, id);
};

const updateChild = async (userId, childId, updates) => {
  await db('children')
    .where({ user_id: userId, id: childId })
    .update(updates);
  return findChildById(userId, childId);
};

const destroyChild = async (userId, childId) => {
  await db('children')
    .where({ id: childId, user_id: userId })
    .delete();
};

module.exports = {
  findChildren,
  findChildById,
  addChild,
  updateChild,
  destroyChild
};
