import Navbar from '@/components/Navbar'
import React from 'react'
import { Link } from 'react-router'

function Landing() {
  return (
    <div>
      <Navbar/>
      <div className='flex flex-col items-center justify-center'>

      Hello Provider
      <div className='flex gap-4'>
      <Link to="/login">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
        </Link>
      <Link to="/Dashboard">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Dashboard
        </button>
        </Link>
      </div>
      </div>
    </div>
  )
}

export default Landing
