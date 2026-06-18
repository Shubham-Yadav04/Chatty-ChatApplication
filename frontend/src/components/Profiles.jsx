import React from 'react'
import { useCurrentChat } from '../utils/CurrentChatContext.jsx';
import { UserIcon } from 'lucide-react';
// import { useWebSocket } from '../utils/WebSocketContext.jsx';
import { useDispatch } from 'react-redux';
import { setCurrentChatRoom } from '../utils/UserRedux/UserSlice.jsx';
import {setIsChatOpened } from '../utils/UserRedux/UserSlice.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback} from 'react';
import { useSelector } from 'react-redux';
function Profiles(props) {
    const { setReceiverProfile } = useCurrentChat();
    const queryClient=useQueryClient()
   const dispatch= useDispatch();
    const currentChatRoomId = useSelector((state) => state.user?.currentChatRoom?.roomId)
    const userId = useSelector((state) => state.user?.user?.userId)
    const markUnseenMessage=async(messages)=>{
      try{
        if(!messages ||messages.length===0)return;
        console.log("mark unseen as seen ", messages)
       await axios.post(`${import.meta.env.VITE_BACKEND_URI}mark-message-seen`,
        messages
      ,{
        withCredentials:true
      })
    }
    catch(e){
      console.log(e.message);
    }
    }
      const mutation= useMutation({
        mutationFn:markUnseenMessage,
        onSuccess:()=>{
          // make the messages in the current chat room with this id as seen and remove the unseen messages make it empty
          queryClient.setQueryData(
            ['chatroom',currentChatRoomId],
             (old) => {
        if (!old) return old;
        return {
          ...old,
          messages: old.messages.map(msg =>
            msg.senderId !== userId &&
            (msg.status === "DELIVERED" || msg.status === "SENT")
              ? { ...msg, status: "SEEN" }
              : msg
          ),
          unseenMessages:[]
        };
      }
          )
        }
      })
    const handleProfileSelection=useCallback(async(props)=>{
setReceiverProfile(props)
dispatch(setIsChatOpened(true));
dispatch(setCurrentChatRoom(props))
const cachedMesages = queryClient.getQueryData([
      "chatroom",
      props.roomId,
    ]);
    const unseen = cachedMesages?.unseenMessages ?? [];
    if (unseen.length > 0) {
      mutation.mutate(unseen);
    }
   }
,[dispatch, mutation, queryClient, setReceiverProfile])
// //    useEffect(()=>{
// //     if(!props.roomId || !stompClient) return 
// //    const subscription= stompClient.subscribe(`/user/queue/private-message/${props.roomId}`, (message) => {
// //         const msg = JSON.parse(message.body);
// //         msg.status="SEEN";
// //         console.log("got a new message what to do ");
// //          queryClient.setQueryData(
// //     ["chatroom", props.roomId],
// //    old => ({
// //     ...old,
// //     messages: [...old.messages, msg],
// //     lastMessage: msg
// //   })
// //   );
// //   stompClient.publish({
// //         destination: "/app/ack-message-seen",
// //         body: {
// //             messageId:msg.messageId,
// //             senderId:msg.senderId,
// //             status:"SEEN"
// //         },
// //       });
// //     })

// return ()=> {
//     subscription.unsubscribe();
// }
//    },[props.roomId, queryClient, stompClient])
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
