const router = require('express').Router();
const {
  findChildren,
  findChildById,
  updateChild,
  destroyChild
} = require('../models/children');

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
