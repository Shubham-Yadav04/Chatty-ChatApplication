
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
function SignUp() {
    const Navigate =useNavigate()
    const [username,setUsername]= useState("");
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState("");
    const [confirmPassword,setConfirmPassword]= useState("");
    const [message,setMessage]=useState('')
    const handleOAuthLogin = (provider) => {
        console.log("outh2 login proceded")
      
        // localStorage.setItem("loginType", "oauth2");
          window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
        };
        const handleSignUp= async(e)=>{
    e.preventDefault();
try {
    if(password === confirmPassword){
    const response= await axios.post("http://localhost:8080/auth/signup",{
        
        username,
        email,
        password
    },
    {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }

    )
    console.log(response.data)
    console.log("user created successfully")
   document.cookie.includes('authenticated=true');
   Navigate('/home')

    
}
else{
    setMessage("passwords are not same ")
    console.log("password and confirm password are not same")
}
} catch (error) {
    console.log("error occurred",error)
}
setConfirmPassword('')
setPassword('')
setUsername('')
setEmail('')
        }
return (
    
    <motion.div className="flex flex-col items-center justify-center h-full  rounded-lg w-full" 
    layoutId='page-container-/signup'
    >
        <form className='flex flex-col gap-4 p-4 w-full rounded-lg justify-center items-center h-fit' >
           
          
                <input type="text" id="username" name="username" required className='bg-white text-black  pl-3 w-full rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold'
                value={username}
                onChange={e=>setUsername(e.target.value)}
                placeholder='Username'/>
            
           
            <input type="text" id="email" name="email" required className='bg-white text-black focus:outline-none focus:ring-1 focus:ring-purple-400 pl-3 w-full rounded-lg py-1 placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold '
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                placeholder='Email'/>
            
           
            
            <input type="text" id="password" name="password" required className='bg-white text-black focus:outline-none focus:ring-1 focus:ring-purple-400 pl-3 w-full rounded-lg py-1  placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold'
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                placeholder='Password'/>
            
           
            <input type="text" id="confirmPasswword" name="confirmPasswword" required className='bg-white text-black focus:outline-none focus:ring-1 focus:ring-purple-400 pl-3 w-full rounded-lg py-1 placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold'
                value={confirmPassword} 
                onChange={e=>setConfirmPassword(e.target.value)}
                placeholder='Confirm Password'/>

            <button type="submit" className=' w-1/3 bg-blue-500 font-semibold p-1 cursor-pointer rounded-lg text-white' onClick={handleSignUp}>Sign Up</button>
        </form>
<>
{
  message?
  <div className="text-base w-full text-blue-600 text-center font-bold ">{ message}</div>
  :
  <></>
}
</>
        <div className=" px-8 pb-3  text-center">
       <button style={{ padding: '10px 20px', cursor: 'pointer' }} className="text-blue-600 text-sm font-semibold" onClick={()=>Navigate("/signup/login")}>Already have account?</button>
       <button
         onClick={() => handleOAuthLogin("google")}
         className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-red-600"
       >
         Sign in with Google
       </button>
       <button
         onClick={() => handleOAuthLogin("github")}
         className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
       >
         Sign in with GitHub
       </button>
       
         </div>
    </motion.div>
    
)
}

export default SignUp
