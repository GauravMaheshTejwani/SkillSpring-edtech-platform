const User = require("../models/User");
const Otp = require("../models/Otp");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

//send otp
exports.sendOtp = async (req, res) => {
  try {
    //fetch email
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    var otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //check unique otp or not
    let result = await Otp.findOne({ otp: otp });

    while (result) {
      otp = OtpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };

    //create an entry in DB

    const otpBody = await Otp.create(otpPayload);

    //return response
    return res.status(200).json({
      success: true,
      message: "Otp send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signUp

exports.signUp = async (req, res) => {
  try {
    //data fetch from request

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    //validate req, not empty
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //dono password match or not

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and ConfirmPassword should be equal",
      });
    }

    //check user already exist
    const existingUser = await User.findOne({ email });
    console.log("0", existingUser);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already resgistered",
      });
    }

    //recent otp
    const recentOtp = await Otp.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    //validate otp
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not Found",
      });
    } else if (otp !== recentOtp.otp) {
      //Invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    //hash password

    const hashPassword = await bcrypt.hash(password, 10);
    //save in db

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType: accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return res

    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User not able to register, please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //get data

    const { email, password } = req.body;

    //validation data

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    //db me exist karta hai

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User already not registered, please signUp First",
      });
    }
    //generate token

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      //create cookie and send res

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 3600 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

//changePassword

exports.changePassword = async (req, res) => {
  try {
    //get data from req body
    //get email, oldpassword, newpassword, newconfirmPassword
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //validate new == newconfirm, old must be in db

    const userDetails = await User.findById(req.user.id);

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password,
    );

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password cannot be same as old Password",
      });
    }

    if (!isPasswordMatch) {
      //if old wala bhi match nhi hua
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and confirm Password does not match",
      });
    }

    //update in db

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true },
    );

    //send email pass updated

    const emailResponse = await mailSender(
      updatedUserDetails.email,
      "Successfully Updated Password",
      passwordUpdated(updatedUserDetails.email, updatedUserDetails.firstName),
    );

    //return res
    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
      error: error.message,
    });
  }
};
