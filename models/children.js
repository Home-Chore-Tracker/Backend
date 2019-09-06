const db = require('../database/config')
const { findChores } = require('./chores')

/**
 * 
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Object} options
 * @param {Boolean} options.expand whether or not to expand nested resources
 */
const findChildren = async (userId, options = { expand: false }) => {
  const children = await db('children')
    .whereIn('family_id', function() {
      this.select('id')
      .from('families')
      .where({ user_id: userId})
    })
  if (options.expand) {
    return Promise.all(children.map(async child => {
      const chores = await findChores(child.id)
      return {
        ...child,
        chores
      }
    }))
  }
  return children
}

/**
 * 
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Integer} childId id of the child to look for and return if found
 * @param {Object} options
 * @param {Boolean} options.expand whether or not to expand nested resources
 */
const findChildById = async (userId, childId, options = { expand: false }) => {
  const [child] = await db('children')
    .whereIn('family_id', function () {
      this.select('id')
        .from('families')
        .where({ user_id: userId })
    })
    .where({ id: childId })
  if (child && options.expand) {
    const chores = await findChores(childId)
    return {
      ...child,
      chores
    }
  }
  return child
}

module.exports = {
  findChildren,
  findChildById
}
