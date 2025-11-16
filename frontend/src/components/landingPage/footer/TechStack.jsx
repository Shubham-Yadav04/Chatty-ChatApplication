
"use client";
import React from "react";
import { AnimatedTooltip } from "../../ui/animated-tooltip";
const tech = [
    {
        id: 1,
        name: "React",
        designation: "React",
        image: "https://cdn.simpleicons.org/react/61DAFB",
    },
    {
        id: 2,
        name: "Tailwind CSS",
        designation: "Tailwind CSS",
        image: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    },
    {
        id: 3,
        name: "Spring Boot",
        designation: "Spring Boot",
        image: "https://cdn.simpleicons.org/spring/6DB33F",
    },
    {
        id: 4,
        name: "Web Socket",
        designation: "Web Socket",
        image:
            "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%230075C2'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Ccircle%20cx='12'%20cy='12'%20r='2'/%3E%3Cpath%20d='M12%208a4%204%200%200%201%200%208'/%3E%3Cpath%20d='M12%205a7%207%200%200%201%200%2014'/%3E%3C/svg%3E",
    },
];

export function TechStack() {
  return (
    <div className="w-[50%] h-fit flex md:flex-row flex-col  gap-4 items-center md:justify-start">{
        <h1 className="text-xl font-bold w-full">TechStack Used:</h1>
    }
    <div className="flex flex-row items-center justify-start mb-10 w-full">
      <AnimatedTooltip items={tech} />
    </div>
    </div>
  );
}
