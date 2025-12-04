import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useCurrentChat } from "../utils/CurrentChatContext";
import { UserIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {  setIsChatOpened} from "../utils/UserRedux/UserSlice.jsx"
import { useDispatch } from "react-redux";
function ChatSection() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user).user;
  const { receiverProfile, addMessages } = useCurrentChat();
  const currentChatRoomMsg = useSelector(
    (state) => state.user.currentChatRoomMsg
  );
const isChatOpened=useSelector(state=>state.user.isChatOpened)
  const [isMenuClicked, setIsMenuClicked] = useState(false);
const dispatch= useDispatch()
  const chatEndRef = useRef(null); // Reference to the chat container for auto-scrolling
// console.log(receiverProfile)
// console.log(user)
  const handleSendMessage = () => {
    // Message send logic
    let receiverName = receiverProfile.username;
    const receiverId= receiverProfile.userId;
    const senderId=user.userId;
    const senderName = user.username;
    const content = message;
// console.log("sending the message")
    addMessages({ senderId, receiverId, senderName, receiverName, content });
    setMessage(""); // clear the input field
  };

  // Sort messages in descending order based on the date & time which causes the in the last of the array and then at rendering it will be at the bottom of the chat section
  const sortedMessages = [...currentChatRoomMsg]?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
const handleBack=()=>{
  dispatch(setIsChatOpened(false));
}
  // Scroll to the bottom whenever the messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      
    }
  }, [currentChatRoomMsg]); // This will trigger whenever currentChatRoomMsg changes

  return (
    <div className={`${isChatOpened?"sm:flex":"hidden"} w-full md:w-[75%] h-screen  md:flex flex-col p-5 pb-1 gap-5 overflow-hidden`} onClick={(e)=>{
      setIsMenuClicked(false)
      console.log("cliecked")
    }}
      >
      {receiverProfile ? (
        <>
          <div className="chatBox h-[90%] w-[100%] flex flex-col relative">
            {/* header section */}
            <div className="header w-[100%] flex flex-row  z-40 bg-gray-200 h-[60px] items-center absolute inset-0">
              <div className="h-full w-full flex flex-row justify-start items-start">
                <div className="flex items-start md:hidden justify-center h-full w-[50px] cursor-pointer hover:bg-gray-300 rounded-lg transition" onClick={handleBack}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </div>
                <div className="rounded-full  flex items-center justify-center h-[50px] overflow-hidden w-[50px] border-2 border-gray-300 bg-white">
                   {  receiverProfile.profilePic? <img
          src={receiverProfile.profilePic}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        : 
        <UserIcon size={30} className="text-gray-500" />
      
    }
                </div>
                <h1 className="text-base font-bold text-black pl-4 pt-3">
                  {receiverProfile.username}
                </h1>
              </div>
              <motion.div className="w-fit h-full" layoutId="menu" onClick={(e)=>{
                e.stopPropagation()
                setIsMenuClicked(prev=>!prev)}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="black"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="black"
                  className="w-6 h-8 cursor-pointer "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </motion.div>
              <AnimatePresence>
                {
                  isMenuClicked && (
<motion.div className="w-[200px] h-fit flex flex-col items-center absolute top-[15px] right-5  bg-white rounded-lg p-4 shadow-lg z-50" layoutId="menu" onClick={(e)=>e.stopPropagation()}>
  <ul className="flex flex-col divide-y w-full space-y-1 text-black text-base font-[500]">
    <li>
      Contact Info
    </li>
     <li>
     Clear Chat
    </li>
     <li>
      Delete Chat
    </li>
     <li>
      Block
    </li>
  </ul>
</motion.div>
                  )
                }
              </AnimatePresence>
            </div>
            {/*  chat section  */}
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
          </div>

          {/*  the input button section */}
          <div className="h-[8%] w-[100%] flex flex-row px-5 gap-4 pb-1 items-center justify-center">
            <textarea
              className="w-[90%] text-s flex  px-4 pt-1 resize-none scrollbar-hidden rounded-lg focus:outline-none h-full z-10 text-neutral-700 font-medium bg-gray-200 placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold"
              type="text"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              className="bg-blue-500 text-white text-base px-3 font-bold rounded-lg flex items-center justify-center h-full"
              onClick={handleSendMessage}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5l15.5-5.5a1 1 0 011.3 1.3L14.5 21l-3.5-7-7-3.5z"
                />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="hidden md:w-full h-full flex justify-center items-center">
          <h1 className="text-[1.5rem] font-bold text-black">WELCOME</h1>
        </div>
      )}
    </div>
  );
}

export default ChatSection;
