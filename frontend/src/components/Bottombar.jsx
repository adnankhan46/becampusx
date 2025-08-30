import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faPlus, faWandSparkles, faExplosion } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/home':
        return 'home';
      case '/profile':
        return 'profile';
      case '/upload':
        return 'upload';
      case '/campusai':
        return 'campusai';
      case '/explore':
        return 'explore';
      default:
        return '';
    }
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };
  return (
    <div className="fixed font-inter bottom-0 left-1/2 transform -translate-x-1/2 gap-2 w-full md:w-1/2 border-2 border-gray-500 bg-[#FAF4FE] bg-opacity-50 text-white p-2 flex justify-evenly items-center backdrop-blur-sm">


      <div onClick={() => handleTabClick('home', '/home')} className="flex flex-col text-black items-center justify-center">
        <FontAwesomeIcon icon={faHome} className={`md:h-8 h-6 mb-2  cursor-pointer ${activeTab === 'home' ? 'text-[#6a7cff]' : 'text-gray-500'}`} />
      <p className={`text-sm md:text-xl ${activeTab === 'home' ? 'text-[#6a7cff]' : 'text-gray-500'}`}>Home</p>
      </div>
     
     
      <div onClick={() => handleTabClick('upload', '/upload')} className="flex flex-col text-black  items-center justify-center">
        <FontAwesomeIcon icon={faPlus} className={`md:h-8 h-6 mb-2  cursor-pointer ${activeTab === 'upload' ? 'text-[#6a7cff]' : 'text-gray-500'}`} />
        <p className={`text-sm md:text-xl ${activeTab === 'upload' ? 'text-[#6a7cff]' : 'text-gray-500'}`}>Upload</p>
        </div>

      <div onClick={() => handleTabClick('campusai', '/campusai')} className="flex flex-col text-black  items-center justify-center">
        <FontAwesomeIcon icon={ faWandSparkles} className={`md:h-8 h-6 mb-2  cursor-pointer ${activeTab === 'campusai' ? 'text-[#6a7cff]' : 'text-gray-500'}`} />
        <p className={`text-sm md:text-xl ${activeTab === 'campusai' ? 'text-[#6a7cff]' : 'text-gray-500'}`}>TRY AI</p>
        </div>

      <div onClick={() => handleTabClick('explore', '/explore')} className="flex flex-col text-black  items-center justify-center">
        <FontAwesomeIcon icon={faExplosion} className={`md:h-8 h-6 mb-2 cursor-pointer ${activeTab === 'explore' ? 'text-[#6a7cff]' : 'text-gray-500'}`} />
        <p className={`text-sm md:text-xl ${activeTab === 'explore' ? 'text-[#6a7cff]' : 'text-gray-500'}`}>Explore</p>
  </div>

      <div onClick={() => handleTabClick('profile', '/profile')} className="flex flex-col text-black  items-center justify-center">
        <FontAwesomeIcon icon={faUser} className={`md:h-6 h-6 mb-2  cursor-pointer  ${activeTab === 'profile' ? 'text-[#6a7cff]' : 'text-gray-500'}`} />
        <p className={`text-sm md:text-xl ${activeTab === 'profile' ? 'text-[#6a7cff]' : 'text-gray-500'}`}>Profile</p>
        </div>
    </div>
  );
};

export default BottomBar;
