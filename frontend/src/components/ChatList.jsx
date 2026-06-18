import React from 'react'
import Profiles from '././Profiles'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {motion} from "motion/react"
import axios from 'axios';
function ChatList() { 
const user = useSelector(state=>state.user.user);
const userId=user.userId;
 const fetchChatrooms = async (userId) => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}chatroom/user/${userId}`, {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data; // should be a list of chatrooms
  }

const {isLoading,isError,data:chatList=[]}=useQuery({
  queryKey:["chatList",userId],
  queryFn:()=>fetchChatrooms(userId),
  enabled:!!userId,
  refetchOnWindowFocus:false,
  retry:2,
  staleTime:Infinity
})

if(isLoading) return <div className='w-full h-full flex justify-center items-center '>  loading chats ...</div>
if(isError) return <div className='w-full h-full flex justify-center items-center '> Error occured try again</div>
  return (
 
    !user?
    <motion.div className='h-screen w-screen flex justify-center items-center text-black font-bold overflow-y-scroll'
    initial={{opacity:0 ,x:-50}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-50}}
    
    > Loading ....</motion.div>
    
    :
     <motion.div className='w-full h-full flex flex-col pt-4 px-3'
      initial={{opacity:0 ,y:-10}} animate={{opacity:1,y:0}} transition={{duration:.7}}
      >
      <h1 className='text-4xl  md:text-[3vw] font-bold text-black px-4'>Chats</h1>
      <div className='h-fit py-4 overflow-y-auto overflow-x-hidden flex flex-col gap-3'>
        <Profiles username={"Myself"} msg={"hi billionaire what's the pln"} profilePic={user.profilePic} />
      {
    chatList.length>0?chatList.map((chatProfile, index) => {
        const freind= chatProfile.participants?.filter((u)=>u.email!=user.email)[0]
        return(
        <Profiles key={index} username={freind.username}  roomId={chatProfile.id} msg={chatProfile.lastMessage.message} userId={freind.userId} profilePic={freind.profilePic}/>
        )
      } ):<></>
    }
      </div>
    </motion.div>

  )
  
  
}


export default ChatList;
