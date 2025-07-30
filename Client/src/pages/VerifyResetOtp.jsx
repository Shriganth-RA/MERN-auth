import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const { userEmail, backendUrl } = useContext(AppContent);

  const inputRef = useRef([]);

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
        `${backendUrl}/api/auth/verify-reset-otp`,
        { userEmail, otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/new-password");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-row bg-gradient-to-br from-blue-200 to-violet-400 min-h-screen">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-15 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div className="flex flex-col justify-center m-auto bg-indigo-950 w-100 px-16 py-10 rounded-lg">
        <h2 className="text-white text-center text-xl font-medium mb-4">
          Check your email
        </h2>
        <h4 className="text-sm text-center text-indigo-400 mb-2">
          We sent a reset link to {userEmail} enter 6 digit code that mentioned
          in the email
        </h4>
        <div
          className="flex flex-row justify-between w-60 m-auto mb-4"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                className="w-8 h-8 bg-white rounded-md text-center text-black text-lg"
                required
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          onClick={handleSubmit}
          className="text-white bg-gradient-to-br from-blue-400 to-purple-400 w-40 m-auto py-1 rounded-full font-medium"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyResetOtp;
