const Section = require("../models/Section");
const Course = require("../models/Course");

//create section
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;

    //data validate
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create section
    const newSection = await Section.create({ name: sectionName });

    //update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true },
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();
    console.log(updatedCourse);

    //return response
    return res.status(200).json({
      success: true,
      message: "Section Created Successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating Section",
      error: error.message,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId } = req.body;

    //data validate
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }
    //update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { name: sectionName },
      { new: true },
    );

    //return res
    return res.status(200).json({
      success: true,
      message: "Section Updated Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while Updating Section",
      error: error.message,
    });
  }
};

//delete section

exports.deleteSection = async (req, res) => {
  try {
    //data input assuming that we are sending in params
    const { sectionId } = req.body;

    //delete data
    const section = await Section.findByIdAndDelete(sectionId);

    //return res
    return res.status(200).json({
      success: true,
      message: "Section Deleted Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while Deleting Section",
      error: error.message,
    });
  }
};
