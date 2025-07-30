import React, { useContext, useState } from "react";
import { AppContent } from "../context/AppContent";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NewPassword = () => {
  const navigate = useNavigate();
  const { userEmail, backendUrl } = useContext(AppContent);

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (password !== rePassword) {
        toast.error("Password doesn't match");
      }
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { userEmail, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-200 to-violet-400 min-h-screen">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-15 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div className="flex flex-col justify-center m-auto w-100 px-16 py-10 bg-indigo-950 rounded-lg">
        <h2 className="text-white text-xl font-medium text-center mb-6">
          Change your password
        </h2>
        <p className="text-blue-400 text-sm text-center mb-3">
          Enter a new password below to change your password.
        </p>
        <label className="text-white font-normal text-sm mb-1" htmlFor="">
          Enter new password*
        </label>
        <input
          type="password"
          className="bg-[#333A5C] rounded-full outline-none px-3 py-0.5 mb-2 text-white"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="text-white font-normal text-sm mb-1" htmlFor="">
          Re-enter new password*
        </label>
        <input
          type="password"
          className="bg-[#333A5C] rounded-full outline-none px-3 py-0.5 mb-6 text-white"
          required
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-br from-blue-600 to-purple-600 w-40 py-2 rounded-full m-auto text-white font-medium mb-2"
        >
          Reset password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
