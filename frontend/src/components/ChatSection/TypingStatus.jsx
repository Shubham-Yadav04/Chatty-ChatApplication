import { useCurrentChat } from "@/utils/CurrentChatContext";
import { useWebSocket } from "@/utils/WebSocketContext";
import { motion } from "motion/react";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";


function AnimatedDots() {
  return (
     <span className="flex gap-0.5 font-black items-center  text-green-800">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="text-xs rounded-full bg-green-800 h-0.5 w-0.5 block mt-1"
        >
        
        </motion.span>
      ))}
    </span>
  )

}
function TypingStatus({ typers, message }) {
  const { stompClient } = useWebSocket();
  const { receiverProfile } = useCurrentChat();
  const user = useSelector((state) => state.user).user;
  const sendTyping = useCallback(
    (isTyping) => {
      if (!stompClient) return;
      // console.log(stompClient)
      stompClient.publish({
        destination: "/typing/queue",
        body: JSON.stringify({
          typerName: user.username,
          chatroomId: receiverProfile.roomId,
          typing: isTyping,
        }),
      });
    },
    [stompClient, user.username, receiverProfile.roomId]
  );
  const prevTypingRef = useRef(false);

  useEffect(() => {
    if (!stompClient || !receiverProfile || !user) return;

    const isTypingNow = message.length > 0;

    if (prevTypingRef.current !== isTypingNow) {
      sendTyping(isTypingNow);
      prevTypingRef.current = isTypingNow;
    }
  }, [message, sendTyping, stompClient, receiverProfile, user]);

  return (
    <h1 className="text-green-800 font-semibold text-[8px]  px-4 flex flex-row items-center ">
      {typers.length > 0 ? (
        <span className="flex  gap-1">
          {typers.join(", ") + " typing"}
        <AnimatedDots/>
         
        </span>
      ) : (
        ""
      )}
    </h1>
  );
}
 


export default TypingStatus;
