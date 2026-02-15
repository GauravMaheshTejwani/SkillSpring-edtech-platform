import React from "react";
import frame from "../../../assets/Images/frame.png";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { FcGoogle } from "react-icons/fc";
function Template({ title, desc1, desc2, image, formtype, setIsloggedIn }) {
  return (
    <div className="flex justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0">
      <div className="w-11/12 max-w-[450px]">
        <h1 className="text-gray-100 font-semibold text-[1.875rem] leading-[2.375rem]">
          {title}
        </h1>
        <p className="text-[1.125rem] leading-[1.625rem] mt-4">
          <span className="text-gray-100">{desc1}</span>
          <br></br>
          <span className="text-blue-100 italic">{desc2}</span>
        </p>
        {formtype === "signup" ? (
          <SignUpForm setIsloggedIn={setIsloggedIn}></SignUpForm>
        ) : (
          <LoginForm setIsloggedIn={setIsloggedIn}></LoginForm>
        )}

        <div className="flex w-full items-center my-4 gap-x-2">
          <div className="w-full h-[1px] bg-gray-700"></div>
          <p className="text-gray-700 font-medium leading-[1.375rem]">OR</p>
          <div className="w-full h-[1px] bg-gray-700"></div>
        </div>

        <button className="w-full flex justify-center items-center rounded-[8px] font-medium text-gray-100 border border-gray-700 px-[12px] py-[8px] gap-x-2 mt-6">
          <FcGoogle></FcGoogle>
          <p>Sign in with Google</p>
        </button>
      </div>

      <div className="relative w-11/12 max-w-[450px]">
        <img
          src={frame}
          alt="Pattern"
          width={558}
          height={504}
          loading="lazy"
        ></img>

        <img
          src={image}
          alt="Students"
          width={558}
          height={490}
          loading="lazy"
          className="absolute -top-4 right-4"
        ></img>
      </div>
    </div>
  );
}

export default Template;
