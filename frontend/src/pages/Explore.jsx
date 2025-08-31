import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomBar from '../components/Bottombar';
import OpportunityCard from '../components/OppCard';

function Explore() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // Function to fetch opportunities
  const fetchOpportunities = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applicants/getAllOpp?page=${page}&limit=6`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON - check if API endpoint is correct');
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setOpportunities(data.opportunities);
      } else {
        // For pagination - append new opportunities
        setOpportunities(prev => [...prev, ...data.opportunities]);
      }
      
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
      
      // Fallback: show sample data if API fails
      if (page === 1) {
        setOpportunities([
          {
            _id: 'sample-1',
            title: 'Economic Opportunities for Students',
            description: 'Introducing Economic Opportunities through small Freelance Gigs, Internships, Research survey for a professor, Ambassador Programs, etc.',
            reward: 400
          }
        ]);
        setHasMore(false);
        setTotalPages(1);
        setCurrentPage(1);
      }
    }
  };

  // Fetch opportunities on component mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Load more opportunities
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchOpportunities(currentPage + 1);
    }
  };

  // Handle navigation to apply page
  const handleApplyClick = (opportunityId) => {
    navigate(`/apply/${opportunityId}`);
  };

  // Loading state
  if (loading && opportunities.length === 0) {
    return (
      <div className='overflow-x-hidden flex flex-col items-center h-screen bg-white font-inter'>
        <Navbar/>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg text-gray-600'>Loading opportunities...</div>
        </div>
        <BottomBar/>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='overflow-x-hidden flex flex-col items-center h-screen bg-white font-inter'>
        <Navbar/>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg text-red-600'>Error: {error}</div>
        </div>
        <BottomBar/>
      </div>
    );
  }

  return (
    <div className='overflow-x-hidden flex flex-col items-center h-fit bg-white mb-[120px] font-inter'>
      <Navbar/>
      
      {/* Opportunities List */}
      <div className='w-full max-w-4xl px-4 mt-4'>
        {opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <OpportunityCard 
              key={opportunity._id} 
              opportunity={opportunity}
              onApplyClick={handleApplyClick}
            />
          ))
        ) : (
          <div className='text-center text-gray-600 py-8'>
            No opportunities found
          </div>
        )}
        
        {/* Load More Button */}
        {hasMore && (
          <div className='flex justify-center mt-6'>
            <button 
              onClick={loadMore}
              disabled={loading}
              className='bg-[#6a7cff] text-white px-6 py-2 rounded-lg hover:bg-[#5a6cef] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
        
        {/* Pagination Info */}
        <div className='text-center text-sm text-gray-600 mt-4'>
          Page {currentPage} of {totalPages}
        </div>
      </div>
      
      <BottomBar/>
    </div>
  );
}

export default Explore;