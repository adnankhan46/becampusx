import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { OpportunitiesResponse, Opportunity as OpportunityType } from '@/api/api.types';
import { useState } from 'react';

// Fetch all opportunities
const fetchOpportunities = async (): Promise<OpportunitiesResponse> => {
  const res = await axios.get('http://localhost:3000/api/admin/getAllOpp');
  return res.data;
};

// Fetch single opportunity
const fetchOpportunityById = async (id: string): Promise<{ opportunity: OpportunityType }> => {
  const res = await axios.get(`http://localhost:3000/api/admin/getAllOpp/${id}`);
  return res.data;
};

const Opportunity = () => {
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  // Query for all opportunities
  const { data: allOpportunities, isLoading, isError } = useQuery({
    queryKey: ['admin-opportunities'],
    queryFn: fetchOpportunities,
  });

  // Query for single opportunity (only runs when selectedOppId is set)
  const { 
    data: singleOpportunity, 
    isLoading: isSingleLoading, 
    isError: isSingleError 
  } = useQuery({
    queryKey: ['admin-opportunity', selectedOppId],
    queryFn: () => fetchOpportunityById(selectedOppId!),
    enabled: !!selectedOppId, // Only run when selectedOppId exists
  });

  // Function to handle opportunity selection
  const handleSelectOpp = (id: string) => {
    setSelectedOppId(id);
  };

  // Function to go back to list
  const handleGoBack = () => {
    setSelectedOppId(null);
  };

  // If single opportunity is selected, show it
  if (selectedOppId) {
    if (isSingleLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="text-lg">Loading opportunity...</div>
        </div>
      );
    }

    if (isSingleError || !singleOpportunity) {
      return (
        <div className="p-4">
          <button
            onClick={handleGoBack}
            className="mb-4 text-blue-500 hover:underline flex items-center"
          >
            ← Back to All Opportunities
          </button>
          <div className="text-red-500">Error loading opportunity details</div>
        </div>
      );
    }

    // Handle different response structures - sometimes it's nested, sometimes it's direct
    const opportunity = singleOpportunity.opportunity || singleOpportunity;
    
    // Additional safety check
    if (!opportunity || !opportunity.title) {
      return (
        <div className="p-4">
          <button
            onClick={handleGoBack}
            className="mb-4 text-blue-500 hover:underline flex items-center"
          >
            ← Back to All Opportunities
          </button>
          <div className="text-red-500">Opportunity data is incomplete</div>
        </div>
      );
    }

    return (
      <div className="p-6 border rounded-lg shadow-lg max-w-4xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-6 text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors"
        >
          ← Back to All Opportunities
        </button>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{opportunity.title}</h1>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-gray-600">Status</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                opportunity.status === 'open' ? 'bg-green-100 text-green-800' :
                opportunity.status === 'closed' ? 'bg-red-100 text-red-800' :
                opportunity.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                opportunity.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {opportunity.status}
              </span>
            </div>

            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-gray-600">Type</h4>
              <p className="text-gray-800">{opportunity.type}</p>
            </div>

            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-gray-600">Deadline</h4>
              <p className="text-gray-800">{new Date(opportunity.deadline).toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-gray-600">Number of Openings</h4>
              <p className="text-gray-800">{opportunity.numberOfOpenings}</p>
            </div>

            <div className="bg-white p-4 rounded border md:col-span-2">
              <h4 className="font-semibold text-gray-600">Created By</h4>
              <p className="text-gray-800">{opportunity.createdBy?.name || 'Unknown'}</p>
            </div>

            {opportunity.isPaid && (
              <div className="bg-white p-4 rounded border md:col-span-2">
                <h4 className="font-semibold text-gray-600">Payment Information</h4>
                <p className="text-gray-800">Amount: ₹{opportunity.amount}</p>
                <p className="text-sm text-gray-600">This is a paid opportunity</p>
              </div>
            )}

            {opportunity.applicants && opportunity.applicants.length > 0 && (
              <div className="bg-white p-4 rounded border md:col-span-2">
                <h4 className="font-semibold text-gray-600">Applications</h4>
                <p className="text-gray-800">{opportunity.applicants.length} applicants</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show all opportunities list
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading opportunities...</div>
      </div>
    );
  }

  if (isError || !allOpportunities) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 text-lg">Error loading opportunities</div>
        <p className="text-gray-600 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Opportunities</h1>
      
      {allOpportunities.opportunities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No opportunities found</div>
          <p className="text-gray-400 mt-2">Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allOpportunities.opportunities.map((opp) => (
            <div
              key={opp._id}
              onClick={() => handleSelectOpp(opp._id)}
              className="border border-gray-200 p-6 rounded-lg shadow-sm cursor-pointer 
                         hover:shadow-md hover:border-blue-300 transition-all duration-200 
                         bg-white hover:bg-blue-50"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                {opp.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {opp.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  opp.status === 'open' ? 'bg-green-100 text-green-800' :
                  opp.status === 'closed' ? 'bg-red-100 text-red-800' :
                  opp.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                  opp.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {opp.status}
                </span>
                
                <span className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunity;