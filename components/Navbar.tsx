'use client';

import React, { useEffect, useState } from 'react';
import { Menu, X, } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';


interface MenuItem {
  id: string;
  label: string;
}



const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'work', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data: ProfileData = await response.json();
        setProfile(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition duration-300 px-[7vw] md:px-[7vw] lg:px-[15vw] ${
        isScrolled ? 'bg-[#050414]/60 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="text-white py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-semibold cursor-pointer">
          <span className="text-cyan-400">&lt;</span>
          <span className="text-white">Raj</span>
          <span className="text-cyan-400">/</span>
          <span className="text-white">Rabidas</span>
          <span className="text-cyan-400">&gt;</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-300">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer hover:text-cyan-400 ${
                activeSection === item.id ? 'text-cyan-400' : ''
              }`}
            >
              <button onClick={() => handleMenuItemClick(item.id)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="hidden md:flex space-x-5">
          {loading && <span className="text-gray-400">Loading...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {!loading && !error && profile && (
            <>
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-cyan-400"
                  aria-label="GitHub"
                >
                  <FaGithub size={24} />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-cyan-400"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={24} />
                </a>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {isOpen ? (
            <X
              className="text-3xl text-cyan-400 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <Menu
              className="text-3xl text-cyan-400 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4/5 bg-[#050414]/60 backdrop-blur-lg z-50 rounded-lg shadow-lg md:hidden">
          <ul className="flex flex-col items-center space-y-4 py-4 text-gray-300">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`cursor-pointer hover:text-white ${
                  activeSection === item.id ? 'text-cyan-400' : ''
                }`}
              >
                <button onClick={() => handleMenuItemClick(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
            <div className="flex space-x-4">
              {loading && <span className="text-gray-400">Loading...</span>}
              {error && <span className="text-red-500">{error}</span>}
              {!loading && !error && profile && (
                <>
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white"
                      aria-label="GitHub"
                    >
                      <Github size={24} />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={24} />
                    </a>
                  )}
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
