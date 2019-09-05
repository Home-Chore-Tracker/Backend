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
    const children = (await db("I will need to be changed"))
      .where({ userId })
      .map(child => {
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

router.get("/children/:id", async (req, res) => {
  //Destructure the id from the req.params
  const { id } = req.params;
  //Start a Try Catch statement
  try {
    //Create a array assignment that is assigned to the table "I will need to be changed" using a where filter to specifically find the child with the previously destructured id value
    let [child] = await db("I will need to be changed").where({ id });
    //If the child has no value
    if (!child) {
      //Then return an HTTP error code of 404
      return res.status(404).json({
        //And also send back a JSON object with an explicit error message
        error: `child with 'id' ${id} does not exist`
      });
      //If there is a value for child
    } else {
      //Then assign the variable of chores to be the foreign ID of all chores that have the matching child id
      const chores = await db("chores").where({ child_id: id });
      //   //Then assign the variable of resources to be the foreign ID of all resources that have an assignment to the previously specified child id
      //   //~~~Litteral Translation~~~
      //   //Create resources variable, Do not continue until the following is done
      //   //1. Using the table "resources" use the .whereIn() filter. This takes two arguments. First is an integer which in this case represents the id that is apart of the req.params, and the second is an anonymous callback function
      //   //2. SELECT resource_id FROM child_resources (a column) WHERE the child_id matches the id destructured up above
      //   const resources = await db("resources").whereIn("id", function() {
      //     this.select("resource_id")
      //       .from("child_resources")
      //       .where({ child_id: id });
      //   }
      //   );

      //The child will then be presented as a single object, with its details in the root of the object, the chores as an array in the roote of the object and the resources as an array in the root of the object
      child = { ...child, chores /*, resources */ };
      //Then we are going to return that child object as a JSON object
      return res.json(child);
    }
    //Unless there is an error message
  } catch (error) {
    //Then we will return an error message with an HTTP status code of 500
    res.status(500).json({
      //And an explicit error message
      error: "Error occurred while attempting to get the child"
    });
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
