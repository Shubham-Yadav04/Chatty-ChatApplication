import React, { useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Landing from './components/landingPage/Landing'
import { getUserFromUserId} from './utils/UserRedux/UserSlice'
import UserProfileDashboard from './components/dashbaord/UserProfileDashBoard';
import { useDispatch } from 'react-redux';
function App() {
const dispatch= useDispatch();
 useEffect(()=>{
   dispatch(getUserFromUserId());
 },[dispatch])
  return (
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<UserProfileDashboard/>}/>
      </Routes>
  );
}


export default App