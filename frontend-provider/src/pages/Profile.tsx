import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Users, Calendar, Edit2, Save, X, Briefcase, Award, TrendingUp } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: 'Tech Innovations Pvt Ltd',
    username: 'techinnovations',
    email: 'contact@techinnovations.com',
    phone: '+91 98765 43210',
    address: 'Sector 18, Cyber City, Gurugram, Haryana 122001',
    website: 'https://techinnovations.com',
    industry: 'Information Technology',
    size: '50-200 employees',
    founded: '2018',
    description: 'We are a leading technology company specializing in innovative software solutions and digital transformation services. Our mission is to empower businesses through cutting-edge technology and creative problem-solving.',
    specializations: ['Web Development', 'Mobile Apps', 'Cloud Solutions', 'AI/ML', 'Digital Marketing']
  });

  const stats = {
    opportunitiesPosted: 24,
    activeOpportunities: 12,
    totalHires: 45,
    successRate: 87
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="text-3xl font-bold mb-2 bg-white/20 text-white px-3 py-1 rounded border-2 border-white/50"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-2">{companyData.name}</h1>
                  )}
                  <p className="text-blue-100 text-lg">@{companyData.username}</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Opportunities Posted</p>
                <p className="text-3xl font-bold">{stats.opportunitiesPosted}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Active Now</p>
                <p className="text-3xl font-bold">{stats.activeOpportunities}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Total Hires</p>
                <p className="text-3xl font-bold">{stats.totalHires}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-blue-100 text-sm mb-1">Success Rate</p>
                <p className="text-3xl font-bold">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Basic Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {companyData.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={companyData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {companyData.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {companyData.website}
                    </a>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      value={companyData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      {companyData.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Company Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium text-gray-900">{companyData.industry}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {companyData.size}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {companyData.founded}
                  </span>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md border-2 border-yellow-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="font-bold text-gray-900">Premium Partner</h3>
                  <p className="text-sm text-gray-600">Active since 2018</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Top rated company</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Verified business</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - About & Specializations */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Company</h2>
              {isEditing ? (
                <textarea
                  value={companyData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{companyData.description}</p>
              )}
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Our Specializations</h2>
              <div className="flex flex-wrap gap-3">
                {companyData.specializations.map((spec, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Posted new opportunity</p>
                    <p className="text-sm text-gray-600">Frontend Developer Internship</p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Accepted application</p>
                    <p className="text-sm text-gray-600">UI/UX Design Project</p>
                    <p className="text-xs text-gray-400 mt-1">5 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Completed project successfully</p>
                    <p className="text-sm text-gray-600">Mobile App Development</p>
                    <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Application Response Rate</span>
                    <span className="text-blue-600 font-bold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Project Completion Rate</span>
                    <span className="text-green-600 font-bold">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Average Rating</span>
                    <span className="text-yellow-600 font-bold">4.8/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Candidate Satisfaction</span>
                    <span className="text-purple-600 font-bold">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '89%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}