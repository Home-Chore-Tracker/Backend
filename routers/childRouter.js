const router = require("express").Router();
const { findChildren, findChildById } = require('../models/children')

router.get("/", async (req, res) => {
  const { decodedJwt } = req
  const userId = decodedJwt.subject
  try {
    const children = await findChildren(userId, { expand: true })
    res.status(200).json(children)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params
  const { decodedJwt } = req
  const userId = decodedJwt.subject
  try {
    const child = await findChildById(userId, id, { expand: true })
    if (!child) {
      return res.status(401).json({
        error: 'No child found with the given id'
      })
    }
    res.status(200).json(child)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
});

router.post("/children", (req, res) => {
  //inert content
});

router.put("/children/:id", (req, res) => {
  //inert content
});

router.delete("/children/:id", (req, res) => {
  //inert content
});

module.exports = router;
