
import { useSelector } from 'react-redux';
import { UserIcon } from 'lucide-react';
import {motion } from 'motion/react'
const UserProfileDashboard = () => {
    const user = useSelector(state=>state.user).user;
  
  return (
    <motion.div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center gap-5 "initial={{opacity:0 ,x:-50}} animate={{opacity:1,x:0}}transition={{duration:0.2
}}>
      <div className='w-full h-fit p-3'>
      <h1 className='text-4xl md:text-base font-bold text-[#111]'>Profile</h1>
      </div>
      <div className='w-full h-fit flex flex-col items-center justify-center gap-3'>
        <div className='rounded-full border border-2 bg-white border-gray-300  h-[200px] flex items-center justify-center  overflow-hidden  w-[200px]'>
          {  user.profilePic? <img
          src={user.profilePic}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
        :
        <UserIcon size={60} className="text-gray-500" />
      
    }
        </div>
        <div className='w-full h-fit flex flex-col items-center justify-center gap-2 items-start px-5 py-2'>
        <h1 className='text-2xl md:text-sm font-bold text-black w-full'>Your Name : </h1>
        <h1 className='text-base md:text-xs font-semibold text-black w-full'>{user.username?user.username:"username"}</h1>
        </div>
        <div className='w-full h-fit flex flex-col items-center justify-center gap-2 items-start px-5'>
        <h1 className=' text-2xl md:text-sm font-bold text-black w-full text-start'>Bio</h1>
        <p className='text-base md:text-xs font-semibold  overflow-hidden text-black w-full'>{user.bio?user.bio:"this the bio of the user "}</p>
        </div>
    </div>
    </motion.div>
  );
};

export default UserProfileDashboard;
