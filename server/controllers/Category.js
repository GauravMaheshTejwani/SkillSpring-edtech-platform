const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    //fetch data from req
    const { name, description } = req.body;
    console.log(name, description);

    //validate req
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get categories

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true },
    );

    return res.status(200).json({
      success: true,
      message: "Got all Categories",
      allCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

//catgory wise course list
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;

    //fetch courses for this Id
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        populate: [
          {
            path: "instructor",
          },
          {
            path: "ratingAndReview",
          },
        ],
      })
      .exec();

    //validation is course present
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not Found",
      });
    }

    //get courses for different category
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        populate: [
          {
            path: "instructor",
          },
          {
            path: "ratingAndReview",
          },
        ],
      })
      .exec();

    //get top selling courses
    //HW

    //return res
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addCourseToCategory = async (req, res) => {
  const { courseId, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not Found",
      });
    }

    if (category.courses.includes(courseId)) {
      return res.status(200).json({
        success: true,
        message: "Course already exists in the Category",
      });
    }

    category.courses.push(courseId);
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
