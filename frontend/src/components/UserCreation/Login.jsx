
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {motion}  from 'motion/react'
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message,setmessage]= useState('');
  const Navigate = useNavigate()

  const handleOAuthLogin = (provider) => {
    console.log("outh2 login proceded")
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const handleLogin = async () => {
    try {
      console.log("login button clicked", username, password)
      const response = await axios.post("http://localhost:8080/login/auth", {
        username,
        password
      },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      console.log("response received", response)

      const authenticated = document.cookie.includes('authenticated=true');
      if (authenticated) {

       
        setUsername('')
        setPassword('');

        Navigate('/home')
      }
      else{
        setmessage("Invalid username or password")
        console.log("Invalid username or password")
      }

    }
    catch (error) {
      console.log("error occured", error)
      setmessage("Invalid username or password")
    }

  }
  
  return (
    <motion.div className="flex flex-col items-center justify-center  w-full p-3"
   layoutId={"page-container-/signup/login"}
    >
      {/* <div className="  flex flex-col items-center justify-center px-3 pt-5"> */}
     
        {/* <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400  text-black bg-neutral-300 placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold"
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
       
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400  text-black bg-neutral-200
          placeholder:text-base placeholder:italic placeholder:text-neutral-600 placeholder:font-semibold
          "
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <button
          className="w-1/4 bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
          onClick={() => handleLogin()}
        >
          Login
        </button> */}

        <div className=" p-8  text-center">
 {/* <button style={{ padding: '10px 20px', cursor: 'pointer' ,}} className="text-blue-600 text-sm font-semibold underline" onClick={()=>Navigate('/signup')}>Create new account</button> */}
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
      {/* </div> */}
    </motion.div>
  );
}

export default Login
