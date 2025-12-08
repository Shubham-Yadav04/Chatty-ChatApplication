import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { UserIcon } from 'lucide-react';
import {motion } from 'motion/react'
import axios from 'axios';
import { Edit3,MessageSquare } from 'lucide-react';
function UserProfileDashboard(){
const [editingField, setEditingField] = useState(null);
const [formData, setFormData] = useState({
  username: '',
  bio: '',
  profilePic: ''
});
const user = useSelector(state => state.user).user;


useEffect(() => {
  if (user) {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      profilePic: user.profilePic || ''
    });
  }
}, [user]);

    const cloudName= import.meta.env.VITE_CLOUD;
    const uploadPreset="chetty-preset"
  

   const uwConfig = {
    cloudName,
    uploadPreset,
    cropping: true,
    showAdvancedOptions: true,
    sources: ['local', 'url'],
    multiple: false,
    folder: 'profile_pic',
    tags: ['users', 'profile'],
    context: { alt: 'user_uploaded' },
    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
    maxImageFileSize: 2000000,
    maxImageWidth: 250,
    theme: 'gray',
  };

   const openWidget = () => {
    // Ensure Cloudinary global object exists
    if (!window.cloudinary) {
      alert("Cloudinary widget not loaded");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
     uwConfig,
      async(error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Uploaded Image URL:", result.info.secure_url);
         // send this url in backend to store in db 
         const res= await axios.post(`${import.meta.env.VITE_BACKEND_URI}user/change-profile?userId=${user.userId}&newUrl=${result.info.secure_url}`,{},{
    withCredentials:true
  }

  )
  console.log(res)
        }
      }
    );
    widget.open();
  };

const handleUpdate = async (field) => {
 if(field==="bio"){
  const res= await axios.post(`${import.meta.env.VITE.BACKEND_URI}user/change-bio?userId=${user.userId}&newBio=${formData.bio}`,
    
    {
      withCredentials:true
    }
  );
  console.log(res)
 }
 else if(field==='username'){
  const res= await axios.post(`${import.meta.env.VITE.BACKEND_URI}user/change-name?userId=${user.userId}&newName=${formData.username}`,
    {
      withCredentials:true
    }
  ) 
  console.log(res.data);
user.profilePic=res.data.profilePic
 }
  setEditingField(null);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};


return (
  <motion.div 
    className="min-h-screen  p-2 md:p-4 flex flex-col items-center gap-6 overflow-y-hidden"
    initial={{ opacity: 0, x: -50 }} 
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className='w-full max-w-2xl'>
      <div className='flex items-center gap-3 mb-4'>
        <UserIcon size={32} className="text-indigo-600" />
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>Profile</h1>
      </div>

      <div className='bg-zinc-100 rounded-2xl shadow-md py-6 md:p-6 space-y-6'>
        
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <div className='rounded-full border-4 border-indigo-200 bg-white h-32 w-32 md:h-40 md:w-40 flex items-center justify-center overflow-hidden '>
              {formData.profilePic ? (
                <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={60} className="text-gray-400" />
              )}
            </div>
            <label className='absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 cursor-pointer'>
              <UserIcon size={18} />
              <button 
              className='hidden'
                onClick={openWidget}
                
              />
            </label>
          </div>
        </div>

        {/* Username */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <UserIcon size={20} className="text-indigo-600" />
            <label className='text-lg md:text-xl font-semibold text-gray-800'>Name</label>
            {editingField !== 'username' && (
              <Edit3 size={18} className="text-gray-400 cursor-pointer ml-auto" onClick={() => setEditingField('username')} />
            )}
          </div>
          {editingField === 'username' ? (
            <div className='flex flex-col gap-2 w-full'>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
              <div className='flex gap-4'>
              <button
                onClick={() => setEditingField(null)}
                className='px-2 py-1 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 text-base'
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate('username')}
                className='px-2 py-1 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 text-base'
              >
                Save
              </button>
              </div>
            </div>
          ) : (
            <p className='text-base md:text-lg text-gray-700 font-medium'>{user?.username || 'username'}</p>
          )}
        </div>

        {/* Bio */}
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <MessageSquare size={20} className="text-indigo-600" />
            <label className='text-lg md:text-xl font-semibold text-gray-800'>Bio</label>
            {editingField !== 'bio' && (
              <Edit3 size={18} className="text-gray-400 cursor-pointer ml-auto" onClick={() => setEditingField('bio')} />
            )}
          </div>
          {editingField === 'bio' ? (
            <div className='flex flex-col gap-2'>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto resize-none '
                rows="3"
              />
              <div className='flex gap-2 justify-end'>
                <button
                  onClick={() => setEditingField(null)}
                  className='px-2 py-1 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 text-base '
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate('bio')}
                  className='px-2 py-1 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700'
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className='text-base md:text-lg text-gray-700 font-medium'>{user?.bio || 'Add your bio'}</p>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);
};

export default UserProfileDashboard;
