const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  create,
  update,
  deleteProject,
  getUserProjects,
  getProjectDetails,
  addTeamMember,
  transferOwnership,
  updateLastUsed,
  changeUserAccessLevel, 
  removeTeamMember,
  getProjectsDetails
} = require("../controllers/project-controller");

router.use(auth);

router.post("/create", create);
router.post("/update", update);
router.delete("/deleteProject/:id", deleteProject);
router.get("/getUserProjects", getUserProjects);
router.put("/updateLastUsed/:id", updateLastUsed); //created by Einstein
router.get("/getProjectDetails/:id", getProjectDetails);
router.get("/getProjectsDetails", getProjectsDetails);
router.put("/addTeamMember/:id", addTeamMember);
router.post("/transferOwnership/:id", transferOwnership);
router.post("/:id/changeUserAccessLevel", changeUserAccessLevel);
router.post("/:id/removeTeamMember", removeTeamMember);

module.exports = router;
