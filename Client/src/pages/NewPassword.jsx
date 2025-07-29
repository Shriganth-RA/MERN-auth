import React, { useContext } from "react";
import { AppContent } from "../context/AppContent";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  const { userEmail } = useContext(AppContent);

  return (
    <div className="bg-gradient-to-br from-blue-200 to-violet-400 min-h-screen">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-15 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div>
        <h1>{userEmail}</h1>
      </div>
    </div>
  );
};

export default NewPassword;
