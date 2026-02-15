import React from "react";
import signUpImage from "../assets/Images/signup.webp";
import Template from "../components/core/Auth/Template";
function SignUp({ setIsloggedIn }) {
  return (
    <Template
      title="Welcome Back"
      desc1="Join the millions learning to code with SkillSpring for free."
      desc2="Education to future-proof your carrer."
      image={signUpImage}
      formtype="signup"
      setIsloggedIn={setIsloggedIn}
    ></Template>
  );
}

export default SignUp;
