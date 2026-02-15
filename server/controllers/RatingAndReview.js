const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating and review

exports.createRating = async (req, res) => {
  try {
    //get userid
    const userId = req.user.id;

    //fetch data from req
    const { rating, review, courseId } = req.body;

    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the Course",
      });
    }

    //check if user already reviewed or not
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Student has already reviewed the Course",
      });
    }

    //creat rating
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update this to course

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingReview._id,
        },
      },
      { new: true },
    );

    console.log(updatedCourseDetails);
    console.log("ratingReview", ratingReview);

    //return res
    return res.status(200).json({
      success: true,
      message: "Created Rating and Review successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating Rating and Review",
    });
  }
};

//get Avg rating and review

exports.getAverageRating = async (req, res) => {
  try {
    //get CourseId
    const courseId = req.body.courseId;

    //get avg rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Schema.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          avergeRating: { $avg: "rating" },
        },
      },
    ]);

    console.log(result);

    //return res
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        avergeRating: result[0].avergeRating,
      });
    }

    //if no rating then avg = 0
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0, no ratings till now",
      avergeRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get All rating and review for all courses

exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
