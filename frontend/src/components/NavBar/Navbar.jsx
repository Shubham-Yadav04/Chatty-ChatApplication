import React from 'react'
import { EncryptedText } from "@/components/ui/encrypted-text";

function Navbar() {
  const handleOAuthLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URI}oauth2/authorization/google`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-2 text-neutral-300">

      {/* ── Brand / Title (always visible) ── */}
      <a
        href="#home"
        className="md:text-3xl text-lg font-bold italic cursor-pointer transition-all w-fit"
      >
        <EncryptedText
          text="CHaTTy"
          encryptedClassName="text-neutral-500"
          revealedClassName="dark:text-white text-black"
          revealDelayMs={100}
        />
      </a>

      {/* ── Nav links pill — md+ only ── */}
      <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full
        bg-white/5 backdrop-blur-md border border-white/10
        text-sm font-medium text-neutral-300 shadow-lg">
        <a href="#Service" className="hover:text-white transition-colors duration-200">Service</a>
        <a href="#About"   className="hover:text-white transition-colors duration-200">About</a>
        <a href="#Contact" className="hover:text-white transition-colors duration-200">Contact Us</a>
      </div>

      {/* ── Join button (always visible) ── */}
      <button
        onClick={handleOAuthLogin}
        className="text-white px-4 py-1.5 rounded-md font-bold text-sm md:text-base hover:bg-blue-600 transition-colors duration-200"
      >
        Join
      </button>
    </div>
  );
}

export default Navbar