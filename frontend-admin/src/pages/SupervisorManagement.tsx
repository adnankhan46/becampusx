import React, { useState } from 'react';
import { Users, UserCheck, Clock, CheckCircle, XCircle, Search, Filter, ChevronDown, Mail, Phone, Building, Award, FileText, Calendar, Send } from 'lucide-react';

// Mock data for demonstration
const mockStudents = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@university.edu',
    admissionNumber: 'CS2021001',
    department: 'Computer Science',
    year: '3rd Year',
    opportunity: 'Full Stack Development Internship',
    completionDate: '2025-09-15',
    status: 'pending_supervisor',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    phone: '+91 98765 43210',
    skills: ['React', 'Node.js', 'MongoDB'],
    gpa: '8.5'
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    admissionNumber: 'CS2021002',
    department: 'Computer Science',
    year: '3rd Year',
    opportunity: 'Data Science Research Project',
    completionDate: '2025-09-20',
    status: 'pending_supervisor',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    phone: '+91 98765 43211',
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    gpa: '9.2'
  },
  {
    id: '3',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@university.edu',
    admissionNumber: 'CS2021003',
    department: 'Computer Science',
    year: '3rd Year',
    opportunity: 'Mobile App Development',
    completionDate: '2025-09-18',
    status: 'assigned',
    supervisor: 'Dr. Amit Verma',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    phone: '+91 98765 43212',
    skills: ['React Native', 'Flutter', 'Firebase'],
    gpa: '8.8'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@university.edu',
    admissionNumber: 'CS2021004',
    department: 'Computer Science',
    year: '3rd Year',
    opportunity: 'UI/UX Design Internship',
    completionDate: '2025-09-22',
    status: 'pending_supervisor',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    phone: '+91 98765 43213',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    gpa: '9.0'
  }
];

const mockSupervisors = [
  { id: '1', name: 'Dr. Amit Verma', department: 'Computer Science', expertise: ['Web Development', 'Software Engineering'], students: 3 },
  { id: '2', name: 'Prof. Sunita Singh', department: 'Computer Science', expertise: ['Data Science', 'AI/ML'], students: 2 },
  { id: '3', name: 'Dr. Rajesh Gupta', department: 'Computer Science', expertise: ['Mobile Development', 'Cloud Computing'], students: 4 },
  { id: '4', name: 'Prof. Meera Iyer', department: 'Computer Science', expertise: ['UI/UX', 'HCI'], students: 1 }
];

const SupervisorManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [assignedStudents, setAssignedStudents] = useState(
    mockStudents.filter(s => s.status === 'assigned')
  );
  const [successMessage, setSuccessMessage] = useState('');

  const pendingStudents = mockStudents.filter(s => s.status === 'pending_supervisor');
  
  const filteredStudents = (activeTab === 'pending' ? pendingStudents : assignedStudents)
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(student => 
      filterDepartment === 'all' || student.department === filterDepartment
    );

  const handleAssign = () => {
    if (selectedStudent && selectedSupervisor) {
      const supervisor = mockSupervisors.find(s => s.id === selectedSupervisor);
      const updatedStudent = {
        ...selectedStudent,
        status: 'assigned',
        supervisor: supervisor.name
      };
      
      setAssignedStudents([...assignedStudents, updatedStudent]);
      setSuccessMessage(`Successfully assigned ${selectedStudent.name} to ${supervisor.name}`);
      setShowAssignModal(false);
      setSelectedStudent(null);
      setSelectedSupervisor('');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Supervisor Management</h1>
              <p className="text-gray-600 mt-1">Assign supervisors to students who completed their assignments</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Send className="w-4 h-4" />
                Bulk Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in slide-in-from-top">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Students"
            value={mockStudents.length}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={Clock}
            label="Pending Assignment"
            value={pendingStudents.length}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            icon={UserCheck}
            label="Assigned"
            value={assignedStudents.length}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={Award}
            label="Supervisors"
            value={mockSupervisors.length}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs and Search */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'pending'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pending ({pendingStudents.length})
                </button>
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'assigned'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Assigned ({assignedStudents.length})
                </button>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={student.profilePicture}
                      alt={student.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'assigned'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {student.status === 'assigned' ? 'Assigned' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {student.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          {student.admissionNumber} • {student.year}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          GPA: {student.gpa}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{student.opportunity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Completed on: {new Date(student.completionDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Skills:</span>
                        {student.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {student.supervisor && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Supervised by:</span>
                          <span className="font-medium text-gray-900">{student.supervisor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {student.status === 'pending_supervisor' && (
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowAssignModal(true);
                      }}
                      className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      Assign Supervisor
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Assign Supervisor</h2>
              <p className="text-gray-600 mt-1">Select a supervisor for {selectedStudent?.name}</p>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent?.profilePicture}
                    alt={selectedStudent?.name}
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedStudent?.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedStudent?.opportunity}</p>
                  </div>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Supervisor
              </label>
              
              <div className="space-y-3">
                {mockSupervisors.map((supervisor) => (
                  <div
                    key={supervisor.id}
                    onClick={() => setSelectedSupervisor(supervisor.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSupervisor === supervisor.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{supervisor.name}</h4>
                        <p className="text-sm text-gray-600">{supervisor.department}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {supervisor.expertise.map((exp, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Current Students</p>
                        <p className="text-2xl font-bold text-gray-900">{supervisor.students}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedStudent(null);
                  setSelectedSupervisor('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedSupervisor}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Assign Supervisor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorManagement;