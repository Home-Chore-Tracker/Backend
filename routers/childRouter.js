const router = require('express').Router();
const {
  findChildren,
  findChildById,
  addChild,
  updateChild,
  destroyChild
} = require('../models/children');

/**
 * @swagger
 * /children:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all children that belong to the logged-in user
 *    description: Returns all children that belong to the logged-in user
 *    tags: [Children]
 *    responses:
 *      200:
 *        description: returns an array of children for the given user
 *        schema:
 *          type: array
 *          description: The children that belong to the authenticated user.
 *          items:
 *            $ref: '#/definitions/ChildExpanded'
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
    const children = await findChildren(userId, { expand: true });
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /children/{id}:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns a single child that belongs to the logged-in user
 *    description: Returns a single child that belongs to the logged-in user
 *    tags: [Children]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the child to retrieve
 *    responses:
 *      200:
 *        description: returns an object of the matching child for the given ID
 *        schema:
 *          $ref: '#/definitions/ChildExpanded'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no child belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const child = await findChildById(userId, id, { expand: true });
    if (!child) {
      return res.status(401).json({
        error: 'No child found with the given id'
      });
    }
    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /children:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Creates a new child belonging to the given family
 *    description: Creates a new child belonging to the given family
 *    tags: [Children]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: child
 *        description: The child to create
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - familyId
 *          properties:
 *            name:
 *              type: string
 *            familyId:
 *              type: integer
 *    responses:
 *      201:
 *        description: returns the newly-created child
 *        schema:
 *          $ref: '#/definitions/Child'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if the
 *                     required properties are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */
router.post('/', async (req, res) => {
  const { name, familyId } = req.body;
  const child = req.body;
  // how we get token
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    if (!name || !familyId) {
      res.status(400).json({ error: 'Child `name` and `familyId` are required!' });
    } else {
      const newChild = await addChild(userId, familyId, child);
      res.status(201).json(newChild);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /children/{id}:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Edit the given child's information
 *    description: Edit the given child's information
 *    tags: [Children]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the child to update
 *      - in: body
 *        name: updates
 *        description: The child information to update
 *        schema:
 *          type: object
 *          required:
 *            - name
 *          properties:
 *            name:
 *              type: string
 *    responses:
 *      200:
 *        description: returns the updated child
 *        schema:
 *          $ref: '#/definitions/Child'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if no
 *                     `name` property was supplied
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
    const updated = await updateChild(userId, id, updates);
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /children/{id}:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the given child
 *    description: Permanently delete the given child
 *    tags: [Children]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the child to delete
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
    await destroyChild(userId, id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
