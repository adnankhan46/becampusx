import { useLocation, Link } from 'react-router';
import { Sparkles, Bell } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === '/Dashboard';
  const isHome = location.pathname === '/';

  return (
    <div className="flex items-center w-full h-16 bg-custom-gradient justify-between">
      <Link to="/home">
        <div className="flex items-center h-16">
          <h1 className="text-4xl font-bold font-outfit text-white ml-4">
            {isDashboard ? 'CampusAI' : 'CampusX'}
          </h1>
          
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
