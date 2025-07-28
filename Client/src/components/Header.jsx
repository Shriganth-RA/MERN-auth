import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContent";

const Header = () => {

  const { userData } = useContext(AppContent);

  return (
    <div className="w-full flex flex-col items-center text-center">
      <img className="w-50 m-auto" src={assets.header_img} alt="" />
      <h1 className="flex items-center text-3xl font-medium mb-2 gap-2">
        Hey {userData ? userData.name : 'Developer'}!{" "}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />{" "}
      </h1>
      <h2 className="text-4xl mb-2 font-bold">Welcome to our app</h2>
      <p className="w-120 mb-10 text-lg m-auto">
        Let's start with a quick product tour and we will have you up and
        running in no time!
      </p>
      <button className="border rounded-full px-6 py-2 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
