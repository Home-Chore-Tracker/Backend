const router = require('express').Router();
const {
  findFamilies,
  findFamilyById,
  addFamily,
  updateFamily,
  destroyFamily
} = require('../models/families');
const { addChild } = require('../models/children');

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
