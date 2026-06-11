import { createContext } from "react";
import { useState,  } from "react";
import axios from "axios";
import { useContext } from "react";

import { useWebSocket } from "./WebSocketContext";
import { useQueryClient } from "@tanstack/react-query";

const CurrentChatContext = createContext();

export const CurrentChatProvider = ({ children }) => {
  const { stompClient } = useWebSocket();
  const [receiverProfile, setReceiverProfile] = useState(null);
const queryClient= useQueryClient()

  async function addMessages(msg) {
    // check whether the chatroom is new or it has already created if already created then the props will have roomId
    //  if room id is present than publish the message to the roomId route
msg={...msg, date: new Date().toISOString()}
    if (!receiverProfile.roomId) {
      // it will make a request to the server to create a new chatroom and then using the current messages data and give the roomId as a response
      // here we will get the roomId
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}create.room`,
        msg,
        { withCredentials: true }
      );

      if (response.data) {
        const newRoomId = response.data;
        msg = { ...msg, roomId: newRoomId };
        
        stompClient.publish({
          destination: "/app/private-message",
          body: JSON.stringify(msg),
        });
        // Update chatroom with new roomId
        setReceiverProfile((prev) => ({ ...prev, roomId: newRoomId }));
      }
      // store that roomId in the chatroom state
    } else {
      msg = { ...msg, roomId: receiverProfile.roomId };
      console.log(msg);
      stompClient.publish({
        destination: "/app/private-message",
        body: JSON.stringify(msg),
      });
    }
    // dispatch(addNewMessageToCurrentChatRoomMsg(msg));
      queryClient.setQueriesData(
       ["chatroom", receiverProfile.roomId],
       (old)=>[...old,msg]
    )
  }
  const removeMessages = async (msg) => {
 

    // now while delete messages the messages will only be removed for the client not for the server the message will still be in the server for the other person
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}message/delete`,
      {
        // sender: user.username,
        reciever: receiverProfile.username,
        message: msg.message,
      },
      { withCredentials: true }
    );
  };

  return (
    <CurrentChatContext.Provider
      value={{
        receiverProfile,
        setReceiverProfile,
        addMessages,
        removeMessages,
      }}
    >
      {children}
    </CurrentChatContext.Provider>
  );
};

export const useCurrentChat = () => useContext(CurrentChatContext);
