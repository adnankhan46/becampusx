import React, { useState, useMemo } from 'react';
import { Calendar, DollarSign, Users, Clock, Filter, Search, Eye, CheckCircle, XCircle, TrendingUp, Briefcase, Award, Star } from 'lucide-react';

// Mock data for demonstration
const mockOpportunities = [
  {
    _id: '1',
    title: 'Frontend Developer Internship',
    description: 'Join our team to build modern web applications using React and TypeScript. Work on real-world projects with experienced developers.',
    numberOfOpenings: 3,
    isPaid: true,
    amount: 15000,
    deadline: '2025-10-15',
    type: 'development',
    status: 'open',
    skills: [
      { name: 'React', level: 'Intermediate' },
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'HTML/CSS', level: 'Intermediate' }
    ],
    applicants: [
      { userId: { name: 'John Doe', email: 'john@example.com' } },
      { userId: { name: 'Jane Smith', email: 'jane@example.com' } }
    ],
    selectedCandidates: [],
    createdAt: '2025-09-20',
    createdBy: { name: 'Tech Solutions Inc.' }
  },
  {
    _id: '2',
    title: 'UI/UX Design Project',
    description: 'Design intuitive user interfaces for our mobile app. Create wireframes, mockups, and interactive prototypes.',
    numberOfOpenings: 2,
    isPaid: true,
    amount: 12000,
    deadline: '2025-10-20',
    type: 'design',
    status: 'open',
    skills: [
      { name: 'Figma', level: 'Advanced' },
      { name: 'UI/UX Design', level: 'Intermediate' },
      { name: 'Prototyping', level: 'Intermediate' }
    ],
    applicants: [
      { userId: { name: 'Alice Johnson', email: 'alice@example.com' } },
      { userId: { name: 'Bob Wilson', email: 'bob@example.com' } },
      { userId: { name: 'Carol Davis', email: 'carol@example.com' } }
    ],
    selectedCandidates: [
      { userId: { name: 'Alice Johnson', email: 'alice@example.com' } }
    ],
    createdAt: '2025-09-18',
    createdBy: { name: 'Design Studio Pro' }
  },
  {
    _id: '3',
    title: 'Market Research Survey',
    description: 'Conduct comprehensive market research for our new product launch. Analyze consumer trends and compile detailed reports.',
    numberOfOpenings: 5,
    isPaid: false,
    amount: 0,
    deadline: '2025-11-01',
    type: 'research',
    status: 'open',
    skills: [
      { name: 'Data Analysis', level: 'Beginner' },
      { name: 'Communication', level: 'Intermediate' }
    ],
    applicants: [
      { userId: { name: 'David Lee', email: 'david@example.com' } }
    ],
    selectedCandidates: [],
    createdAt: '2025-09-25',
    createdBy: { name: 'Market Insights Ltd.' }
  },
  {
    _id: '4',
    title: 'Content Writing - Tech Blog',
    description: 'Write engaging technical articles about web development, AI, and emerging technologies. 5-7 articles per month.',
    numberOfOpenings: 4,
    isPaid: true,
    amount: 8000,
    deadline: '2025-10-10',
    type: 'marketing',
    status: 'open',
    skills: [
      { name: 'Content Writing', level: 'Advanced' },
      { name: 'SEO', level: 'Intermediate' },
      { name: 'Technical Writing', level: 'Intermediate' }
    ],
    applicants: [
      { userId: { name: 'Emma Brown', email: 'emma@example.com' } },
      { userId: { name: 'Frank Miller', email: 'frank@example.com' } },
      { userId: { name: 'Grace Taylor', email: 'grace@example.com' } },
      { userId: { name: 'Henry Anderson', email: 'henry@example.com' } }
    ],
    selectedCandidates: [
      { userId: { name: 'Emma Brown', email: 'emma@example.com' } },
      { userId: { name: 'Frank Miller', email: 'frank@example.com' } }
    ],
    createdAt: '2025-09-15',
    createdBy: { name: 'TechBlog Media' }
  },
  {
    _id: '5',
    title: 'Full Stack Development Project',
    description: 'Build a complete e-commerce platform with React frontend and Node.js backend. Includes payment integration and admin dashboard.',
    numberOfOpenings: 1,
    isPaid: true,
    amount: 25000,
    deadline: '2025-10-25',
    type: 'development',
    status: 'open',
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'MongoDB', level: 'Intermediate' },
      { name: 'REST API', level: 'Advanced' }
    ],
    applicants: [
      { userId: { name: 'Ivy Chen', email: 'ivy@example.com' } },
      { userId: { name: 'Jack Wilson', email: 'jack@example.com' } }
    ],
    selectedCandidates: [],
    createdAt: '2025-09-22',
    createdBy: { name: 'E-Commerce Solutions' }
  },
  {
    _id: '6',
    title: 'Social Media Management',
    description: 'Manage Instagram, Twitter, and LinkedIn accounts. Create engaging content, schedule posts, and analyze performance metrics.',
    numberOfOpenings: 2,
    isPaid: true,
    amount: 10000,
    deadline: '2025-10-30',
    type: 'marketing',
    status: 'open',
    skills: [
      { name: 'Digital Marketing', level: 'Intermediate' },
      { name: 'Content Creation', level: 'Advanced' },
      { name: 'Analytics', level: 'Beginner' }
    ],
    applicants: [],
    selectedCandidates: [],
    createdAt: '2025-09-28',
    createdBy: { name: 'Brand Boost Agency' }
  }
];

