import React, { createContext, useCallback, useContext,useRef, useEffect, useState } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';

import { QueryClient, useQueryClient } from '@tanstack/react-query';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
 const currentChatRoom= useSelector(state=> state.user.currentChatRoom)
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
const currentRoomRef = useRef(null);
useEffect(() => {
   currentRoomRef.current = currentChatRoom;
}, [currentChatRoom]);
useEffect(()=>{

  if(stompClient===null && !connected){
    return;
  }
 const messageSubscription=stompClient.subscribe("/user/queue/message",(msg)=>{
          const data=JSON.parse(msg.body);
          console.log(data)
          const roomId= data.roomId;
          console.log(data)
console.log(roomId , "   da  " , currentRoomRef.current.roomId)
          if(roomId === currentRoomRef.current?.roomId){
            data.status="SEEN"
queryClient.setQueryData(
       ["chatroom",roomId],
       (old)=>({
        ...old,
        messages:[...(old?.messages ?? []),data],
        lastMessage:data
       })
    )
        stompClient.publish({
        destination: "/app/ack-message-seen",
        body: JSON.stringify({
    messageId: data.messageId,
    senderId: data.senderId,
    date:data.date,
    status: "SEEN",
    roomId
  }),
      });
          }
          else {
            console.log("got a message delviery")
            data.status="DELIVERED"
queryClient.setQueryData(
       ["chatroom",roomId],
       (old)=>({
        ...old,
        unseenMessages:[...(old?.unseenMessages ?? []),data],
        lastMessage:data
       })
    )
           stompClient.publish({
        destination: "/app/ack-message-delivery",
          body: JSON.stringify({
    messageId: data.messageId,
    senderId: data.senderId,
    status: "DELIVERED",
    date:data.date,
    roomId
  }),
          }
        )
        }});

const ackSubscription= stompClient.subscribe("/user/queue/message-ack",(msg)=>{
  const data = JSON.parse(msg.body);
console.log("got message ack for",data.status)
console.log(data);
    queryClient.setQueryData(
      ["chatroom", data.roomId],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          messages: old.messages.map((m) =>
             new Date(m.date) <= new Date(data.date)
              ? { ...m, status: data.status }
              : m
          ),
        };
      }
    );
})
        return ()=>{
          messageSubscription.unsubscribe();
          ackSubscription.unsubscribe()
        }
},[connected, queryClient, stompClient])


  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
    }
  };
  useEffect(()=>{
    connectWebSocket()
  return ()=>disconnectWebSocket()
  },[]
  )
  return (
    <WebSocketContext.Provider value={{ stompClient, connected, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
export const useWebSocket = () => useContext(WebSocketContext);