import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import BottomBar from '../components/Bottombar';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useGetPostsByUserQuery } from '../redux/posts/postApi';
import { useUpdatePasswordMutation, useLogoutMutation } from '../redux/apiSlice';
import { setCurrentUser } from '../redux/user/userSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { 
  BadgeCheck, 
  Briefcase, 
  FileText, 
  User, 
  Settings,
  Plus,
  Download,
  Upload,
  X,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Edit,
  Trash2
} from 'lucide-react';
import IDCardVerification from '../components/IDCardVerification';

const Profile = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [updatePassword, { isLoading: isUpdating, error: updateError }] = useUpdatePasswordMutation();

  // State for applied opportunities
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);

  // State for profile data
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [showSkillModal, setShowSkillModal] = useState(false);

  // State for resume
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  // State for bio and portfolio
  const [bio, setBio] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    twitter: ''
  });
  const [editingProfile, setEditingProfile] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const { data: postsData } = useGetPostsByUserQuery({ page, limit: 6, userId: currentUser._id });

  const userPosts = postsData ? postsData.posts : [];

  // Fetch applied opportunities
  const fetchAppliedOpportunities = async () => {
    try {
      const response = await fetch(`/api/applicants/applied-opp/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAppliedOpportunities(data.appliedOpportunities || []);
      }
    } catch (error) {
      console.error('Failed to fetch applied opportunities:', error);
    }
  };

  // Fetch student profile
  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/student-profile/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(data);
        setSkills(data.skills || []);
        setBio(data.bio || '');
        setPortfolio(data.portfolio || '');
        setSocialLinks(data.socialLinks || { linkedin: '', github: '', twitter: '' });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchAppliedOpportunities();
      fetchProfile();
    }
  }, [currentUser]);

  // Handle skill addition
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    try {
      const response = await fetch(`/api/student-profile/${currentUser._id}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ skills: [newSkill] })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSkills(data.profile.skills);
        setNewSkill({ name: '', level: 'Beginner' });
        setShowSkillModal(false);
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  // Handle skill removal
  const handleRemoveSkill = async (skillName) => {
    try {
      const response = await fetch(`/api/student-profile/${currentUser._id}/skills`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ skillName })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSkills(data.profile.skills);
      }
    } catch (error) {
      console.error('Failed to remove skill:', error);
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingResume(true);
    
    try {
      // In a real implementation, you would upload to a file service like AWS S3
      // For now, we'll simulate with a placeholder URL
      const fileUrl = `https://example.com/resumes/${file.name}`;
      
      const response = await fetch(`/api/student-profile/${currentUser._id}/resume`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          fileName: file.name,
          fileUrl: fileUrl
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        alert('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
    } finally {
      setUploadingResume(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(`/api/student-profile/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bio, portfolio, socialLinks })
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const fetchMorePosts = () => {
    if (postsData && postsData.hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!password) {
      alert('Please enter a new password');
      return;
    }

    try {
      const result = await updatePassword({ password }).unwrap();
      alert('Password updated successfully:', result);
      setPassword('');
    } catch (error) {
      alert('Failed to update password:', error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout().unwrap();
      dispatch(setCurrentUser(null));
      localStorage.removeItem('persist:root');
      localStorage.removeItem('nsfwModelLoaded');
      navigate("/login");
      console.log("LogOut Success");
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'selected': return 'text-green-600 bg-green-100';
      case 'shortlisted': return 'text-blue-600 bg-blue-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'selected': return <CheckCircle className="w-4 h-4" />;
      case 'shortlisted': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <Award className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 mb-[120px] font-inter">
      <Navbar />
      
      <div className='flex flex-col w-full max-w-6xl mx-auto px-4'>
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 mt-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={currentUser.profilePicture} 
              className='h-32 w-32 rounded-full object-cover border-4 border-blue-100' 
              alt="Profile" 
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentUser.admissionNumber}</h1>
              <div className='flex gap-2 items-center justify-center md:justify-start mb-3'>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {currentUser?.year}-{parseInt((currentUser?.year))+4}
                </span>
                {currentUser.isAuthenticated && (
                  <BadgeCheck className='w-6 h-6 text-blue-500'/>
                )}
              </div>
              {bio && <p className="text-gray-600 max-w-md">{bio}</p>}
            </div>
            <IDCardVerification />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'posts', label: 'My Posts', icon: FileText },
              { id: 'opportunities', label: 'Applied Opportunities', icon: Briefcase },
              { id: 'profile', label: 'Profile & Skills', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Posts</h2>
                <InfiniteScroll
                  dataLength={userPosts.length}
                  next={fetchMorePosts}
                  hasMore={postsData && postsData.hasMore}
                  loader={<div className="text-center py-4">Loading more posts...</div>}
                  endMessage={<div className="text-center py-4 text-gray-500">No more posts to show</div>}
                >
                  {userPosts.length > 0 ? (
                    <div className="space-y-4">
                      {userPosts.map((post) => (
                        <PostCard
                          key={post.postId}
                          text={post.text}
                          section={post.section}
                          gender={post.gender}
                          profilePicture={post.profilePicture}
                          postImage={post.postImage}
                          time={new Date(post.createdAt).toLocaleString()}
                          postId={post.postId}
                          postUser={post.user}
                          year={post.year}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      You haven't posted anything yet.
                    </div>
                  )}
                </InfiniteScroll>
              </div>
            )}

            {/* Applied Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Applied Opportunities</h2>
                {appliedOpportunities.length > 0 ? (
                  <div className="grid gap-4">
                    {appliedOpportunities.map((opp) => (
                      <div key={opp._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-800">{opp.title}</h3>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opp.status)}`}>
                            {getStatusIcon(opp.status)}
                            {opp.status}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {opp.companyName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied: {new Date(opp.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {opp.description}
                        </p>
                        
                        <button
                          onClick={() => {
                            setSelectedOpportunity(opp);
                            setShowOpportunityModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Details →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You haven't applied to any opportunities yet.
                  </div>
                )}
              </div>
            )}

            {/* Profile & Skills Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Profile & Skills</h2>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    {editingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Bio</label>
                      {editingProfile ? (
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          rows="3"
                          maxLength="500"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-700">{bio || 'No bio added yet.'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Portfolio URL</label>
                      {editingProfile ? (
                        <input
                          type="url"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                          placeholder="https://yourportfolio.com"
                        />
                      ) : (
                        <p className="text-gray-700">{portfolio || 'No portfolio added yet.'}</p>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Social Links</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(socialLinks).map(([platform, url]) => (
                        <div key={platform}>
                          <label className="block text-xs text-gray-600 mb-1 capitalize">{platform}</label>
                          {editingProfile ? (
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => setSocialLinks({...socialLinks, [platform]: e.target.value})}
                              className="w-full p-2 border rounded-lg text-sm"
                              placeholder={`${platform} URL`}
                            />
                          ) : (
                            <p className="text-gray-700 text-sm">{url || `No ${platform} added.`}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {editingProfile && (
                    <button
                      onClick={handleProfileUpdate}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  )}
                </div>

                {/* Resume Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Resume</h3>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        disabled={uploadingResume}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {profileData?.resume?.fileName ? (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{profileData.resume.fileName}</span>
                      <span className="text-sm text-gray-500">
                        Uploaded: {new Date(profileData.resume.uploadedAt).toLocaleDateString()}
                      </span>
                      <a
                        href={profileData.resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500">No resume uploaded yet.</p>
                  )}
                </div>

                {/* Skills Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Skills</h3>
                    <button
                      onClick={() => setShowSkillModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                  
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {skill.level}
                          </span>
                          <button
                            onClick={() => handleRemoveSkill(skill.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No skills added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Account Settings</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input 
                      className="w-full p-3 border rounded-lg bg-gray-100" 
                      type="text" 
                      value={currentUser.username} 
                      readOnly 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      className="w-full p-3 border rounded-lg bg-gray-100" 
                      type="email" 
                      value={currentUser.email} 
                      readOnly 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Change Password</label>
                    <input 
                      className="w-full p-3 border rounded-lg" 
                      type="password" 
                      placeholder="Enter new password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                    <p className='text-xs text-gray-600 mt-1'>
                      NOTE: Passwords are hashed and then stored securely.
                    </p>
                  </div>
                  
                  <div className='flex gap-4'>
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700" 
                      onClick={handleUpdate} 
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Change Password'}
                    </button>
                    <button 
                      className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                  
                  {updateError && (
                    <div className="text-red-500 text-sm">
                      Error: {updateError.data?.message || 'Failed to update password.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {showOpportunityModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedOpportunity.title}</h2>
                <button
                  onClick={() => setShowOpportunityModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOpportunity.status)}`}>
                    {getStatusIcon(selectedOpportunity.status)}
                    {selectedOpportunity.status}
                  </div>
                  <span className="text-gray-600">Applied: {new Date(selectedOpportunity.appliedAt).toLocaleDateString()}</span>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Company</h3>
                  <p className="text-gray-700">{selectedOpportunity.companyName}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedOpportunity.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Type</h3>
                    <p className="text-gray-700 capitalize">{selectedOpportunity.type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Compensation</h3>
                    <p className="text-gray-700">
                      {selectedOpportunity.isPaid ? `₹${selectedOpportunity.amount}` : 'Unpaid'}
                    </p>
                  </div>
                </div>
                
                {selectedOpportunity.startDate && (
                  <div>
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p className="text-gray-700">
                      {new Date(selectedOpportunity.startDate).toLocaleDateString()} 
                      {selectedOpportunity.endDate && 
                        ` - ${new Date(selectedOpportunity.endDate).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                )}
                
                {selectedOpportunity.certificate && (
                  <div>
                    <h3 className="font-semibold mb-2">Certificate</h3>
                    <a 
                      href={selectedOpportunity.certificate} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Skill</h2>
              <button
                onClick={() => setShowSkillModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. JavaScript, React, Python"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Skill Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.name.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowSkillModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomBar />
    </div>
  );
};

export default Profile;