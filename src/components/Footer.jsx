import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" bg-black text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & Location */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <img width= "140" height="60" src='/public/images/ivozAI.png' />
          </div>
          <h3 className="text-white font-semibold mb-2">Location</h3>
          <p className="text-sm">
            2810 N Church St Wilmington DE 19802 United States
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#D0FF71]">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#D0FF71]">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#D0FF71]">
              <FaYoutube />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#D0FF71]">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#D0FF71]">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Industries */}
        <div>
          <h3 className="text-white font-semibold mb-4">Industries</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Education</a></li>
            <li><a href="#" className="hover:text-white">Healthcare</a></li>
            <li><a href="#" className="hover:text-white">Insurance & Financial</a></li>
            <li><a href="#" className="hover:text-white">Real Estate</a></li>
            <li><a href="#" className="hover:text-white">Retail</a></li>
            <li><a href="#" className="hover:text-white">Telecommunication</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} iVoz Ai. All rights reserved.
      </div>
    </footer>
  );
}
