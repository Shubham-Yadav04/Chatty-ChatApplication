import React, { createContext, useContext, useState } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
// import { useDispatch, useSelector } from 'react-redux';
// import { addNewMessageToCurrentChatRoomMsg, fetchChatrooms } from './UserRedux/UserSlice';


const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
// const user = useSelector(state => state.user).user;
// const currentChatRoom= useSelector(state=>state.user.currentChatRoom)
// const dispatch=useDispatch();
// const user = useSelector(state=> state.user).user;
// const dispatch= useDispatch();
  const connectWebSocket = () => {
    if (connected || stompClient) return; 

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        setStompClient(client);
        console.log(" Connected to WebSocket");

        // client.subscribe(`/user/${user?.username}`, async(message) => {
        //   const msg = JSON.parse(message.body);
        //   console.log(msg)
        //   if(msg.roomId){
        //     client.subscribe(`/topic/chatroom/${msg.roomId}`,async(msg)=>{ // the receiver is now subscribed to the chatroom
        //       console.log("Subscribed to the new chatroom");
        //       // now the client need to updated for the new chatroom connection also so call the fetchChatroom function again 
        //      if(currentChatRoom.roomId===msg.roomId){
        //       dispatch(addNewMessageToCurrentChatRoomMsg(msg))
        //      }
        //       dispatch(fetchChatrooms(user?.userId))
        //     });
        //   }
        // }
        //   )
      },
      onDisconnect: () => {
        setConnected(false);
        console.log(" Disconnected from WebSocket");
      },
      
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
  
    
  };

  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
    }
  };
 

  return (
    <WebSocketContext.Provider value={{ stompClient, connected, connectWebSocket, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
