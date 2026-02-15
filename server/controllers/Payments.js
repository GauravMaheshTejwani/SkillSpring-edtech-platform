const { instance } = require("../configs/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccess } = require("../mail/templates/paymentSuccess");
const { default: mongoose } = require("mongoose");
const { useActionData } = require("react-router-dom");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

//initiate payment through razorpay
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res
      .status(200)
      .json({ success: false, message: "Please provide the course id" });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: "Could not find the course",
        });
      }

      const uid = mongoose.Types.ObjectId.createFromHexString(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    try {
      const paymentResponse = await instance.orders.create(options);
      return res.json({
        success: true,
        message: paymentResponse,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

//verify payment
exports.verifySignature = async (req, res) => {
  const razorpay_order_id = req.body?.bodyData?.razorpay_order_id;
  const razorpay_payment_id = req.body?.bodyData?.razorpay_payment_id;
  const razorpay_signature = req.body?.bodyData?.razorpay_signature;
  const courses = req.body?.bodyData?.courses;
  const userId = req.user.id;

  console.log("razorpay_order_id=>", razorpay_order_id);
  console.log("razorpay_payment_id=>", razorpay_payment_id);
  console.log("razorpay_signature=>", razorpay_signature);
  console.log("courses=>", courses);
  console.log("userId=>", userId);

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enroll the student

    await enrollStudents(courses, userId, res);

    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(500).json({ success: false, message: "Payment Failed" });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide the data for courses or userId",
    });
  }

  for (const courseId of courses) {
    try {
      // find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true },
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: true, message: "Course not Found" });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      //find the student and add the course to it
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId, courseProgress: courseProgress._id } },
        { new: true },
      );

      //emailstudent
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Successfully ",
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          enrolledStudent.firstName,
        ),
      );

      console.log("Email Sent Successfully", emailResponse);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      "Successfully Payment Done",
      paymentSuccess(
        amount / 100,
        paymentId,
        orderId,
        enrolledStudent.firstName,
        enrolledStudent.lastName,
      ),
    );

    return res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("error in sending email", error);
    return res.status(500).json({
      success: false,
      message: "Couldnot send the payment succes email",
    });
  }
};

//capture the payment and initiate the razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserId
//     const {course_id} = req.body;
//     const userId = req.user.id;

//     //validation
//     //valid courseId
//     if(!course_id) {
//         return res.json({
//             success: false,
//             message: 'Please provide valid course ID',
//         })
//     };

//     //valid courseDetail
//     let course;
//     try {
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success: false,
//                 message: 'Could not find the course',
//             });
//         }

//         //user already paid for course
//         const uid = new mongoose.Types.ObjectId.createFromHexString(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success: false,
//                 message: 'Student is already enrolled',
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }

//     //create order
//     const amount = course.price;
//     const currency = 'INR';

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     }

//     try {
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //return res
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: 'Could not initial response',
//         })
//     }
// }

//verify signature

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     //three steps to get hashed webhook
//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     //convert to string
//     shasum.update(JSON.stringify(req.body));
//     //convert to hexadecimal string
//     const digest = shasum.digest("hex");

//     if(signature == digest){
//         //payment authorized
//         console.log("Payment is authorized");

//         //now can perform business actions
//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try {
//             //update course ka studentenrolled list
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id: courseId},
//                 {$push: {studentsEnrolled: userId}},
//                 {new: true}
//             );

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Course not found',
//                 })
//             }

//             console.log(enrolledCourse);
//             //add user me course
//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id: userId},
//                 {$push: {courses: courseId}},
//                 {new: true},
//             )

//             //mail send karo confirmation wala
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations",
//                 "Congratulations from Gaurav",
//             )

//             console.log(emailResponse);

//             //return res
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified"
//             })
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 success: false,
//                 message: error.message,
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid Request',
//         })
//     }
// }
