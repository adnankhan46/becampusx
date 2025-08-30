import React from 'react';
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div>
    <h1>Bhai Saahab ye kis line me aa gaye aap</h1>
    <Link to="/"><button className='p-4 m-2 border-2 border-blue-600 rounded-xl text-blue-600'>Back to Home</button></Link>
    </div>
  )
}

export default ErrorPage
