import React, { useEffect } from 'react'
import Profiles from './Profiles'
import { useState } from 'react'
import axios from 'axios'
import {motion} from 'motion/react'
function Suggestion() {
    const [suggestions,setSuggestions]=useState([])
    const getSomeRandomUser= async ()=>{
        const response = await axios.get('http://localhost:8080/user/randomusers',{
            withCredentials:true
        })
     
        setSuggestions(response.data);

    }
    useEffect(()=>{
        getSomeRandomUser()
    },[])
  return (
    // this will contain the suggestion of the user with whom user can connect 
    <motion.div className='w-fit h-screen flex flex-col pt-4 px-2 text-black overflow-auto gap-3 '
initial={{opacity:0 ,x:-50}} animate={{opacity:1,x:0}} transition={{duration:0.2
}}
    >
        <h1 className='text-3xl p-2 md:text-[1.25rem] font-bold text-black'>Add Friends</h1>
    {
        suggestions && suggestions.length > 0 ? 
        suggestions.map((s, index) => 
            <Profiles key={index} username={s.username} userId={s.userId} profilePic={s.profilePic} />
        ) 
        : 
        "No suggestions right now"
    }

    </motion.div>
  )
}

export default Suggestion
