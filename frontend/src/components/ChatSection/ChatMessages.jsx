import React from 'react'
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
function ChatMessages() {
    const chatEndRef = useRef(null);
      const currentChatRoomMsg = useSelector(
    (state) => state.user.currentChatRoomMsg
  );
  const user = useSelector((state) => state.user).user;
    const sortedMessages = [...currentChatRoomMsg]?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
      useEffect(() => {
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [currentChatRoomMsg]); // This will trigger whenever currentChatRoomMsg changes
    
  return (
    <div className="flex flex-col overflow-y-auto my-2 h-[90%] w-full relative top-[60px] custom-scroll p-4">
              {sortedMessages && sortedMessages.length > 0 ? (
                sortedMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.sender.userId === user.userId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg  my-1 w-fit h-fit px-3 py-1 ${
                        message.sender.userId === user.userId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      } `}
                    >
                      <p className="text-[12px] font-semibold">{message.message}
                        <span className="text-[5px] font-bold text-gray-800 relative -bottom-1 right-0 ml-2">
                        {new Date(message.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      </p>
                       
                    </div>
                    <p className="text-[8px] text-black font-semibold  w-fit">
                      {message.sender.username}
                     
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