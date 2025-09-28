import { Link } from "react-router"
import OpportunityService from "../api/api.opportunities";
import useCompanyStore from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Label } from "@radix-ui/react-label";

function AllOpportunity() {
  const {company} = useCompanyStore();
  const {data, isLoading} = useQuery({
    queryKey: ['OpportunitiesData'],
    queryFn: () => OpportunityService.GetCompanyOpportunities(company?._id || ''),
    enabled: !!company?._id,
  })

  if (isLoading) {
    return <p>Loading opportunities...</p>;
  }
  
  const opportunities = data?.opportunities ?? [];

  return (
    <div>
      <p className="font-bold flex gap-2 px-4 text-primary">NOTE:
      {<Label htmlFor="alert">Only First Payment Done Opportunities will be Visible to Users</Label>}
      </p>

      <div className="container mx-auto py-2 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Opportunities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(opportunities.length > 0) ?
            opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity._id} opportunity={opportunity} />
            ))
          :
            <div className="border flex-col md:flex md:items-center text-primary font-semibold">
              <div>Create your first opportunity</div>
              <Link className="cursor-pointer p-2 bg-primary text-white rounded-lg" to='/Dashboard/createOpportunity'>
                Create Opportunity
              </Link>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default AllOpportunity;
