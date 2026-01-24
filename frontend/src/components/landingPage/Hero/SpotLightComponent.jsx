import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../../ui/spotlight";
import { EncryptedText } from "@/components/ui/encrypted-text";
import Navbar from "@/components/NavBar/Navbar";

export function SpotlightComponent() {
  return (
    <div
      className="relative flex flex-col md:h-screen h-[80vh] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center md:gap-[7rem] gap-5 p-2">
        <Navbar/>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )} />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      <div className="relative z-10 mx-auto w-full max-w-8xl p-4 pt-20 md:pt-0 flex flex-col items-center">
        <h1
          className="bg-opacity-30 bg-gradient-to-b from-neutral-50 to-neutral-20 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Chatty <br /> is the new trend.
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl text-center text-sm md:text-base font-normal text-neutral-400">
          Chatty  is a great way to connect with loved Ones or make friends across the world.
          Here, we are drawing the attention towards best experiences.
        </p>
<h1 className="md:text-base font-bold w-full text-center mt-3 text-xs antialiased ">
   Let's Do <span className="md:text-xl  text-sm   "><EncryptedText
        text={" CH*TTi**ap."}
         encryptedClassName="text-neutral-500"
        revealedClassName="dark:text-white text-black"
        revealDelayMs={100}
        />
        </span>
</h1>
       
      </div>
    </div>
  );
}




