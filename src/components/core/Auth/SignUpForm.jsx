import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../../slices/authSlice";
import { sendOtp } from "../../../services/operations/authApi";
import { ACCOUNT_TYPE } from "../../../utils/constants";

function SignUpForm({ setIsloggedIn }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("Student");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    if (formData.password != formData.confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    setIsloggedIn(true);
    toast.success("Account Created");
    const accountData = {
      ...formData,
      accountType
    };

    dispatch(setSignupData(accountData));
    dispatch(sendOtp(formData.email, navigate));
    // navigate("/dashboard");

    //reset
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT);
  }

  return (
    <div>
      <div className="flex bg-gray-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
        <button 
        className={`${accountType === "Student" ? "bg-gray-900 text-white" : "bg-transparent text-gray-200"} rounded-full py-2 px-5 transition-all duration-200`}
        onClick={() => setAccountType("Student")}>Student</button>
        <button 
        className={`${accountType === "Instructor" ? "bg-gray-900 text-white rounded-full" : "bg-transparent text-gray-200"} rounded-full py-2 px-5 transition-all duration-200`}
        onClick={() => setAccountType("Instructor")}>Instructor</button>
      </div>

      <form onSubmit={submitHandler}>
        <div className="flex gap-x-4 mt-4">
          <label className="w-full">
            <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
              First Name<sup className="text-pink-200">*</sup>
            </p>

            <input
              required
              type="text"
              name="firstname"
              onChange={changeHandler}
              placeholder="Enter your First Name"
              value={formData.firstname}
              className="bg-gray-800 rounded-[0.5rem] text-gray-100 w-full p-[12px]"
            ></input>
          </label>

          <label className="w-full">
            <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
              Last Name<sup className="text-pink-200">*</sup>
            </p>

            <input
              required
              type="text"
              name="lastname"
              onChange={changeHandler}
              placeholder="Enter your Last Name"
              value={formData.lastname}
              className="bg-gray-800 rounded-[0.5rem] text-gray-100 w-full p-[12px]"
            ></input>
          </label>
        </div>

        <div className="mt-4">
          <label className="w-full">
            <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
              Email Address<sup className="text-pink-200">*</sup>
            </p>

            <input
              required
              type="email"
              name="email"
              onChange={changeHandler}
              placeholder="Enter your Email Address"
              value={formData.email}
              className="bg-gray-800 rounded-[0.5rem] text-gray-100 w-full p-[12px]"
            ></input>
          </label>
        </div>

        <div className="w-full flex mt-4 gap-x-4">
          <label className="w-full relative">
            <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
              Create Password<sup className="text-pink-200">*</sup>
            </p>

            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={changeHandler}
              placeholder="Enter your Password"
              value={formData.password}
              className="bg-gray-800 rounded-[0.5rem] text-gray-100 w-full p-[12px]"
            ></input>

            <span
              className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible
                  fontSize={24}
                  fill="#AFB2BF"
                ></AiOutlineEyeInvisible>
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF"></AiOutlineEye>
              )}
            </span>
          </label>

          <label className="w-full relative">
            <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
              Confirm Password<sup className="text-pink-200">*</sup>
            </p>

            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={changeHandler}
              placeholder="Enter your Password"
              value={formData.confirmPassword}
              className="bg-gray-800 rounded-[0.5rem] text-gray-100 w-full p-[12px]"
            ></input>

            <span
              className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible
                  fontSize={24}
                  fill="#AFB2BF"
                ></AiOutlineEyeInvisible>
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF"></AiOutlineEye>
              )}
            </span>
          </label>
        </div>

        <button className="w-full bg-yellow-400 rounded-[8px] font-medium text-gray-900 px-[12px] py-[8px] mt-6">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
