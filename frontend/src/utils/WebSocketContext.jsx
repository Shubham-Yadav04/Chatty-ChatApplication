import React, { createContext, useContext, useState } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
// import { useDispatch, useSelector } from 'react-redux';
// import { addNewMessageToCurrentChatRoomMsg, fetchChatrooms } from './UserRedux/UserSlice';


const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
// const dispatch= useDispatch();
  const connectWebSocket = () => {
    if (connected || stompClient) return; 

    const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URI}ws`);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        setStompClient(client);
        console.log(" Connected to WebSocket");

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
