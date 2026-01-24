import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWebSocket } from "./WebSocketContext";
import {  setCurrentChatRoomMsg } from "./UserRedux/UserSlice";


const getCurrentChatMessages = async (chatroom) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URI}chatroom/messages/${chatroom.roomId}`,
    { withCredentials: true }
  );
  return response.data;
};
const CurrentChatContext = createContext();

export const CurrentChatProvider = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const { stompClient } = useWebSocket();

  const [receiverProfile, setReceiverProfile] = useState(null);

  const dispatch = useDispatch();
  const cleanup = () => {
    dispatch(setCurrentChatRoomMsg([]));
  };
  useEffect(() => {
    if (user && receiverProfile?.roomId) {
      getCurrentChatMessages(receiverProfile).then((data) => {
        console.log("dispatching the current chat data ",data);
        dispatch(setCurrentChatRoomMsg(data));
      });
    }
    return () => {
      cleanup();
    };
  }, [receiverProfile, user]);

  async function addMessages(msg) {
    // check whether the chatroom is new or it has already created if already created then the props will have roomId
    //  if room id is present than publish the message to the roomId route
    console.log(receiverProfile);
 
    if (!receiverProfile.roomId) {
      // it will make a request to the server to create a new chatroom and then using the current messages data and give the roomId as a response
      // here we will get the roomId
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}create.room`,
        msg,
        { withCredentials: true }
      );
console.log("mssdamd")
      if (response.data) {
        // dispatch(fetchChatrooms(user.userId));

        const newRoomId = response.data;
        msg = { ...msg, roomId: newRoomId };
        console.log(msg);
        stompClient.publish({
          destination: "/message/topic/chatroom",
          body: JSON.stringify(msg),
        });
        // Update chatroom with new roomId
        setReceiverProfile((prev) => ({ ...prev, roomId: newRoomId }));
      }
      // store that roomId in the chatroom state
    } else {
      console.log(receiverProfile.roomId);
      msg = { ...msg, roomId: receiverProfile.roomId };
      console.log(msg);
      stompClient.publish({
        destination: "/message/topic/chatroom",
        body: JSON.stringify(msg),
      });
    }
          
  }
  const removeMessages = async (msg) => {
    dispatch(
      setCurrentChatRoomMsg((prev) => prev.filter((m) => m.id !== msg.id))
    );

    // now while delete messages the messages will only be removed for the client not for the server the message will still be in the server for the other person
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}message/delete`,
      {
        sender: user.username,
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
