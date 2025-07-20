'use client';

import React, { useEffect, useState } from 'react';
import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

type Profile = {
  name: string;
  linkedin: string;
  github: string;
};

const Footer = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data)); // assuming first profile
  }, []);

  console.log("Profile data:", profile);

  return (
    <footer className="text-white py-10 px-[12vw] md:px-[7vw] lg:px-[20vw]">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-semibold text-cyan-400">
          {profile?.name || 'Loading...'}
        </h2>

        {/* social media icons */}
        <div className="flex justify-center space-x-5 mt-6">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-pink-400 transition-transform transform hover:scale-125"
          >
            <FaInstagram />
          </a>
          <a
            href={profile?.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-cyan-400 transition-transform transform hover:scale-125"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-blue-400 transition-transform transform hover:scale-125"
          >
            <FaTwitter />
          </a>
          <a
            href={profile?.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-gray-400 transition-transform transform hover:scale-125"
          >
            <FaGithub />
          </a>
        </div>

        {/* copyright */}
        <p className="text-sm text-gray-400 mt-6">
          © 2025 {profile?.name || 'Raj Rabidas'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
