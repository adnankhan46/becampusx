import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ReportPage = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (admissionNumber.trim() !== '' && email.trim() !== '' && query.trim() !== '') {
      console.log({
        admissionNumber,
        email,
        query
      });

      setAdmissionNumber('');
      setEmail('');
      setQuery('');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-x-hidden bg-[#FAF4FE]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-4">Report Page</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full bg-gray-200 border-none outline-none p-3 rounded-xl mb-4"
            type="text"
            placeholder="Admission Number"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
          />
          <input
            className="w-full bg-gray-200 border-none outline-none p-3 rounded-xl mb-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="w-full bg-gray-200 border-none outline-none p-3 rounded-xl mb-4"
            placeholder="Your Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-xl mt-4 hover:bg-blue-600 transition duration-300"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;