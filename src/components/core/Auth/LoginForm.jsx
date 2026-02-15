import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authApi";
import { useDispatch } from "react-redux";

function LoginForm({ setIsloggedIn }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    setIsloggedIn(true);
    dispatch(login(formData.email, formData.password, navigate));
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col w-full gap-y-4 mt-6"
    >
      <label className="w-full">
        <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
          Email Address<sup className="text-pink-200">*</sup>
        </p>

        <input
          required
          type="email"
          id="emailId"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter your Email Address"
          name="email"
          className="bg-gray-800 rounded-[0.5rem] text-gray-100 w-full p-[12px]"
        ></input>
      </label>

      <label className="w-full relative">
        <p className="text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem] font-medium">
          Password<sup className="text-pink-200">*</sup>
        </p>

        <input
          required
          type={showPassword ? "text" : "password"}
          id="password"
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter your Password"
          name="password"
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

        <Link to="/forgot-password">
          <p className="text-xs mt-1 text-blue-100 max-w-max ml-auto">
            Forgot Password
          </p>
        </Link>
      </label>

      <button className="bg-yellow-400 rounded-[8px] font-medium text-gray-900 px-[12px] py-[8px] mt-6">
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
