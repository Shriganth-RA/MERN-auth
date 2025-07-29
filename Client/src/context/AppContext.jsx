import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { AppContent } from "./AppContent";

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const getUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  }, [backendUrl]);

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/auth/is-authenticated`,
        { withCredentials: true }
      );
    //   console.log("Auth response : " + data);
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      setIsLoggedin(false);
      toast.error(
        error?.response?.data?.message || error.message || "Auth check failed"
      );
    }
  }, [backendUrl, getUserData]);

  useEffect(() => {
    const fetchData = async () => {
      await getAuthState();
    };
    fetchData();
  }, [getAuthState]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    userEmail,
    setUserEmail,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
