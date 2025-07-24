import React, { useState } from "react";
import { assets } from "../assets/assets";

const Login = () => {
  const [state, setState] = useState("SIgn up");

  return (
    <div>
      <img
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-34 cursor-pointer"
        src={assets.logo}
        alt=""
      />

      <div>
        
      </div>
    </div>
  );
};

export default Login;
