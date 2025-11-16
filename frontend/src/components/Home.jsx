import { React, useEffect } from 'react'
import ChatSection from './ChatSection'
import { useState } from 'react';
import ChatList from './ChatList';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import Suggestion from './Suggestion';
import UserProfileDashboard from './dashbaord/UserProfileDashBoard';
import { UserIcon } from './Svgs/UserIcon'
import { SettingsIcon } from './Svgs/SettingsIcon'
import { MessageIcon } from './Svgs/MessageIcon'
import { AddFriendsIcon } from './Svgs/AddFriendsIcon'
import { getUserFromUserId } from '../utils/UserRedux/UserSlice'
import { useWebSocket } from '../utils/WebSocketContext';
import SettingPage from './SettingPage';
import {AnimatePresence, motion} from "motion/react"
import axios from 'axios';
function Home() {
  const [loading, setLoading] = useState(true);
  const [sectionValue, setSectionValue] = useState(1)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const checkAuth=async()=>{
await axios.get("http://localhost:8080/check/auth",{
  withCredentials:true
})
  }
  const { connectWebSocket } = useWebSocket();
  useEffect(() => {
checkAuth()
    const authenticated = document.cookie.includes('authenticated=true');
    if (!authenticated) {
      navigate("/login");
    }
    dispatch(getUserFromUserId());
    setLoading(false)
    connectWebSocket()

  }, [dispatch]);

  return (
    <>
      {loading ? <div className=' w-screen h-screen bg-gray-200'>
        <p>Loading...</p>
      </div>
        :
        <div className='w-screen h-screen  bg-gray-200 flex flex-row '>
          <div className="hidden md:flex md:flex-col w-[50px] bg-gray-200 border-r-2 border-gray-400 flex  items-center justify-between h-full">
            <div className=" mt-4">
              <div className="w-[32px] h-[32px]  rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(1)}>
                <MessageIcon />
              </div>
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(2)}>
                <AddFriendsIcon />
              </div>
            </div>
            <div className="mb-4">
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(3)}>
                <SettingsIcon />
              </div>
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(4)}>
                <UserIcon />
              </div>
            </div>
           
          </div>
           <div className="md:hidden fixed bottom-0  w-full flex items-center justify-evenly px-2 z-10 h-[5%] bg-gray-200 z-10 pt-3">
              <div className="w-[32px] h-[32px]  rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(1)}>
                <MessageIcon />
              </div>
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(2)}>
                <AddFriendsIcon />
              </div>
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(3)}>
                <SettingsIcon />
              </div>
<div className="w-[32px] h-[32px] rounded-full flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSectionValue(4)}>
                <UserIcon />
            </div>
            </div>
          <motion.div className=" w-full h-[90%] md:h-full  md:w-[35%] flex flex-col gap-2 bg-gray-200 border-r-2 border-gray-400 transition-all "
          ><AnimatePresence>
            {(() => {
              switch (sectionValue) {
                case 1:
                  return <ChatList />;
                case 2:
                  return <Suggestion />;
                case 3:
                  return <SettingPage />;
                case 4:
                  return <UserProfileDashboard />;
                default:
                  return <ChatList />;
              }
            })()}
            </AnimatePresence>
          </motion.div>
          <ChatSection />
        </div>
      }
    </>
  )
}

export default Home
