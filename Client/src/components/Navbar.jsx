import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='w-full flex flex-row justify-between p-8'>
      <img src={assets.logo} alt="" />
      <button onClick={() => {navigate('/login')}} className='border rounded-full flex items-center px-6 py-2 gap-2 hover:bg-gray-100'>Login <img src={assets.arrow_icon} alt="" /></button>
    </div>
  )
}

export default Navbar;
