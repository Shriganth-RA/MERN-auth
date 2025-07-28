import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, backendUrl, setIsLoggedin } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {}, // No need to send userId anymore
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex flex-row justify-between py-8 px-20">
      <img src={assets.logo} alt="" />
      {userData ? (
        <div className="bg-blue-900 w-8 h-8 flex justify-center items-center text-white rounded-full relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden top-0 right-0 z-10 group-hover:block text-black pt-10">
            <ul className="bg-gray-100 m-0 p-2 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            navigate("/login");
          }}
          className="border rounded-full flex items-center px-6 py-2 gap-2 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
