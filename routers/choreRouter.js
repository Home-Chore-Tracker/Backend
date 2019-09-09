const router = require('express').Router();
const {
  findChores,
  findChoreById,
  addChore,
  updateChore,
  destroyChore
} = require('../models/chores');

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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const chore = await findChoreById(userId, id);
    if (!chore) {
      return res.status(401).json({
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
      res.status(200).json(newChore);
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
