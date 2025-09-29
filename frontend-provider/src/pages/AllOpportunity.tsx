import { Link } from "react-router"
import OpportunityService from "../api/api.opportunities";
import useCompanyStore from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Label } from "@radix-ui/react-label";
import { Loader2, Calendar, Users, DollarSign, Briefcase, Eye, Edit, Trash2 } from "lucide-react";

// Mock data for demo - will be used if API fails
const mockOpportunities = [
  {
    _id: '1',
    title: 'Frontend Developer Internship',
    description: 'Looking for talented frontend developers to work on our React-based web application. Must have experience with modern JavaScript frameworks.',
    numberOfOpenings: 3,
    isPaid: true,
    amount: 15000,
    type: 'development',
    status: 'open',
    deadline: '2025-10-15',
    applications: 12,
    skills: [
      { name: 'React', level: 'Intermediate' },
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'CSS', level: 'Intermediate' }
    ],
    createdAt: '2025-09-15'
  },
  {
    _id: '2',
    title: 'UI/UX Design Project',
    description: 'Need creative UI/UX designers to redesign our mobile application. Experience with Figma and user research is essential.',
    numberOfOpenings: 2,
    isPaid: true,
    amount: 20000,
    type: 'design',
    status: 'open',
    deadline: '2025-10-20',
    applications: 8,
    skills: [
      { name: 'Figma', level: 'Advanced' },
      { name: 'UI/UX Design', level: 'Advanced' }
    ],
    createdAt: '2025-09-20'
  },
  {
    _id: '3',
    title: 'Content Writing & Marketing',
    description: 'Seeking creative content writers for blog posts, social media content, and marketing materials. SEO knowledge is a plus.',
    numberOfOpenings: 5,
    isPaid: true,
    amount: 8000,
    type: 'marketing',
    status: 'open',
    deadline: '2025-10-10',
    applications: 15,
    skills: [
      { name: 'Content Writing', level: 'Intermediate' },
      { name: 'SEO', level: 'Beginner' }
    ],
    createdAt: '2025-09-10'
  },
  {
    _id: '4',
    title: 'Data Analysis Survey Project',
    description: 'Analyze customer survey data and provide actionable insights. Experience with Python and data visualization tools required.',
    numberOfOpenings: 2,
    isPaid: true,
    amount: 12000,
    type: 'research',
    status: 'open',
    deadline: '2025-10-25',
    applications: 6,
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'Data Analysis', level: 'Advanced' }
    ],
    createdAt: '2025-09-18'
  },
  {
    _id: '5',
    title: 'Mobile App Development - Flutter',
    description: 'Build a cross-platform mobile application using Flutter. Experience with Firebase and REST APIs is required.',
    numberOfOpenings: 1,
    isPaid: true,
    amount: 25000,
    type: 'development',
    status: 'open',
    deadline: '2025-11-05',
    applications: 9,
    skills: [
      { name: 'Flutter', level: 'Advanced' },
      { name: 'Dart', level: 'Advanced' }
    ],
    createdAt: '2025-09-22'
  },
  {
    _id: '6',
    title: 'Social Media Campaign Management',
    description: 'Manage our social media presence across platforms. Create engaging content and analyze performance metrics.',
    numberOfOpenings: 2,
    isPaid: false,
    amount: 0,
    type: 'marketing',
    status: 'open',
    deadline: '2025-10-18',
    applications: 11,
    skills: [
      { name: 'Social Media Marketing', level: 'Intermediate' },
      { name: 'Content Creation', level: 'Intermediate' }
    ],
    createdAt: '2025-09-12'
  }
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    development: 'bg-blue-100 text-blue-800',
    design: 'bg-purple-100 text-purple-800',
    marketing: 'bg-green-100 text-green-800',
    research: 'bg-orange-100 text-orange-800',
    survey: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800'
  };
  return colors[type] || colors.other;
};

const getDaysLeft = (deadline: string) => {
  const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return days;
};

function AllOpportunity() {
  const { company } = useCompanyStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['OpportunitiesData', company?._id],
    queryFn: () => OpportunityService.GetCompanyOpportunities(company?._id || ''),
    enabled: !!company?._id,
    retry: 1,
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading opportunities...</p>
      </div>
    );
  }

  // Use mock data if error or no data - Perfect for demo!
  const opportunities = isError || !data?.opportunities 
    ? mockOpportunities 
    : data.opportunities;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posted</p>
              <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunities.reduce((sum: number, opp: any) => sum + (opp.applications || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunities.filter((o: any) => o.status === 'open').length}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunities.filter((o: any) => o.isPaid).length}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 flex gap-2">
          <strong>Note:</strong>
          <Label htmlFor="alert">
            Only First Payment Done Opportunities will be Visible to Users
          </Label>
        </p>
      </div>

      <div className="container mx-auto py-2 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Opportunities
          </h1>
          <Link 
            to='/Dashboard/createOpportunity'
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            Create New Opportunity
          </Link>
        </div>

        {/* Opportunities Grid */}
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity: any) => (
              <div key={opportunity._id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                    </span>
                    {opportunity.isPaid && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ₹{opportunity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>

                  {/* Skills */}
                  {opportunity.skills && opportunity.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {opportunity.skills.slice(0, 3).map((skill: any, idx: number) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {skill.name}
                          </span>
                        ))}
                        {opportunity.skills.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{opportunity.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {opportunity.applications || 0} Applications
                      </span>
                      <span className="text-gray-600 flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {opportunity.numberOfOpenings} Openings
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {getDaysLeft(opportunity.deadline)} days left
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        getDaysLeft(opportunity.deadline) > 7 ? 'bg-green-100 text-green-800' :
                        getDaysLeft(opportunity.deadline) > 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Link
                      to={`/Dashboard/applications/${opportunity._id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Applications
                    </Link>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mb-4" />
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