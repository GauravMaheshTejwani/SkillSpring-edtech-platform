const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

//function to sendemail
async function sendverificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from SkillSpring",
      otpTemplate(otp),
    );
    console.log("Email sent SuccessFuly", mailResponse);
  } catch (error) {
    console.log("Error while sending email", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  await sendverificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("Otp", otpSchema);
