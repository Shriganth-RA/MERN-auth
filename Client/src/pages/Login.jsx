import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true

      if (state === "Sign Up") {
        const {data} = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
  toast.error(error?.response?.data?.message || "Something went wrong");
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

      <div className="bg-indigo-950 flex flex-col p-10 justify-center items-center m-auto rounded-lg">
        <h2 className="text-white text-2xl font-medium mb-1">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-indigo-400 text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="bg-[#333A5C] rounded-full flex p-2 gap-4 w-80 text-white mb-4">
              <img className="ml-2" src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Username"
              />
            </div>
          )}

          <div className="bg-[#333A5C] rounded-full flex p-2 gap-4 w-80 text-white mb-4">
            <img className="ml-2" src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="bg-[#333A5C] rounded-full flex p-2 gap-4 w-80 text-white mb-4">
            <img className="ml-2" src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
            />
          </div>
          {state === "Login" && (
            <div className="text-indigo-400 cursor-pointer">
              <p
                onClick={() => navigate("/reset-password")}
                className="text-sm"
              >
                Forgot password?
              </p>
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <button className="bg-gradient-to-r from-blue-400 to-blue-800 shadow-md shadow-gray-700 w-30 p-1 rounded-full cursor-pointer text-white font-medium">
              {state === "Sign Up" ? "Signup" : "Login"}
            </button>
          </div>
          <div className="mt-2">
            {state === "Sign Up" ? (
              <h3 className="text-gray-400 text-sm text-center mb-2">
                Already have an account?{" "}
                <span
                  className="cursor-pointer underline text-indigo-400"
                  onClick={() => setState("Login")}
                >
                  Login
                </span>
              </h3>
            ) : (
              <h3 className="text-gray-400 text-sm text-center mb-2">
                Don't have an account?{" "}
                <span
                  className="cursor-pointer underline text-indigo-400"
                  onClick={() => setState("Sign Up")}
                >
                  Signup
                </span>
              </h3>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
