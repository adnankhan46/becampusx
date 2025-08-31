import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomBar from '../components/Bottombar';

const ApplyForOpportunityForm = ({ 
  onSubmit, 
  onCancel, 
  className = "" 
}) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    proofOfWork: {
      screenshot: null,
      link: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'link') {
      setFormData(prev => ({
        ...prev,
        proofOfWork: {
          ...prev.proofOfWork,
          link: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        proofOfWork: {
          ...prev.proofOfWork,
          screenshot: file
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coverLetter.trim()) {
      setError('Cover letter is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 bg-white ${className}`}>
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Apply for Opportunity</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Letter Field */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter <span className="text-red-500">*</span>
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            placeholder="Tell us why you're interested in this opportunity and what makes you a good fit..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Share your motivation, relevant experience, and what you can bring to this opportunity.
          </p>
        </div>

        {/* Proof of Work Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Proof of Work (Optional)</h3>
          
          {/* Screenshot Upload */}
          <div>
            <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Screenshot
            </label>
            <input
              type="file"
              id="screenshot"
              name="screenshot"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a screenshot of your relevant work or portfolio.
            </p>
          </div>

          {/* Link Field */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio/Work Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.proofOfWork.link}
              onChange={handleInputChange}
              placeholder="https://your-portfolio.com or link to relevant work"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Share a link to your portfolio, GitHub, or any relevant work.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Apply page component
const ApplyForOpportunity = () => {
  const { id } = useParams(); // Get opportunity ID from URL
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Fetch opportunity details
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        // Use the same endpoint as your Explore page
        const response = await fetch(`/api/applicants/getAllOpp`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch opportunities: ${response.status}`);
        }
        
        const data = await response.json();
        // Find the specific opportunity by ID
        const foundOpportunity = data.opportunities?.find(opp => opp._id === id);
        
        if (!foundOpportunity) {
          throw new Error('Opportunity not found');
        }
        
        setOpportunity(foundOpportunity);
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      // Create the request body as expected by your controller
      const submitData = {
        coverLetter: formData.coverLetter,
        proofOfWork: {
          screenshot: formData.proofOfWork.screenshot,
          link: formData.proofOfWork.link
        }
      };

      const response = await fetch(`/api/applicants/opportunities/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have token
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit application';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use generic message
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Application submitted successfully:', result);
      setApplicationSubmitted(true);
      
    } catch (err) {
      console.error('Application submission error:', err);
      throw err; // Re-throw to be caught by form component
    }
  };

  const handleCancel = () => {
    navigate('/explore'); // Navigate back to explore page
  };

  const handleBackToExplore = () => {
    navigate('/explore');
  };

  // Loading state
  if (loading) {
    return (
      <div className='overflow-x-hidden flex flex-col items-center h-screen bg-white font-inter'>
        <Navbar/>
        <div className='flex justify-center items-center h-64'>
          <div className='text-lg text-gray-600'>Loading opportunity details...</div>
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
        <div className='flex flex-col justify-center items-center h-64 space-y-4'>
          <div className='text-lg text-red-600'>Error: {error}</div>
          <button 
            onClick={handleBackToExplore}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Back to Explore
          </button>
        </div>
        <BottomBar/>
      </div>
    );
  }

  // Success state
  if (applicationSubmitted) {
    return (
      <div className='overflow-x-hidden flex flex-col items-center h-screen bg-white font-inter'>
        <Navbar/>
        <div className='flex flex-col justify-center items-center h-64 space-y-4 text-center px-4'>
          <div className='text-2xl font-semibold text-green-600'>Application Submitted Successfully!</div>
          <div className='text-gray-600'>
            Your application for "{opportunity?.title}" has been submitted. 
            You'll be notified about the status of your application.
          </div>
          <button 
            onClick={handleBackToExplore}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors'
          >
            Back to Explore More Opportunities
          </button>
        </div>
        <BottomBar/>
      </div>
    );
  }

  return (
    <div className='overflow-x-hidden flex flex-col items-center min-h-screen bg-white mb-[120px] font-inter'>
      <Navbar/>
      
      {/* Opportunity Details */}
      {opportunity && (
        <div className='w-full max-w-4xl px-4 mt-4 mb-6'>
          <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>{opportunity.title}</h2>
            <p className='text-gray-600 mb-4'>{opportunity.description}</p>
            <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
              <span>Type: {opportunity.opportunityType}</span>
              <span>Openings: {opportunity.numberOfOpenings}</span>
              <span className={opportunity.isPaid ? 'text-green-600' : 'text-gray-600'}>
                {opportunity.isPaid ? 'Paid' : 'Unpaid'}
              </span>
              <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Application Form */}
      <ApplyForOpportunityForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      
      <BottomBar/>
    </div>
  );
};

export default ApplyForOpportunity;