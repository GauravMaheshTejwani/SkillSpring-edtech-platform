import React from "react";
import Template from "../components/core/Auth/Template";
import loginImg from "../assets/Images/login.webp";
function Login({ setIsloggedIn }) {
  return (
    <Template
      title="Welcome Back"
      desc1="Build skills for today, tomorrow and beyond."
      desc2="Education to future-proof your carrer."
      image={loginImg}
      formtype="login"
      setIsloggedIn={setIsloggedIn}
    ></Template>
  );
}

export default Login;
