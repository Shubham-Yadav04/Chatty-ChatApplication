import React from 'react'
import HeroSection from './Hero/HeroSection'
import Navbar from '../NavBar/Navbar'
import Info from './Info/Info'
import Footer from './footer/Footer'
import DummyChat from './DummyChat/DummyChat'
// import {useNavigate} from "react-router-dom"
function Landing() {
    // const navigate= useNavigate();
//     const handleClick=()=>{
// console.log("login button clicked ")
// navigate("/signup/login");
//     }
  return (
    <div className="h-fit w-full flex-col items-center neon:bg-primary dark:bg-[#000]">
        {/* <Navbar/> */}
        <HeroSection/>
        <DummyChat/>
    <Info/>
    <Footer/>
    </div>
  )
}

export default Landing
