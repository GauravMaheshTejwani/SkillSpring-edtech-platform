import React from "react";
import { Link } from "react-router-dom";

function CTAButton({ children, linkto, active }) {
  return (
    <Link to={linkto}>
      <div className={`text-centertext-[13px] px-6 py-3 rounded-md font-bold ${active ? "bg-yellow-500 text-black": "bg-gray-800"} hover:scale-95 transition duration-200`}>
        {children}
      </div>
    </Link>
  );
}

export default CTAButton;
