const mailSender = require("../utils/mailSender");
const { contactUsEmail } = require("../mail/templates/contactFormRes");

exports.contactUs = async (req, res) => {
  const { firstName, lastName, email, message, phoneNo } = req.body;

  if (!firstName || !email || !message) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const data = {
      firstName,
      lastName: `${lastName ? lastName : "null"}`,
      email,
      message,
      phoneNo: `${phoneNo ? phoneNo : "null"}`,
    };

    await mailSender(
      process.env.OWNER_EMAIL,
      "Enquiry",
      contactUsEmail(email, firstName, lastName, message, phoneNo),
    );

    return res.json({
      success: true,
      message: "Your message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something wen wrong",
      error: error.message,
    });
  }
};
