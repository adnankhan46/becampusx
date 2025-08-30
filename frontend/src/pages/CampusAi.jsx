import React from 'react';
import Navbar from '../components/Navbar';
import BottomBar from '../components/Bottombar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandSparkles } from '@fortawesome/free-solid-svg-icons';
import Chatbox from '../components/Chatbox';

function CampusAi() {
  return (
    <div className='flex flex-col h-screen bg-[#FAF4FE] pb-20'>
    <div className="sticky top-0 z-200">
    <Navbar />
    
      </div>
    
      <p className="text-base md:text-xl font-outfit font-bold my-2 text-center text-[#7686ff]">
        <FontAwesomeIcon icon={faWandSparkles} className='md:h-6 h-4 mx-2 text-[#6a7cff]' />
       Ask Questions about Campus or anything
      </p>
   
      <div className='flex-1 overflow-y-auto h-5 mb-[136px]'>
        <Chatbox /> 
        </div>
        
        <div className='fixed bottom-0 w-full'>
        <BottomBar />
        </div>
    </div>
  );
}

export default CampusAi;
