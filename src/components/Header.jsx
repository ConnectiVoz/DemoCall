import React, { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300
        ${isScrolled ? 'bg-black/40 backdrop-blur-md' : 'bg-black'}
      `}
    >
      {/* Logo - Top Left */}
      <a href="/" className="flex items-center">
        <img
          src="/images/ivozAI.png"
          alt="iVoz Ai"
          className="h-10 mr-2"
        />
        <span className="text-2xl font-bold text-gray-800 dark:text-white"></span>
      </a>
      {/* Back to Login Button - Top Right */}
      <a
        href="https://ivozagent.rivoz.in/login"
        className="px-4 py-2 bg-[#D0FF71] rounded-full text-black font-bold transition"
      >
        Back to Login
      </a>
    </div>
  );
};

export default Header;