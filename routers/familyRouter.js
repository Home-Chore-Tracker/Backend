const router = require('express').Router();
const {
  findFamilies,
  findFamilyById,
  addFamily
} = require('../models/families');

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
router.put('/:id', async (req, res) => {});
router.delete('/:id', async (req, res) => {});

module.exports = router;
