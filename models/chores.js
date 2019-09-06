const db = require('../database/config')

const findChores = async (childId, options = { expand: false }) => {
  /**
   * TODO - need to update this function to not depend on `childId` and instead
   * make use of nest `SELECT` statement or joins like the children model does.
   */
  const chores = await db('chores').where({ child_id: childId })
  return chores
}

const findChoreById = async (userId, childId, options = { expand: false }) => {
  /**
   * TODO - need to complete
   */
}

module.exports = {
  findChores,
  findChoreById
}
