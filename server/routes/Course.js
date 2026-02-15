const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  deleteCourse,
  getFullCourseDetails,
  searchCourse,
} = require("../controllers/Course");

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

const { updateCourseProgress } = require("../controllers/CourseProgress");

router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.get("/getAllCourses", showAllCourses);
router.post("/getCourseDetails", getCourseDetails);

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post("/editCourse", editCourse);
router.post("/addCourseToCategory", addCourseToCategory);
router.delete("/deleteCourse", deleteCourse);
router.post("/getFullCourseDetails", getFullCourseDetails);
router.post("/searchCourse", searchCourse);
module.exports = router;
