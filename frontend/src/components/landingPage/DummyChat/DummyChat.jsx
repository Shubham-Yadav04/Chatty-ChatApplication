import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

const initialChatMessages = [
  { id: 1, text: "Hey! Ready to go over the project details?", sender: "other", time: "10:00 AM", avatar: "AJ" },
  { id: 2, text: "Absolutely! Give me one minute to login using my Gmail. 😊", sender: "user", time: "10:01 AM", avatar: "ME" },
  { id: 3, text: "No rush. I'll drop the documents here.", sender: "other", time: "10:02 AM", avatar: "AJ" },
  { id: 4, text: "Awesome. Just joined and found your message! 🚀", sender: "user", time: "10:04 AM", avatar: "ME" },
  { id: 5, text: "Here's the zip file with all the assets you need.", sender: "other", time: "10:05 AM", file: true, avatar: "AJ" },
  { id: 6, text: "Got it! No video calls today right?", sender: "user", time: "10:07 AM", avatar: "ME" },
  { id: 7, text: "Nope, just purely chat and file sharing. Simple and focused! ✨", sender: "other", time: "10:08 AM", avatar: "AJ" },
];

export default function DummyChat() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {

    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "ME"
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-fit bg-[#000] flex flex-col justify-center items-center overflow-hidden relative border-t border-neutral-900 py-10 px-4">
        

      <div 
        ref={chatContainerRef}
        className="w-full max-w-3xl flex flex-col gap-6 pt-10 px-2 md:px-8 pb-10 h-[450px] md:h-[550px] overflow-y-auto z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ 
            maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)", 
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)" 
        }}
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: msg.id <= 7 ? idx * 0.15 : 0 }}
            className={`flex w-full items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "other" && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 shrink-0 shadow-lg border border-neutral-700">
                    {msg.avatar}
                </div>
            )}
            
            <div className={`max-w-[75%] md:max-w-[60%] h-fit px-2 py-1 flex flex-col ${
              msg.sender === 'user' 
                ? 'bg-blue-600/20 text-white rounded-2xl rounded-br-sm  shadow-xl shadow-blue-900/20' 
                : 'bg-neutral-900/60 border border-neutral-800 text-neutral-200 rounded-2xl rounded-bl-sm shadow-xl shadow-neutral-950/50 backdrop-blur-sm'
            }`}>
              {msg.file ? (
                <div className="flex items-center gap-3 bg-neutral-800/20 p-3 rounded-xl ">
                    <div className="w-10 h-10 bg-neutral-700/80 rounded-lg flex items-center justify-center text-lg shadow-inner">
                        📁
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white tracking-wide">Project_Assets.zip</span>
                        <span className="text-xs text-neutral-400">2.4 MB</span>
                    </div>
                </div>
              ) : (
                <p className="text-sm md:text-base leading-relaxed tracking-wide font-medium">{msg.text}</p>
              )}
              <span className={`text-[10px] sm:text-xs mt-2 block font-medium tracking-wider ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-neutral-500 text-right'}`}>{msg.time}</span>
            </div>

            {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg border border-blue-500">
                    {msg.avatar}
                </div>
            )}
          </motion.div>
        ))}
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="w-full max-w-2xl flex items-center gap-3 mt-2 relative z-20 px-4 md:px-0"
      >
        <div className="relative w-full shadow-2xl shadow-blue-500/5 group">
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message to test..."
                className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-blue-500 text-neutral-100 placeholder-neutral-500 rounded-3xl px-6 py-4 outline-none transition-all duration-300 backdrop-blur-md pr-16 shadow-inner"
            />
            <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 disabled:bg-neutral-800 disabled:text-neutral-600 hover:bg-blue-500 disabled:hover:bg-neutral-800 text-white rounded-full p-2.5 flex items-center justify-center transition-all duration-300 shrink-0 disabled:cursor-not-allowed disabled:shadow-none shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[1px] translate-y-[-1px]"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
        </div>
      </form>
    </div>
  );
}
