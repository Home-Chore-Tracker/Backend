const router = require('express').Router();
const {
  findFamilies,
  findFamilyById,
  addFamily,
  updateFamily,
  destroyFamily
} = require('../models/families');
const { addChild } = require('../models/children');

/**
 * @swagger
 * /families:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all families that the logged-in user belongs to
 *    description: Returns all families that the logged-in user belongs to
 *    tags: [Families]
 *    responses:
 *      200:
 *        description: returns an array of families for the given user
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
    const families = await findFamilies(userId, { expand: true });
    res.status(200).json(families);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /families/:id:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns a single family that the logged-in user belongs to
 *    description: Returns a single family that the logged-in user belongs to
 *    tags: [Families]
 *    parameters:
 *      - in: path
 *        name: familyId
 *        required: true
 *        type: integer
 *        description: ID belonging to the family to retrieve
 *    responses:
 *      200:
 *        description: returns an object of the matching family for the given ID
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no family belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const family = await findFamilyById(userId, id, { expand: true });
    if (!family) {
      return res.status(401).json({
        error: 'No family found with the given id'
      });
    }
    res.status(200).json(family);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /families:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Creates a new family belonging to the logged-in user
 *    description: Creates a new family belonging to the logged-in user
 *    tags: [Families]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: family
 *        description: The family to create
 *        schema:
 *          type: object
 *          required:
 *            - surname
 *          properties:
 *            surname:
 *              type: string
 *    responses:
 *      201:
 *        description: returns the newly-created family
 *      400:
 *        description: returned if `Authorization` header is missing, OR if the
 *                     required `surname` property is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.post('/', async (req, res) => {
  const { surname } = req.body;
  const family = req.body;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    if (!surname) {
      res.status(400).json({ error: 'Family name is require!' });
    } else {
      const newFamily = await addFamily(userId, family);
      res.status(201).json(newFamily);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//This is posting a new child to a family

router.post('/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const child = req.body;
  // how we get token
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    if (!name) {
      res.status(400).json({ error: 'Child name is require!' });
    } else {
      const newChild = await addChild(userId, id, child);
      res.status(201).json(newChild);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /families/:id:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Edit the given family's information
 *    description: Edit the given family's information
 *    tags: [Families]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: familyId
 *        required: true
 *        type: integer
 *        description: ID belonging to the family to update
 *      - in: body
 *        name: updates
 *        description: The family information to update
 *        schema:
 *          type: object
 *          required:
 *            - surname
 *          properties:
 *            surname:
 *              type: string
 *    responses:
 *      200:
 *        description: returns the updated family
 *      400:
 *        description: returned if `Authorization` header is missing, OR if no
 *                     `surname` property was supplied
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
    res
      .status(400)
      .json({ error: 'Invalid request, req body cannot be empty' });
  }
  try {
    const updated = await updateFamily(userId, id, updates);
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /families/:id:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the given family
 *    description: Permanently delete the given family
 *    tags: [Families]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: familyId
 *        required: true
 *        type: integer
 *        description: ID belonging to the family to delete
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
    await destroyFamily(userId, id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
