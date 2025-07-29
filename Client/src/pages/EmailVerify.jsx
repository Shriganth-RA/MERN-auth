import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContent";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const inputRef = React.useRef([]);
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      inputRef.current[index].value = char;
    });
  };

  const handleSubmit = async () => {
    try {
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-email`,
        {
          otp,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/");
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, navigate, userData]);

  return (
    <div className="flex flex-row bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-15 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div className="flex flex-col justify-center m-auto bg-indigo-950 text-white text-center px-16 py-10 w-100 rounded-xl">
        <h2 className="text-2xl font-medium mb-4">Verify Email</h2>
        <h5 className="mb-4 text-indigo-300 text-sm">
          Enter 6-digit OTP sent to your email id.
        </h5>
        <div
          className="flex justify-between mb-4 w-60 m-auto"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-8 h-8 bg-white rounded-md gap-2 text-black text-center text-lg"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full w-40 py-2 m-auto text-md font-medium"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
