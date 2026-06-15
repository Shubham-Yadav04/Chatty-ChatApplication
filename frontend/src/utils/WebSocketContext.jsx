import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryClient } from '@tanstack/react-query';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
 const currentChatRoom= useSelector(state=> state.user.currentChatRoom)
const dispatch= useDispatch();
const queryClient=useQueryClient();
  const connectWebSocket = useCallback(() => {
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
  }
,[stompClient,connected]);
useEffect(()=>{

  if(stompClient===null && !connected) {
    connectWebSocket();
    return;
  }
 const messageSubscription=stompClient.subscribe("/user/queue/message",(msg)=>{
          const data=JSON.parse(msg.body);
          const roomId= data.chatRoomId;

          if(roomId!==currentChatRoom.roomId){
queryClient.setQueriesData(
       ["chatroom",roomId],
       (old)=>[...old,msg]
    )
            stompClient.publish("/app/ack-message-delivery",data.messageId);
          }
        });
        return ()=>{
          messageSubscription.unsubscribe();

        }
},[connected, currentChatRoom, dispatch, queryClient, stompClient])
  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
    }
  };
  return (
    <WebSocketContext.Provider value={{ stompClient, connected, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
export const useWebSocket = () => useContext(WebSocketContext);