const typeColors = {
  development: 'bg-blue-100 text-blue-700 border-blue-300',
  design: 'bg-purple-100 text-purple-700 border-purple-300',
  research: 'bg-green-100 text-green-700 border-green-300',
  marketing: 'bg-orange-100 text-orange-700 border-orange-300',
  academic: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  other: 'bg-gray-100 text-gray-700 border-gray-300'
};

const skillLevelColors = {
  Beginner: 'bg-green-50 text-green-700 border-green-200',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  Expert: 'bg-red-50 text-red-700 border-red-200'
};

function AllApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPaid, setFilterPaid] = useState('all');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opp => {
      const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || opp.type === filterType;
      const matchesPaid = filterPaid === 'all' || 
                         (filterPaid === 'paid' && opp.isPaid) || 
                         (filterPaid === 'unpaid' && !opp.isPaid);
      
      return matchesSearch && matchesType && matchesPaid;
    });
  }, [searchTerm, filterType, filterPaid]);

  // Statistics
  const stats = {
    total: mockOpportunities.length,
    open: mockOpportunities.filter(o => o.status === 'open').length,
    totalApplicants: mockOpportunities.reduce((sum, o) => sum + o.applicants.length, 0),
    selected: mockOpportunities.reduce((sum, o) => sum + o.selectedCandidates.length, 0)
  };

  const getDaysRemaining = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDeadlineColor = (days) => {
    if (days <= 7) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 14) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="h-10 w-10 text-blue-600" />
              All Opportunities
            </h1>
            <p className="text-gray-600 mt-2">Manage and track all your posted opportunities</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Opportunities</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Openings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.open}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Applicants</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalApplicants}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Selected Candidates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.selected}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="research">Research</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
                <select
                  value={filterPaid}
                  onChange={(e) => setFilterPaid(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid Only</option>
                  <option value="unpaid">Unpaid Only</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => {
          const daysRemaining = getDaysRemaining(opp.deadline);
          const fillRate = (opp.selectedCandidates.length / opp.numberOfOpenings) * 100;

          return (
            <div
              key={opp._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 cursor-pointer group"
              onClick={() => setSelectedOpp(selectedOpp?._id === opp._id ? null : opp)}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold flex-1 group-hover:text-blue-100 transition-colors">
                    {opp.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[opp.type]} bg-white`}>
                    {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                  </span>
                </div>
                
                <p className="text-blue-100 text-sm line-clamp-2">{opp.description}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Openings</p>
                      <p className="font-semibold">{opp.numberOfOpenings}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Compensation</p>
                      <p className="font-semibold">
                        {opp.isPaid ? `₹${opp.amount.toLocaleString()}` : 'Unpaid'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getDeadlineColor(daysRemaining)}`}>
                  <Clock className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Deadline</p>
                    <p className="font-semibold text-sm">
                      {new Date(opp.deadline).toLocaleDateString()} ({daysRemaining} days left)
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {opp.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {opp.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${skillLevelColors[skill.level]}`}
                        >
                          {skill.name} • {skill.level}
                        </span>
                      ))}
                      {opp.skills.length > 3 && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                          +{opp.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Applicants Stats */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Application Progress</span>
                    <span className="text-sm font-bold text-blue-600">
                      {opp.selectedCandidates.length}/{opp.numberOfOpenings} filled
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(fillRate, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>{opp.applicants.length} applicants</span>
                    <span>{opp.selectedCandidates.length} selected</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-700">
                  <Eye className="h-5 w-5" />
                  View Details
                </button>
              </div>

              {/* Expanded Details */}
              {selectedOpp?._id === opp._id && (
                <div className="px-6 pb-6 pt-2 border-t bg-gray-50 animate-in slide-in-from-top">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        All Skills Required
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {opp.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${skillLevelColors[skill.level]}`}
                          >
                            {skill.name} • {skill.level}
                          </span>
                        ))}
                      </div>
                    </div>

                    {opp.applicants.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recent Applicants</h4>
                        <div className="space-y-2">
                          {opp.applicants.slice(0, 3).map((applicant, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {applicant.userId.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{applicant.userId.name}</p>
                                <p className="text-xs text-gray-500">{applicant.userId.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default AllApplications;