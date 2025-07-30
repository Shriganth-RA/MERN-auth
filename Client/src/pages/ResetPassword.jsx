import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl, setUserEmail } = useContext(AppContent);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleResetOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      if (data.success) {
        toast.success(data.message);
        setUserEmail(email);
        localStorage.setItem("userEmail", email);
        navigate("/verify-reset-otp");
      } else {
        toast.error(data.messge);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-row bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-15 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div className="flex flex-col justify-center m-auto w-120 px-16 py-10 bg-indigo-950 rounded-xl">
        <h2 className="text-white text-2xl font-medium mb-6 text-center">
          Forgot your password
        </h2>
        <h5 className="text-indigo-400 text-sm text-center mb-4">
          Please enter your email address you'd like your password reset OTP
          sent to
        </h5>
        <label htmlFor="email" className="text-white mb-2">
          Enter email address
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="bg-[#333A5C] outline-none rounded-full px-4 py-1 mb-4 text-white"
          type="email"
          name="email"
          required
        />
        <button
          onClick={handleResetOtp}
          className="bg-gradient-to-br from-blue-600 to-purple-600 w-40 py-2 rounded-full m-auto text-white font-medium mb-2"
        >
          Request reset OTP
        </button>
        <h4
          className="text-center text-sm text-indigo-400 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Back To Login
        </h4>
      </div>
    </div>
  );
};

export default ResetPassword;
