import { Link } from "react-router"
import OpportunityService from "../api/api.opportunities";
import useCompanyStore from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Label } from "@radix-ui/react-label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

function AllOpportunity() {
  const { company } = useCompanyStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['OpportunitiesData', company?._id],
    queryFn: () => OpportunityService.GetCompanyOpportunities(company?._id || ''),
    enabled: !!company?._id,
    retry: 1,
  });

  console.log('Company ID:', company?._id);
  console.log('Query Data:', data);
  console.log('Is Loading:', isLoading);
  console.log('Is Error:', isError);
  console.log('Error:', error);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading opportunities...</p>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading opportunities: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if company is not loaded
  if (!company?._id) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert>
          <AlertDescription>
            Company information not found. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Extract opportunities from response
  const opportunities = data?.opportunities ?? [];

  // Debug function
  const checkAuth = () => {
    console.log('=== AUTH DEBUG ===');
    console.log('1. Company from Zustand store:', company);
    console.log('2. Token from store:', company?.token);
    console.log('3. All LocalStorage keys:', Object.keys(localStorage));
    
    // Try to manually get token
    const storage = localStorage.getItem('company-storage');
    console.log('4. Raw storage string:', storage);
    
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        console.log('5. Parsed storage object:', parsed);
        console.log('6. Token locations:');
        console.log('   - parsed.state?.company?.token:', parsed.state?.company?.token);
        console.log('   - parsed.company?.token:', parsed.company?.token);
        console.log('   - parsed.token:', parsed.token);
        
        // Test manual token retrieval
        const token = parsed.state?.company?.token;
        if (token) {
          console.log('✅ TOKEN FOUND! First 20 chars:', token.substring(0, 20));
        } else {
          console.log('❌ TOKEN NOT FOUND');
        }
      } catch (e) {
        console.log('❌ Parse error:', e);
      }
    } else {
      console.log('❌ No company-storage in localStorage');
    }
    console.log('=================');
  };

  return (
    <div>
      {/* Temporary Debug Section */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 mb-4">
        <p className="font-bold mb-2">🔍 Debug Mode</p>
        <button 
          onClick={checkAuth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Auth in Console
        </button>
        <p className="text-sm mt-2">
          Company ID: {company?._id} | 
          Token: {company?.token ? '✓ Exists' : '✗ Missing'}
        </p>
      </div>

      <p className="font-bold flex gap-2 px-4 text-primary mb-4">
        NOTE:
        <Label htmlFor="alert">
          Only First Payment Done Opportunities will be Visible to Users
        </Label>
      </p>

      <div className="container mx-auto py-2 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Available Opportunities
          </h1>
          <Link 
            to='/Dashboard/createOpportunity'
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create New Opportunity
          </Link>
        </div>

        {/* Show count */}
        <p className="text-sm text-gray-600 mb-4">
          Total Opportunities: {opportunities.length}
        </p>

        {/* Opportunities Grid */}
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity._id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <div className="text-xl font-semibold text-gray-700 mb-2">
              No Opportunities Yet
            </div>
            <div className="text-gray-500 mb-6">
              Create your first opportunity to get started
            </div>
            <Link 
              to='/Dashboard/createOpportunity'
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Create Opportunity
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllOpportunity;