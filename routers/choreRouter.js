const router = require('express').Router();
const {
  findChores,
  findChoreById,
  addChore,
  updateChore,
  destroyChore
} = require('../models/chores');

/**
 * @swagger
 * /chores:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all chores that belong to the logged-in user
 *    description: Returns all chores that belong to the logged-in user
 *    tags: [Chores]
 *    responses:
 *      200:
 *        description: returns an array of chores for the given user
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.get('/', async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const chores = await findChores(userId);
    res.status(200).json(chores);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /chores/{id}:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns a single chore that belongs to the logged-in user
 *    description: Returns a single chore that belongs to the logged-in user
 *    tags: [Chores]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the chore to retrieve
 *    responses:
 *      200:
 *        description: returns an object of the matching chore for the given ID
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no chore belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const chore = await findChoreById(userId, id);
    if (!chore) {
      return res.status(400).json({
        error: 'No chore found with the given id'
      });
    }
    res.status(200).json(chore);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /chores:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Creates a new chore belonging to the logged-in user
 *    description: Creates a new chore belonging to the logged-in user
 *    tags: [Chores]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: chore
 *        description: The chore to create
 *        schema:
 *          type: object
 *          required:
 *            - title
 *          properties:
 *            title:
 *              type: string
 *            child_id:
 *              type: integer
 *            description:
 *              type: string
 *            duedate:
 *              type: string
 *              format: date
 *            completed:
 *              type: boolean
 *    responses:
 *      201:
 *        description: returns the newly-created chore
 *      400:
 *        description: returned if `Authorization` header is missing, OR if the
 *                     required properties are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.post('/', async (req, res) => {
  const { title } = req.body;
  const chore = req.body;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    if (!title) {
      res.status(400).json({ error: 'Title is required!' });
    } else {
      const newChore = await addChore(userId, chore);
      res.status(201).json(newChore);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /chores/{id}:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Edit the given chore's information
 *    description: Edit the given chore's information
 *    tags: [Chores]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the chore to update
 *      - in: body
 *        name: updates
 *        description: The chore information to update
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *            child_id:
 *              type: integer
 *            description:
 *              type: string
 *            duedate:
 *              type: string
 *              format: date
 *            completed:
 *              type: boolean
 *    responses:
 *      200:
 *        description: returns the updated chore
 *      400:
 *        description: returned if `Authorization` header is missing, OR if none
 *                     of the chore properties were supplied
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  const updates = req.body;
  if (Object.entries(updates).length === 0 && updates.constructor === Object) {
    return res
      .status(400)
      .json({ error: 'Invalid request, req body cannot be empty' });
  }
  try {
    const updated = await updateChore(userId, id, updates);

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /chores/{id}:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the given chore
 *    description: Permanently delete the given chore
 *    tags: [Chores]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the chore to delete
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    await destroyChore(userId, id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
