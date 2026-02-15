const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  instructorDashboard,
  updateProfilePicture,
  getEnrolledCourses,
} = require("../controllers/Profile");

router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/instructorDashboard", auth, instructorDashboard);
router.put("/updateProfilePicture", auth, updateProfilePicture);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
