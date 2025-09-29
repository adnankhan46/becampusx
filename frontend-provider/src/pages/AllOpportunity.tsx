import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, Award, Mail, Phone, GraduationCap, Star, Briefcase, Calendar, Building2, CheckCircle, TrendingUp, FileText } from 'lucide-react';

// Mock data for shortlisted students with Indian names
const mockShortlistedData = [
  {
    opportunityId: '1',
    opportunityTitle: 'Frontend Developer Internship',
    companyName: 'Tech Solutions India Pvt. Ltd.',
    type: 'development',
    deadline: '2025-10-15',
    numberOfOpenings: 3,
    shortlistedStudents: [
      {
        _id: 's1',
        name: 'Aditya Verma',
        email: 'aditya.verma@example.com',
        phone: '+91 98765 43210',
        education: 'B.Tech CSE, IIT Delhi',
        year: '3rd Year',
        cgpa: '8.9',
        skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'Git'],
        experience: '2 internships',
        portfolio: 'https://adityaverma.dev',
        appliedOn: '2025-09-22',
        shortlistedOn: '2025-09-25',
        status: 'shortlisted'
      },
      {
        _id: 's2',
        name: 'Nisha Agarwal',
        email: 'nisha.agarwal@example.com',
        phone: '+91 98123 45678',
        education: 'B.Tech IT, NIT Trichy',
        year: '4th Year',
        cgpa: '9.2',
        skills: ['React', 'JavaScript', 'Redux', 'HTML/CSS', 'REST API'],
        experience: '3 projects, 1 internship',
        portfolio: 'https://nishaagarwal.com',
        appliedOn: '2025-09-21',
        shortlistedOn: '2025-09-24',
        status: 'shortlisted'
      }
    ]
  },
  {
    opportunityId: '2',
    opportunityTitle: 'UI/UX Design Project',
    companyName: 'Creative Minds Studio',
    type: 'design',
    deadline: '2025-10-20',
    numberOfOpenings: 2,
    shortlistedStudents: [
      {
        _id: 's3',
        name: 'Anjali Deshmukh',
        email: 'anjali.d@example.com',
        phone: '+91 97654 32109',
        education: 'B.Des Product Design, NIFT Mumbai',
        year: '3rd Year',
        cgpa: '8.7',
        skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping', 'User Research'],
        experience: '5+ design projects',
        portfolio: 'https://anjalidesigns.in',
        appliedOn: '2025-09-20',
        shortlistedOn: '2025-09-23',
        status: 'selected'
      },
      {
        _id: 's4',
        name: 'Karthik Menon',
        email: 'karthik.m@example.com',
        phone: '+91 96543 21098',
        education: 'B.Tech CSE, BITS Pilani',
        year: '2nd Year',
        cgpa: '8.5',
        skills: ['Figma', 'Sketch', 'Illustrator', 'Prototyping'],
        experience: '3 design projects',
        portfolio: 'https://karthikdesigns.com',
        appliedOn: '2025-09-19',
        shortlistedOn: '2025-09-22',
        status: 'shortlisted'
      }
    ]
  },
  {
    opportunityId: '4',
    opportunityTitle: 'Content Writing - Tech Blog',
    companyName: 'Digital Media Solutions',
    type: 'marketing',
    deadline: '2025-10-10',
    numberOfOpenings: 4,
    shortlistedStudents: [
      {
        _id: 's5',
        name: 'Kavya Nair',
        email: 'kavya.n@example.com',
        phone: '+91 95432 10987',
        education: 'B.A. English, St. Xavier\'s College',
        year: '4th Year',
        cgpa: '9.1',
        skills: ['Content Writing', 'SEO', 'Technical Writing', 'Copywriting'],
        experience: '20+ published articles',
        portfolio: 'https://kavyawrites.com',
        appliedOn: '2025-09-17',
        shortlistedOn: '2025-09-20',
        status: 'selected'
      },
      {
        _id: 's6',
        name: 'Rohan Kapoor',
        email: 'rohan.k@example.com',
        phone: '+91 94321 09876',
        education: 'B.Tech CSE, VIT Vellore',
        year: '3rd Year',
        cgpa: '8.6',
        skills: ['Technical Writing', 'Content Writing', 'Blogging', 'SEO'],
        experience: '15 tech articles',
        portfolio: 'https://rohanwrites.in',
        appliedOn: '2025-09-16',
        shortlistedOn: '2025-09-19',
        status: 'selected'
      },
      {
        _id: 's7',
        name: 'Priya Chatterjee',
        email: 'priya.c@example.com',
        phone: '+91 93210 98765',
        education: 'B.A. Journalism, Symbiosis',
        year: '2nd Year',
        cgpa: '8.8',
        skills: ['Content Writing', 'Social Media', 'SEO', 'Research'],
        experience: '10+ articles, 2 blogs',
        portfolio: 'https://priyawrites.com',
        appliedOn: '2025-09-18',
        shortlistedOn: '2025-09-21',
        status: 'shortlisted'
      }
    ]
  },
  {
    opportunityId: '5',
    opportunityTitle: 'Full Stack Development Project',
    companyName: 'InnovateX Technologies',
    type: 'development',
    deadline: '2025-10-25',
    numberOfOpenings: 1,
    shortlistedStudents: [
      {
        _id: 's8',
        name: 'Aryan Malhotra',
        email: 'aryan.m@example.com',
        phone: '+91 92109 87654',
        education: 'B.Tech CSE, IIT Bombay',
        year: '4th Year',
        cgpa: '9.4',
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS'],
        experience: '2 full-stack projects, 3 internships',
        portfolio: 'https://aryanmalhotra.dev',
        appliedOn: '2025-09-23',
        shortlistedOn: '2025-09-26',
        status: 'shortlisted'
      },
      {
        _id: 's9',
        name: 'Shreya Kulkarni',
        email: 'shreya.k@example.com',
        phone: '+91 91098 76543',
        education: 'B.Tech CSE, IIIT Hyderabad',
        year: '4th Year',
        cgpa: '9.0',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL'],
        experience: '3 full-stack projects, 2 internships',
        portfolio: 'https://shreyakulkarni.dev',
        appliedOn: '2025-09-24',
        shortlistedOn: '2025-09-27',
        status: 'shortlisted'
      }
    ]
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

const statusColors = {
  shortlisted: 'bg-blue-100 text-blue-700 border-blue-300',
  selected: 'bg-green-100 text-green-700 border-green-300',
  rejected: 'bg-red-100 text-red-700 border-red-300'
};

function ShortlistedStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState(null);

  // Filter opportunities and students
  const filteredData = useMemo(() => {
    return mockShortlistedData.filter(opp => {
      const matchesType = filterType === 'all' || opp.type === filterType;
      const matchesSearch = opp.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           opp.shortlistedStudents.some(student => 
                             student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             student.email.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      
      // Filter students by status
      if (filterStatus !== 'all') {
        const hasMatchingStudent = opp.shortlistedStudents.some(s => s.status === filterStatus);
        return matchesType && matchesSearch && hasMatchingStudent;
      }
      
      return matchesType && matchesSearch;
    }).map(opp => ({
      ...opp,
      shortlistedStudents: filterStatus === 'all' 
        ? opp.shortlistedStudents 
        : opp.shortlistedStudents.filter(s => s.status === filterStatus)
    }));
  }, [searchTerm, filterType, filterStatus]);

  // Statistics
  const stats = {
    totalOpportunities: mockShortlistedData.length,
    totalShortlisted: mockShortlistedData.reduce((sum, o) => sum + o.shortlistedStudents.length, 0),
    totalSelected: mockShortlistedData.reduce((sum, o) => 
      sum + o.shortlistedStudents.filter(s => s.status === 'selected').length, 0
    ),
    avgCGPA: (mockShortlistedData.reduce((sum, o) => 
      sum + o.shortlistedStudents.reduce((s, st) => s + parseFloat(st.cgpa), 0), 0
    ) / mockShortlistedData.reduce((sum, o) => sum + o.shortlistedStudents.length, 0)).toFixed(2)
  };

  const getDaysRemaining = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="h-10 w-10 text-purple-600" />
              Shortlisted Students
            </h1>
            <p className="text-gray-600 mt-2">View and manage shortlisted candidates for your opportunities</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Opportunities</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOpportunities}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Shortlisted</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalShortlisted}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Selected</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalSelected}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg CGPA</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgCGPA}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
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
                placeholder="Search by opportunity, company, or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="selected">Selected</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Opportunities with Shortlisted Students */}
      <div className="space-y-6">
        {filteredData.map((opportunity) => (
          <div
            key={opportunity.opportunityId}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Opportunity Header */}
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 cursor-pointer"
              onClick={() => setExpandedOpportunity(expandedOpportunity === opportunity.opportunityId ? null : opportunity.opportunityId)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{opportunity.opportunityTitle}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[opportunity.type]} bg-white`}>
                      {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-100 mb-3">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{opportunity.companyName}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{opportunity.shortlistedStudents.length} shortlisted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{getDaysRemaining(opportunity.deadline)} days remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {opportunity.shortlistedStudents.map((student) => (
                  <div
                    key={student._id}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer"
                    onClick={() => setSelectedStudent(selectedStudent?._id === student._id ? null : student)}
                  >
                    {/* Student Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.education}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[student.status]}`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </div>

                    {/* Student Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-700"><strong>CGPA:</strong> {student.cgpa}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700"><strong>Year:</strong> {student.year}</span>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="h-4 w-4 text-green-600" />
                        <a href={`mailto:${student.email}`} className="hover:text-purple-600 hover:underline">
                          {student.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-orange-600" />
                        <span>{student.phone}</span>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Top Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium">
                            +{student.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm">
                      {selectedStudent?._id === student._id ? 'Hide Details' : 'View Full Profile'}
                    </button>

                    {/* Expanded Details */}
                    {selectedStudent?._id === student._id && (
                      <div className="mt-4 pt-4 border-t border-purple-200 space-y-3 animate-in slide-in-from-top">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">All Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {student.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium border border-purple-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600">Experience:</p>
                          <p className="text-sm text-gray-700 mt-1">{student.experience}</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600">Portfolio:</p>
                          <a 
                            href={student.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline mt-1 block"
                          >
                            {student.portfolio}
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="font-semibold">Applied:</span> {new Date(student.appliedOn).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-semibold">Shortlisted:</span> {new Date(student.shortlistedOn).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No shortlisted students found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default ShortlistedStudents;