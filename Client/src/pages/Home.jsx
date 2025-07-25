import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen bg-[url("/bg_img.png")] bg-center bg-cover'>
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
