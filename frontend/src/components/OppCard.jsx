import React from 'react';

const OpportunityCard = ({ opportunity, onApplyClick }) => {
  // Handle participate click
  const handleParticipateClick = () => {
    if (onApplyClick && opportunity?._id) {
      onApplyClick(opportunity._id);
    }
  };

  // If no opportunity data is passed, show the default card
  if (!opportunity) {
    return (
      <div className='relative mt-4 flex flex-col border-2 rounded-xl w-full md:w-1/2 items-center h-fit p-6 px-4'>
        <div className='font-bold font-suse text-lg rounded-lg p-2 w-full h-12 text-[#6a7cff]'>
          Economic Opportunities for Students
        </div>
        <div className='flex flex-col border-2 rounded-lg mb-2 p-2 border-gray-200 w-full h-fit'>
          Introducing Economic Opportunities through small Freelance Gigs, Internships, Research survey for a professor, Ambassador Programs, etc.
          <div className='flex flex-row justify-between mt-2'>
            <div className='border border-[#6a7cff] p-2 px-3 rounded-lg text-sm'>Participate</div>
            <div className='bg-[#6a7cff] p-2 text-white rounded-2xl text-sm'>Reward <b>₹400</b></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative mt-4 flex flex-col border-2 rounded-xl w-full md:w-1/2 items-center h-fit p-6 px-4 mx-auto'>
      <div className='font-bold font-suse text-lg rounded-lg p-2 w-full h-12 text-[#6a7cff]'>
        {opportunity.title || 'Opportunity Title'}
      </div>
      
      <div className='flex flex-col border-2 rounded-lg mb-2 p-2 border-gray-200 w-full h-fit'>
        <div className='text-gray-700 mb-3'>
          {opportunity.description || 'No description available'}
        </div>
        
        {/* Additional opportunity details */}
        {opportunity.category && (
          <div className='text-sm text-gray-600 mb-2'>
            <span className='font-semibold'>Category:</span> {opportunity.category}
          </div>
        )}
        
        {opportunity.location && (
          <div className='text-sm text-gray-600 mb-2'>
            <span className='font-semibold'>Location:</span> {opportunity.location}
          </div>
        )}
        
        {opportunity.deadline && (
          <div className='text-sm text-gray-600 mb-2'>
            <span className='font-semibold'>Deadline:</span> {new Date(opportunity.deadline).toLocaleDateString()}
          </div>
        )}
        
        <div className='flex flex-row justify-between mt-2'>
          <button 
            onClick={handleParticipateClick}
            className='border border-[#6a7cff] p-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-[#6a7cff] hover:text-white transition-colors'
          >
            Participate
          </button>
          <div className='bg-[#6a7cff] p-2 text-white rounded-2xl text-sm'>
            Reward <b>₹{opportunity.reward || '400'}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;