import React from "react";
import { Timeline } from "@/components/ui/timeline";
import {motion} from 'motion/react'

export function InfoDetails() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  const data = [
    {
      title: (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col gap-4 mt-8"
        >
            <motion.h1 
                variants={itemVariants}
                className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-neutral-100"
            >
                 Connect with Gmail 
            </motion.h1>
            <motion.p 
                variants={itemVariants}
                className="text-sm md:text-base text-neutral-400 font-normal leading-relaxed max-w-sm"
            >
                Logging in is completely seamless. No long forms to fill out—simply connect using your existing Gmail account and start messaging your friends in seconds.
            </motion.p>
        </motion.div>
      ),
      content: (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={imageVariants}
            className="p-2 md:p-6 flex justify-start items-center w-full"
        >
         <img src="./info1.png" alt="Seamless Gmail Login" className="w-full max-w-[280px] md:max-w-[380px] rounded-xl shadow-2xl object-cover border border-neutral-800 shadow-neutral-900" />
        </motion.div>
      ),
    },
    {
      title:(
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col gap-4 mt-8"
        >
            <motion.h1 
                variants={itemVariants}
                className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-neutral-100"
            >
                Share Files & <br className="md:block hidden"/> Send Emojis
            </motion.h1>
            <motion.p 
                variants={itemVariants}
                className="text-sm md:text-base text-neutral-400 font-normal leading-relaxed max-w-sm"
            >
                Make your text conversations fun and expressive with emojis. Easily share files, documents, and assets with anyone in your network.
            </motion.p>
        </motion.div>
      ),
      content: (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={imageVariants}
            className="p-2 md:p-6 flex justify-start items-center w-full"
        >
          <img src="./info2.jpg" alt="Share files and emojis" className="w-full max-w-[280px] md:max-w-[380px] rounded-xl shadow-2xl object-cover border border-neutral-800 shadow-neutral-900" />
        </motion.div>
      ),
    },
    {
      title:(
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col gap-4 mt-8"
        >
            <motion.h1 
                variants={itemVariants}
                className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-neutral-100"
            >
                Purely Focused on <br className="md:block hidden"/> Communication
            </motion.h1>
            <motion.p 
                variants={itemVariants}
                className="text-sm md:text-base text-neutral-400 font-normal leading-relaxed max-w-sm"
            >
                We are a platform built solely for instant messaging. We do not support video chat right now, ensuring a lightweight, distraction-free environment for you to connect and collaborate.
            </motion.p>
        </motion.div>
      ),
      content: (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={imageVariants}
            className="p-2 md:p-6 flex justify-start items-center w-full"
        >
          <img src="./image3.png" alt="Pure communication" className="w-full max-w-[300px] md:max-w-[450px] rounded-xl flex justify-center items-center object-cover bg-black/50 backdrop-blur-sm" />
        </motion.div>
      ),
    }
  ];

  return (
    <div id="About" className="relative w-full overflow-clip h-fit">
      <Timeline data={data} />
    </div>
  );
}
