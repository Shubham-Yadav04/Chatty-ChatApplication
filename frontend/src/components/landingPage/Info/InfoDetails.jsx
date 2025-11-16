import React from "react";
import { Timeline } from "@/components/ui/timeline";
import {motion} from 'motion/react'
export function InfoDetails() {
  const data = [
    {
      title: (
        <motion.div className=" flex flex-col gap-4">
            <motion.h1 className="text-sm md:text-4xl font-bold leading-tight tracking-tight "
            initial={
                {
                    opacity:0,
                    y:50
                }
            }
            whileInView={{
                opacity:1,
                y:0,
                transition:{
                    duration:1
                }
            }}>
                Keep in touch <br className="md:block hidden"/> with your People
            </motion.h1>
            <p className="text-xs md:text-sm">
                Whether it's planning an outing with friends or simply staying on top of your family chats, group conversations should feel effortless.
            </p>
        </motion.div>
      ),
      content: (
        <div className="p-6">
         <img src="./info1.png" alt="" className="rounded-md" />
        </div>
      ),
    },
    {
      title:(
        <div className=" flex flex-col gap-4">
            <motion.h1 className="text-sm md:text-4xl font-bold leading-tight tracking-tight "
             initial={
                {
                    opacity:0,
                    y:50
                }
            }
            whileInView={{
                opacity:1,
                y:0,
                transition:{
                    duration:1
                }
            }}
            >
                Say what <br className="md:block hidden"/>you feel
            </motion.h1>
            <p className="text-xs md:text-sm">
                Whether it's planning an outing with friends or simply staying on top of your family chats, group conversations should feel effortless.
            </p>
        </div>
      ),
      content: (
        <div className="p-6">
          <img src="./info2.jpg" alt="" className="rounded-md" />
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip h-fit">
      <Timeline data={data} />
    </div>
  );
}
