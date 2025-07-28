import React from "react";
import { assets } from "../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-15 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div className="flex flex-col justify-center m-auto bg-indigo-950 text-white text-center px-16 py-10 rounded-xl">
        <h2 className="text-2xl font-medium mb-4">Verify Email</h2>
        <h5 className="mb-4">Enter 6-digit OTP sent to your email id.</h5>
        <div className="flex justify-between">
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required className="w-8 h-8 bg-white rounded-md gap-2 text-black text-center text-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
