import React from 'react'
import { EncryptedText } from '@/components/ui/encrypted-text'
import {motion} from "motion/react"
function HeroSection() {
  return (
    <div id="home" className='w-full  md:h-screen bg-white text-[#222] dark:bg-black dark:text-neutral-300 overflow-hidden flex flex-col justify-center items-center  '>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-black leading-[1.05] tracking-tight text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >{
          ['C','h','a','t','t','y'].map((letter,index)=>{
            return(
              <motion.span
                key={index}
                initial={{
                  opacity:0,
                  y:20,
                  
                }}
                animate={{
                  opacity:1,
                  x:index*5,
                  y:index===5?20:0,
                  rotate:index*5,
                }}
                transition={{
                  duration:0.5,
                  delay:index*0.1,
                }}

                style={{
              display:'inline-block',
                  color:"white",
                }}
              >
                {letter}
              </motion.span>
            )
          })
         
}
          <br />
          <span className="text-neutral-300 bg-gradient-to-b from-white to-purple-500 bg-clip-text text-transparent" style={{ fontSize: "0.72em", fontWeight: 700 }}>
            is the new trend.
          </span>
        </h1>

        {/* subheading */}
        <p
          className="max-w-lg text-sm sm:text-base md:text-base italic text-center text-neutral-400 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Connect with loved ones or make friends across the world.
          Lightweight, instant, and built for real conversations.
        </p>

        {/* encrypted tagline */}
        <p
          className="text-sm md:text-base font-semibold text-neutral-500 mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Let&apos;s Do{" "}
          <span className="text-base md:text-xl">
            <EncryptedText
              text={" CH*TTi**ap."}
              encryptedClassName="text-neutral-600"
              revealedClassName="text-white"
              revealDelayMs={100}
            />
          </span>
        </p>

    </div>
  )
}

export default HeroSection