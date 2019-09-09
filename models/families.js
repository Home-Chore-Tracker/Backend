const db = require('../database/config');
const { findChildren } = require('./children');

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Object} options
 * @param {Boolean} options.expand whether or not to expand nested resources
 */
const findFamilies = async (userId, options = { expand: false }) => {
  const families = await db('families').where({ user_id: userId });
  if (options.expand) {
    return Promise.all(
      families.map(async family => {
        const children = await findChildren(userId, {
          filter: { family_id: family.id }
        });
        return {
          ...family,
          children
        };
      })
    );
  }
  return families;
};

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Integer} familyId id of family to look for and return if found
 * @param {Object} options
 * @param {Boolean} options.expand whether or not to expand nested resources
 */
const findFamilyById = async (
  userId,
  familyId,
  options = { expand: false }
) => {
  const [family] = await db('families').where({
    user_id: userId,
    id: familyId
  });
  if (family && options.expand) {
    const children = await findChildren(userId, {
      filter: { family_id: family.id }
    });
    return {
      ...family,
      children
    };
  }
  return family;
};

const addFamily = async (userId, family) => {
  const [id] = await db('families').insert({ ...family, user_id: userId });
  return findFamilyById(userId, id);
};

module.exports = {
  findFamilies,
  findFamilyById,
  addFamily
};
