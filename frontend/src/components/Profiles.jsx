import React from 'react'
import { useCurrentChat } from '../utils/CurrentChatContext.jsx';
import { UserIcon } from 'lucide-react';

import { useWebSocket } from '../utils/WebSocketContext.jsx';
import { useDispatch } from 'react-redux';
import { isChatOpened, setCurrentChatRoom } from '../utils/UserRedux/UserSlice.jsx';
import { addNewMessageToCurrentChatRoomMsg,setIsChatOpened } from '../utils/UserRedux/UserSlice.jsx';
function Profiles(props) {
    const { setReceiverProfile } = useCurrentChat();
   const dispatch= useDispatch();
   const {stompClient}=useWebSocket()
    // const user = useSelector((state) => state.user).user;
    const handleProfileSelection=async(props)=>{
setReceiverProfile(props)

if(props.roomId && stompClient){
    stompClient.subscribe(`/topic/chatroom/${props.roomId}`, (message) => {
        const msg = JSON.parse(message.body);
        console.log(`Received new message in room ${props.roomId}:`, msg);
        dispatch(addNewMessageToCurrentChatRoomMsg(msg));
      })
}
dispatch(setIsChatOpened(true));
dispatch(setCurrentChatRoom(props))

   }
  return (
    <div className='w-full h-[50px] flex p-4 md:px-4  justify-start gap-3 hover:cursor-pointer' onClick={() => handleProfileSelection(props)}>
        <div className='rounded-full  md:h-[40px] md:w-[40px] w-[50px] h-[50px] flex items-center justify-center border-2 border-gray-300  overflow-hidden '>
          { props.profilePic? <img
          src={props.profilePic}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover "
        />
        :
        <UserIcon size={40} className="text-gray-500" />
    }
        </div>
        <div className=' flex flex-col px-1 w-[80%] h-fit justify-start'>
            <h1 className='text-base md:text-sm font-semibold text-black'>{
                props.username? props.username: "ContactName"
                }</h1>
        
            <p className='text-sm md:text-xs font-[500] leading-none  text-black leading-snug truncate w-full text-black text-ellipsis'>
                {
                    props.msg       
                }
      
            </p>
        </div>
      
    </div>
  )
}

export default Profiles
