import React, { useState } from 'react';
import { Users, UserCheck, UserX, Search, Mail, Phone, Calendar, Award, BookOpen, Filter, MoreVertical, Shield, Ban, CheckCircle, XCircle, Download, TrendingUp } from 'lucide-react';

// Mock data for demonstration
const mockUsers = [
  {
    _id: '1',
    admissionNumber: 'CS2021001',
    username: 'Rahul Sharma',
    email: 'rahul.sharma@university.edu',
    phone: '+91 98765 43210',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'A',
    gpa: '8.5',
    verified: true,
    isActive: true,
    joinedDate: '2021-08-15',
    completedOpportunities: 3,
    ongoingOpportunities: 1,
    posts: 12,
    comments: 45
  },
  {
    _id: '2',
    admissionNumber: 'CS2021002',
    username: 'Priya Patel',
    email: 'priya.patel@university.edu',
    phone: '+91 98765 43211',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'B',
    gpa: '9.2',
    verified: true,
    isActive: true,
    joinedDate: '2021-08-15',
    completedOpportunities: 5,
    ongoingOpportunities: 2,
    posts: 18,
    comments: 67
  },
  {
    _id: '3',
    admissionNumber: 'EC2022001',
    username: 'Arjun Kumar',
    email: 'arjun.kumar@university.edu',
    phone: '+91 98765 43212',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    department: 'Electronics',
    year: '2nd Year',
    section: 'A',
    gpa: '8.8',
    verified: false,
    isActive: true,
    joinedDate: '2022-08-20',
    completedOpportunities: 1,
    ongoingOpportunities: 1,
    posts: 8,
    comments: 23
  },
  {
    _id: '4',
    admissionNumber: 'CS2021003',
    username: 'Sneha Reddy',
    email: 'sneha.reddy@university.edu',
    phone: '+91 98765 43213',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'A',
    gpa: '9.0',
    verified: true,
    isActive: true,
    joinedDate: '2021-08-15',
    completedOpportunities: 4,
    ongoingOpportunities: 2,
    posts: 15,
    comments: 52
  },
  {
    _id: '5',
    admissionNumber: 'ME2022002',
    username: 'Vijay Singh',
    email: 'vijay.singh@university.edu',
    phone: '+91 98765 43214',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
    department: 'Mechanical',
    year: '2nd Year',
    section: 'B',
    gpa: '7.8',
    verified: false,
    isActive: false,
    joinedDate: '2022-08-20',
    completedOpportunities: 0,
    ongoingOpportunities: 0,
    posts: 3,
    comments: 8
  },
  {
    _id: '6',
    admissionNumber: 'CS2023001',
    username: 'Ananya Desai',
    email: 'ananya.desai@university.edu',
    phone: '+91 98765 43215',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    department: 'Computer Science',
    year: '1st Year',
    section: 'A',
    gpa: '8.9',
    verified: true,
    isActive: true,
    joinedDate: '2023-08-18',
    completedOpportunities: 2,
    ongoingOpportunities: 1,
    posts: 10,
    comments: 34
  }
];

const UsersManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredUsers = users
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => 
      filterVerified === 'all' || 
      (filterVerified === 'verified' && user.verified) ||
      (filterVerified === 'unverified' && !user.verified)
    )
    .filter(user =>
      filterDepartment === 'all' || user.department === filterDepartment
    );

  const handleVerify = (userId) => {
    setUsers(users.map(u => 
      u._id === userId ? { ...u, verified: true } : u
    ));
    setSuccessMessage('User verified successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleBlock = (userId) => {
    setUsers(users.map(u => 
      u._id === userId ? { ...u, isActive: false } : u
    ));
    setSuccessMessage('User blocked successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUnblock = (userId) => {
    setUsers(users.map(u => 
      u._id === userId ? { ...u, isActive: true } : u
    ));
    setSuccessMessage('User unblocked successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-opacity-20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color} bg-opacity-10 p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const verifiedCount = users.filter(u => u.verified).length;
  const unverifiedCount = users.filter(u => !u.verified).length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Users Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor all registered users</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={users.length}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={UserCheck}
            label="Verified"
            value={verifiedCount}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={UserX}
            label="Unverified"
            value={unverifiedCount}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Users"
            value={activeCount}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="relative h-24 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="absolute -bottom-12 left-6">
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {user.verified && (
                    <div className="bg-white rounded-full p-1.5 shadow-md">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  {!user.isActive && (
                    <div className="bg-white rounded-full p-1.5 shadow-md">
                      <Ban className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-16 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.admissionNumber}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {showActionMenu === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                            setShowActionMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                        >
                          <Shield className="w-4 h-4" />
                          View Details
                        </button>
                        {!user.verified && (
                          <button
                            onClick={() => {
                              handleVerify(user._id);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify User
                          </button>
                        )}
                        {user.isActive ? (
                          <button
                            onClick={() => {
                              handleBlock(user._id);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Ban className="w-4 h-4" />
                            Block User
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleUnblock(user._id);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Unblock User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-green-500" />
                    {user.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    {user.department} • {user.year} • Section {user.section}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-amber-500" />
                    GPA: {user.gpa}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{user.completedOpportunities}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-gray-600 mb-1">Ongoing</p>
                    <p className="text-2xl font-bold text-purple-600">{user.ongoingOpportunities}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{user.posts} posts</span>
                    <span>{user.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.verified ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-white" />
              </button>
              <div className="absolute -bottom-16 left-8">
                <img
                  src={selectedUser.profilePicture}
                  alt={selectedUser.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                />
              </div>
            </div>

            <div className="pt-20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.username}</h2>
                  <p className="text-lg text-gray-600">{selectedUser.admissionNumber}</p>
                  <div className="flex items-center gap-3 mt-3">
                    {selectedUser.verified ? (
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Verified Account
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                        Unverified
                      </span>
                    )}
                    {selectedUser.isActive ? (
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200">
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    Academic Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Department</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.department}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Year</p>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.year}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Section</p>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.section}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">GPA</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.gpa}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Activity Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-blue-600">{selectedUser.completedOpportunities}</p>
                    <p className="text-xs text-gray-600 mt-1">Opportunities</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-xs text-gray-600 mb-1">Ongoing</p>
                    <p className="text-3xl font-bold text-purple-600">{selectedUser.ongoingOpportunities}</p>
                    <p className="text-xs text-gray-600 mt-1">Opportunities</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold text-green-600">{selectedUser.posts}</p>
                    <p className="text-xs text-gray-600 mt-1">Posts</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold text-amber-600">{selectedUser.comments}</p>
                    <p className="text-xs text-gray-600 mt-1">Comments</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined on {new Date(selectedUser.joinedDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>

              <div className="mt-6 flex gap-3">
                {!selectedUser.verified && (
                  <button
                    onClick={() => {
                      handleVerify(selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Verify User
                  </button>
                )}
                {selectedUser.isActive ? (
                  <button
                    onClick={() => {
                      handleBlock(selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Ban className="w-5 h-5" />
                    Block User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUnblock(selectedUser._id);
                      setShowUserModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Unblock User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;