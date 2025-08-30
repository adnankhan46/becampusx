import {React} from 'react';
import { useLocation, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandSparkles, faBell} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

function Navbar() {
  const location = useLocation();
  return (
    <>
    <div className='flex items-center w-full h-16 bg-custom-gradient justify-between'>
    <Link to='/home'>
    <div className='flex items-center h-16'>
    <h1 className="text-4xl font-bold font-outfit text-white ml-4">
    {(location.pathname === `/campusai`) ? "CampusAI" : "BeCampusX"}
    </h1>
    {(location.pathname === `/campusai`) &&
    <FontAwesomeIcon icon={faWandSparkles} className='md:h-8 h-6 mx-2 text-white' />
    }
    
    
    <span className='text-sm text-white font-bold'>
    {(location.pathname === `/campusai`) ? "By BeCampusX" : ""}
    </span>
    </div>
    </Link>
    <Link to='/notification'>
      <div className='md:mr-80 mr-6 text-white'>
        {(location.pathname !== `/`) &&
        <FontAwesomeIcon icon={faBell} className={`md:h-8 h-6`} />
        }
       </div>
    </Link>
    </div>
    </>
  )
}

export default Navbar;
