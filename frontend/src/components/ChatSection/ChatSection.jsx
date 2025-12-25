import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCurrentChat } from "../../utils/CurrentChatContext";
import { UserIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { setIsChatOpened } from "../../utils/UserRedux/UserSlice.jsx";
import { useDispatch } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { useWebSocket } from "@/utils/WebSocketContext";
import TypingStatus from "./TypingStatus";
import ChatMessages from "./ChatMessages";

function ChatSection() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user).user;
  const { receiverProfile, addMessages } = useCurrentChat();

  const isChatOpened = useSelector((state) => state.user.isChatOpened);
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [emojiSelected, setEmojiSelected] = useState(false);
  const dispatch = useDispatch();
 
  const handleSendMessage = () => {
    // Message send logic
    let receiverName = receiverProfile.username;
    const receiverId = receiverProfile.userId;
    const senderId = user.userId;
    const senderName = user.username;
    const content = message;
    // console.log("sending the message")
    addMessages({ senderId, receiverId, senderName, receiverName, content });
    setEmojiSelected(false);
    setMessage(""); // clear the input field
  };

  // Sort messages in descending order based on the date & time which causes the in the last of the array and then at rendering it will be at the bottom of the chat section

  const handleBack = () => {
    dispatch(setIsChatOpened(false));
  };

  const [typers, setTypers] = useState([]);
  // Scroll to the bottom whenever the messages change

  const { stompClient } = useWebSocket();

  useEffect(() => {
    if (!stompClient || !receiverProfile || !isChatOpened) return;
    console.log(receiverProfile.roomId)
    const subscription = stompClient.subscribe(
      `/queue/typing-status/${receiverProfile.roomId}`,
      (msg) => {
        const data = JSON.parse(msg.body);
        console.log(data.typing, data.typerName);
        setTypers((prev) => {
          if (data.typing) {
            return !prev.includes(data.typerName) &&
              user.username === data.typerName
              ? prev
              : [...prev, data.typerName];
          } else {
            return prev.filter((name) => name !== data.typerName);
          }
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, user.username, receiverProfile, isChatOpened]);
 
  return (
    <div
      className={`${
        isChatOpened ? "sm:flex" : "hidden"
      } w-full md:w-[75%] h-screen  md:flex flex-col p-5 pb-1 gap-5 overflow-hidden`}
      onClick={(e) => {
        e.stopPropagation();
        setIsMenuClicked(false);
      }}
    >
      {receiverProfile ? (
        <>
          <div className="chatBox h-[90%] w-[100%] flex flex-col relative">
            {/* header section */}
            <div className="header w-[100%] flex flex-row  z-40 bg-gray-200 h-[60px] items-center absolute inset-0">
              <div className="h-full w-full flex flex-row justify-start items-start">
                <div
                  className="flex items-start md:hidden justify-center h-full w-[50px] cursor-pointer hover:bg-gray-300 rounded-lg transition"
                  onClick={handleBack}
                >
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
                  {receiverProfile.profilePic ? (
                    <img
                      src={receiverProfile.profilePic}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon size={30} className="text-gray-500" />
                  )}
                </div>
                <div className="flex flex-col  justify-center">
                  <h1 className="text-base font-bold text-black pl-4">
                    {receiverProfile.username}
                  </h1>
                  <TypingStatus
                    typers={typers}
                    message={message}
                   
                  />
                </div>
              </div>
              <motion.div
                className="w-fit h-full"
                layoutId="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuClicked((prev) => !prev);
                }}
              >
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
                {isMenuClicked && (
                  <motion.div
                    className="w-[200px] h-fit flex flex-col items-center absolute top-[15px] right-5  bg-white rounded-lg p-4 shadow-lg z-50"
                    layoutId="menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ul className="flex flex-col divide-y w-full space-y-1 text-black text-base font-[500]">
                      <li>Contact Info</li>
                      <li>Clear Chat</li>
                      <li>Delete Chat</li>
                      <li>Block</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/*  chat section  */}
            <ChatMessages/>
          </div>
          <div className="w-full border-t  px-3 py-2 sm:px-4">
            <div className="relative mx-auto flex max-w-4xl items-end gap-2">
              {/* Textarea */}
              <textarea
                className="
        flex-1 resize-none rounded-xl border border-gray-300
        bg-gray-100 px-4 py-2 text-sm text-gray-800
        placeholder:text-gray-500 placeholder:italic
        focus:border-blue-500 focus:bg-white focus:outline-none
        focus:ring-2 focus:ring-blue-500/20
        max-h-32 min-h-[44px]
      "
                placeholder="Type your message…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              {/* Emoji Picker */}
              {emojiSelected && (
                <div className="absolute bottom-14 left-0 z-50 w-72 sm:w-80">
                  <EmojiPicker
                    height={350}
                    onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
                  />
                </div>
              )}

              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setEmojiSelected((prev) => !prev)}
                className="
        flex h-11 w-11 items-center justify-center
        rounded-full bg-gray-200 text-gray-700
        hover:bg-gray-300 active:scale-95
        transition
      "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                  <path
                    d="M9 15c1 1 2 1.5 3 1.5s2-0.5 3-1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSendMessage}
                className="
        flex h-11 w-11 items-center justify-center
        rounded-full bg-blue-500 text-white
        hover:bg-blue-600 active:scale-95
        transition
      "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3 10.5l15.5-5.5a1 1 0 011.3 1.3L14.5 21l-3.5-7-7-3.5z" />
                </svg>
              </button>
            </div>
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
