
// import {Outlet} from 'react-router-dom'
// import {useLocation} from "react-router-dom"
// import {AnimatePresence} from 'motion/react'
// import {motion} from 'motion/react'
import { EncryptedText } from "@/components/ui/encrypted-text";
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import Login from './Login';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function UserCreationBox() {
  const user= useSelector(state=>state.user).user;
  const navigate= useNavigate();
 useEffect(()=>{
  console.log(user)
  if(user){
    navigate('/home')
  }
 },[user])
  return (
   <UserCreationBoxWrapper/> 
  )
}
function UserCreationBoxWrapper() {
  return(
 <div className='flex justify-center flex-col items-center h-screen w-screen  overflow-hidden relative bg-gradient-to-tr from-[#222] to-transparent'>
<Link to="/" className='bg-gradient-to-br !from-blue-400 !to-red-500  !bg-clip-text !text-transparent absolute left-5 top-5 text-4xl cursor-pointer font-bold z-10' onClick={()=>console.log("clicked")}>CHeTTy</Link>
<div  className='flex flex-col justify-center items-center h-fit  py-2 px-5 gap-4  rounded-lg  shadow-md shadow-neutral-700 w-[400px] min-w-[300px] backdrop-blur-sm bg-gradient-to-tr from-[#111] to-transparent '>
              <Link to="/" className="md:text-4xl text-lg font-bold italic underline-none cursor-pointer z-10 " onClick={()=>console.log("clicked")}><EncryptedText
          text="CHeTTy"
          encryptedClassName="text-neutral-500"
          revealedClassName="dark:text-white text-black"
          revealDelayMs={100}
        /></Link>
        <Login/>
  {/* <AnimatePresence mode="wait">
  <div className='w-full h-full'

  >
    <motion.div className="w-full h-full" 
            key={location.pathname}

   layoutId={`page-container-${location.pathname}`}
   initial={{ opacity: 0, x: 50 }}
   animate={{ opacity: 1, x: 0 }}
   exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
   >
    <Outlet />
    </motion.div>
    </div>
    </AnimatePresence> */}
</div>
</div>
  )
}
export default UserCreationBox
