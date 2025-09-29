import React from 'react';

const skillColorMap = {
  Beginner: 'bg-green-100 text-green-700 border-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Advanced: 'bg-blue-100 text-blue-700 border-blue-300',
  Expert: 'bg-purple-100 text-purple-700 border-purple-300'
};

const OpportunityCard = ({ opportunity, onApplyClick }) => {
  const handleParticipateClick = () => {
    if (onApplyClick && opportunity?._id) {
      onApplyClick(opportunity._id);
    }
  };

  // If no opportunity data, show a stylish placeholder
  if (!opportunity) {
    return (
      <div className='relative mt-4 flex flex-col border-2 shadow-lg rounded-xl w-full md:w-1/2 items-center h-fit p-6 px-4 bg-gradient-to-br from-[#f6f6ff] to-[#e4e8ff]'>
        <div className='font-bold text-lg p-2 w-full h-12 text-[#6a7cff] mb-2'>
          Economic Opportunities for Students
        </div>
        <div className='flex flex-col border rounded-lg mb-2 p-2 border-gray-200 w-full bg-white'>
          Introducing Economic Opportunities: Freelance Gigs, Internships, Surveys, Ambassador Programs.
          <div className='flex flex-row justify-between mt-2'>
            <button className='border border-[#6a7cff] p-2 px-3 rounded-lg text-sm text-[#6a7cff] hover:bg-[#6a7cff] hover:text-white transition duration-200'>
              Participate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative mt-4 flex flex-col border shadow-lg rounded-xl w-full md:w-1/2 items-center h-fit p-6 px-4 mx-auto bg-gradient-to-br from-[#f6f6ff] to-[#e4e8ff]'>
      <div className='font-bold text-lg mb-2 w-full text-[#6a7cff] truncate'>
        {opportunity.title || 'Opportunity Title'}
      </div>
      <div className='flex flex-col rounded-lg mb-2 p-4 border border-gray-200 w-full bg-white'>
        <div className='text-gray-800 mb-3 text-base leading-relaxed'>
          {opportunity.description || 'No description available'}
        </div>

        {/* Opportunity Details */}
        <div className='flex flex-wrap gap-2 mb-3'>
          {opportunity.category && (
            <span className='px-3 py-1 bg-indigo-50 text-indigo-500 rounded-full text-xs border border-indigo-200'>
              {opportunity.category}
            </span>
          )}
          {opportunity.location && (
            <span className='px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs border border-slate-200'>
              {opportunity.location}
            </span>
          )}
          {opportunity.deadline && (
            <span className='px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs border border-red-200'>
              Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Skills section */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className='mb-2'>
            <div className='font-medium text-sm text-gray-700 mb-1'>Skills Required:</div>
            <div className='flex flex-wrap gap-2'>
              {opportunity.skills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs border ${skillColorMap[skill.level] || 'bg-gray-100 text-gray-600 border-gray-300'}`}
                >
                  {skill.name}
                  {skill.level && (
                    <span className='ml-1 italic text-[10px] font-semibold'>
                      ({skill.level})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA button */}
        <div className='flex flex-row justify-between mt-4'>
          <button
            onClick={handleParticipateClick}
            className='border border-[#6a7cff] p-2 px-4 rounded-lg text-sm text-[#6a7cff] hover:bg-[#6a7cff] hover:text-white transition duration-200'
          >
            Participate
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;