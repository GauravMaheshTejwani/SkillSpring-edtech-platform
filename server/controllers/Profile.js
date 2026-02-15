const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get userId
    const userId = req.user.id;

    //validate data
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Please enter gender and Contact Number",
      });
    }
    //find profile and update

    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    //return res
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating Profile",
    });
  }
};

//delete Account
//how can we shedule this delete account and what is cron job
exports.deleteAccount = async (req, res) => {
  try {
    //getId
    const userId = req.user.id;
    //valid id
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //TODO : Unenrole user from all enrolled courses

    //delete user
    await User.findByIdAndDelete({ _id: userId });

    //return res

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting Profile",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    //validation and get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //return res

    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while Getting Account Details",
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });

    return res.status(200).json({ success: true, courses: courseData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const image = req.files.profilePic;

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME,
    );

    const updatedUserImage = await User.findByIdAndUpdate(
      { _id: userId },
      { image: uploadDetails.secure_url },
      { new: true },
    );

    return res.json({
      success: true,
      message: "Image updated Successfully",
      data: updatedUserImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating Profile picture",
      error: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const enrolledCourses = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
        },
      })
      .populate("courseProgress")
      .exec();

    return res.json({
      success: true,
      message: "User Data fetched Successfully",
      data: enrolledCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
