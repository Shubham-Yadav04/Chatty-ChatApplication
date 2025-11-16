import React from 'react'
import { EncryptedText } from "@/components/ui/encrypted-text";
import { useNavigate,Link } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
const navigate=useNavigate();
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // run once to set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className={`flex items-center justify-between text-[#222] dark:text-neutral-300  neon:bg-primary  z-50 fixed top-0 ${scrolled?"px-4 mx-0 w-full bg-black/40 backdrop-blur-sm" :"w-[80%] mx-auto"} transition-all duration-500 `}>
        <div className='flex items-center space-x-2  py-1 '>
            <a href="#home" className="md:text-4xl text-lg font-bold italic cursor-pointer transition-all w-fit "
           
            ><EncryptedText
           
        text="CHeTTy"
        encryptedClassName="text-neutral-500"
        revealedClassName="dark:text-white text-black"
        revealDelayMs={100}
      /></a>

             <div className='hidden md:flex flex-col md:flex-row items-center gap-4 text-xs md:text-sm font-semibol pl-[8vw] selection:text-purple-400 dark:selection:text-purple-500 antialiased'>
            <a href="#Service" className=''>Service</a>
            <a href="#About" className=''>About</a>
            <a href="#Contact" className=''>Contact Us</a>
        </div>
        </div>
       
        <div className="flex">
            <button className=' text-white px-4 py-1 rounded-md m-2 hover:bg-blue-600 text-base md:text-lg font-bold '
            onClick={()=>navigate('/login')}
            >Join</button>
        </div>
    </div>
  )
}

export default Navbar