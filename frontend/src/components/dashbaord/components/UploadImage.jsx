import {React,useState} from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';

import CloudinaryUploadWidget from './components/CloudinaryUploadWidget';

function UploadImage() {
   
  return (

         <div>
      <button
        onClick={openWidget}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload Image
      </button>
    </div>
    
  )
}

export default UploadImage