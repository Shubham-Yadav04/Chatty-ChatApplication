import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './components/UserCreation/Login';
import Home from './components/Home';

import UserCreationBox from './components/UserCreation/UserCreationBox';
import Landing from './components/landingPage/Landing'
import SignUp from './components/UserCreation/SignUp';
import UserProfileDashboard from './components/dashbaord/UserProfileDashBoard';
function App() {

 
  return (
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<UserCreationBox />}/>
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<UserProfileDashboard/>}/>
      </Routes>
  );
}


export default App