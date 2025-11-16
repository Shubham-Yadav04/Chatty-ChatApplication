import React from "react";
import { useSelector } from "react-redux";
import {
  UserIcon,
  LockIcon,
  MessageCircleIcon,
  BellIcon,
  HelpCircleIcon,
  Share2Icon,
  SettingsIcon
} from "lucide-react";
import axios from 'axios'
import {motion} from 'motion/react'
import { LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import {useWebSocket} from "../utils/WebSocketContext"
import {useDispatch} from "react-redux"
import {setUser} from "../utils/UserRedux/UserSlice"
const settingsOptions = [
  { icon: <LockIcon size={20} className="text-gray-500" />, label: "Account" },
  { icon: <SettingsIcon size={20} className="text-gray-500" />, label: "Privacy" },
  { icon: <MessageCircleIcon size={20} className="text-gray-500" />, label: "Chats" },
  { icon: <BellIcon size={20} className="text-gray-500" />, label: "Notifications" },
  { icon: <HelpCircleIcon size={20} className="text-gray-500" />, label: "Help" },
  { icon: <Share2Icon size={20} className="text-gray-500" />, label: "Invite a Friend" },
];

const SettingPage = () => {


  const {disconnectWebSocket} = useWebSocket()
  const Navigate=useNavigate()
  const dispatch= useDispatch()
  const handleLogout=async()=>{
    console.log("Logout clicked")
const response= await axios.get("http://localhost:8080/user/logout",{
  withCredentials:true,
})
console.log(response.data)
disconnectWebSocket()
if(response.data.Authenticated==="false"){
dispatch(setUser(null));
  Navigate('/')
  }
}
  const user=useSelector((state) => state.user).user;
  return (
    <motion.div className="w-full h-screen bg-gray-200  flex flex-col"initial={{opacity:0 ,x:-50}} animate={{opacity:1,x:0}} transition={{duration:0.2
}}>
      
      <div className="flex items-center gap-4 p-4 border-b">
     {  user.profilePic? <img
          src={user.profilePic}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        :
        <UserIcon size={60} className="text-gray-500" />
      
    }
        <div>
          <h2 className="text-lg font-semibold text-gray-600">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.status?user.status:"Hey there! I am using WhatsApp."}</p>
        </div>
      </div>

      <div className="flex flex-col  gap-2">
        {settingsOptions.map((item, idx) => (
          <button
            key={idx}
            className="flex items-center justify-between px-4 py-3  bg-gray-200 hover:bg-gray-300  hover:outline hover:outline-2 hover:outline-gray-500 focus:outline-gray-500"
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <span className="text-gray-800">{item.label}</span>
            </div>
          </button>
        ))}
          <button
            className="flex items-center justify-between px-4 py-3  bg-gray-200 hover:bg-red-200  hover:outline hover:outline-2 hover:outline-red-500 focus:outline-red-500"
          onClick={()=> handleLogout()}
          >
            <div className="flex items-center gap-4" onClick={()=> handleLogout()}>
            <LogOut size={20} className="text-red-700"/>
              <span className="text-red-600">LogOut</span>
            </div>
          </button>
      </div>

    </motion.div>
  );
};

export default SettingPage;
