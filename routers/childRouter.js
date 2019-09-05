/*
# Child
GET /api/children (returns children specific to logged-in user via `req.userId`)
GET /api/children/:childId
POST /api/children
PUT /api/children/:childId
DELETE /api/children/:childId
*/
const router = require("express").Router;

const Children = require("../dbModels/childRouterModel");
// const restricted = require("../middleware");

router.get("/children", async (req, res) => {
    //Start a Try Catch statement
    try {
      //Create a Children variable that is assigned to the entire table "children" which is being mapped over
      const children = (await db("I will need to be changed")).where({userId}).map(child => {
        //And returning 
        return {
          //Each individual child
          ...child
        };
      });
      //We will also be sending the object of children
      res.json(children);
      //Unless there is an error
    } catch (error) {
      //Then we will return an HTTP status code of 500 and a JSON object
      res.status(500).json({
        //With an explicitly permanent error message
        error: "Error occurred while attempting to get the children"
      });
    }
  });

router.get("/children/:id", (req, res) => {
  //inert content = req.params
  const {id}
  Children.findById(id)
    .then(children => {
      res.json(children);
    })
    .catch(err => res.send(err));
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
