import React from 'react'
import { useEffect, useRef,useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


function ChatMessages() {
    const chatEndRef = useRef(null);
  const getCurrentChatMessages = async (roomId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}chatroom/messages/${roomId}`,
      { withCredentials: true }
    );
    const messages = response.data;
  return {
    messages,
    lastMessage: messages.at(-1) ?? null,
    unseenMessages: messages.filter(
      msg => msg.status === "DELIVERED" || msg.status==="SENT"
    )
  };
  };
  const currentChatRoom= useSelector(state=> state.user.currentChatRoom)
 const currentChatRoomId= currentChatRoom?.roomId;
  const {isLoading,isError,data:currentChatRoomMsg}=useQuery({
    queryKey:["chatroom",currentChatRoomId], 
    queryFn:({queryKey})=>{
      const roomId= queryKey[1];
      return getCurrentChatMessages(roomId)
    },
    enabled: !!currentChatRoomId,
    refetchOnWindowFocus:false,
    staleTime:Infinity,
    retry:2,
  })
  const user = useSelector((state) => state.user.user);
  // const unseenMessage=currentChatRoomMsg?.unseenMessages
// useEffect(() => {
//   if (!currentChatRoom?.roomId || unseenMessage?.length===0) return;
//   mutation.mutate(unseenMessage);
//   console.log("calling mutation");
// }, [currentChatRoom?.roomId, mutation, unseenMessage?.length]);

    const sortedMessages = useMemo(() => [...currentChatRoomMsg?.messages ?? []]?.sort(
    (a, b) => new Date(a.date) - new Date(b.date) 
  ), [currentChatRoomMsg])
      useEffect(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [sortedMessages]); // This will trigger whenever currentChatRoomMsg changes
      if(isLoading) return <div className='w-full flex items-center justify-center '>Loading ...</div>
      if(isError) return  <div className='w-full flex items-center justify-center'> Error occured try again</div>
  return (
    <div className="flex flex-col overflow-y-auto my-2 h-[90%] w-full  custom-scroll p-4">
              {sortedMessages && sortedMessages.length > 0 ? (
                sortedMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.senderId === user.userId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg  my-1 w-fit h-fit px-3 py-1 ${
                        // message.senderId === user.userId
                        //   ? "bg-blue-500 text-white"
                        //   : "bg-gray-300 text-black"
                         message.status === "SEEN"
  ? "bg-purple-200"
  : message.status === "DELIVERED"
    ? "bg-green-200"
    : "bg-red-200"}
                      } `}
                    >
                      <p className="text-[12px] font-semibold">{message.content}
                        <span className="text-[5px] font-bold text-gray-800 relative -bottom-1 right-0 ml-2">
                        {new Date(message.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      </p>
                       
                    </div>
                    <p className="text-[8px] text-black font-semibold  w-fit">
                      {message.senderName}
                     
                    </p>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <h1 className="text-[1.5rem] font-bold text-black">
                    No messages yet
                  </h1>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
  )
}

export default ChatMessages