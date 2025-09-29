import React, { useState } from 'react';
import { FileText, Search, Heart, MessageCircle, Eye, MoreVertical, Trash2, Flag, CheckCircle, XCircle, Calendar, User, TrendingUp, Image as ImageIcon, Video } from 'lucide-react';

// Mock data for demonstration
const mockPosts = [
  {
    postId: '1',
    user: 'Rahul Sharma',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    section: 'Computer Science',
    year: '3rd Year',
    text: '🎉 Excited to share that I just completed my Full Stack Development Internship! Learned so much about React, Node.js, and MongoDB. Big thanks to my mentor for the amazing guidance throughout this journey. Looking forward to applying these skills in future projects! #WebDev #Internship',
    postImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    likes: 145,
    comments: 23,
    views: 892,
    createdAt: '2025-09-28T10:30:00Z',
    status: 'approved',
    flagged: false
  },
  {
    postId: '2',
    user: 'Priya Patel',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    section: 'Computer Science',
    year: '3rd Year',
    text: 'Just published my research paper on Machine Learning applications in healthcare! 📊 It\'s been a long journey of late nights and countless iterations, but totally worth it. Special thanks to Prof. Singh for the mentorship. Link in bio! #Research #ML #AI',
    postImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    likes: 234,
    comments: 45,
    views: 1523,
    createdAt: '2025-09-27T15:45:00Z',
    status: 'approved',
    flagged: false
  },
  {
    postId: '3',
    user: 'Arjun Kumar',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    section: 'Electronics',
    year: '2nd Year',
    text: 'Built my first mobile app using React Native! 📱 It\'s a student productivity tracker with features like task management, study timers, and grade calculator. Would love to get feedback from the community. GitHub link in comments!',
    postImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    likes: 189,
    comments: 34,
    views: 1045,
    createdAt: '2025-09-26T18:10:00Z',
    status: 'approved',
    flagged: false
  },
  {
    postId: '4',
    user: 'Anonymous User',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spam',
    section: 'Unknown',
    year: 'N/A',
    text: '🚨 SPAM ALERT 🚨 Click here for FREE cryptocurrency! Make $10000 in one day! Limited time offer! Visit suspicious-link.com NOW!!!',
    postImage: null,
    likes: 2,
    comments: 1,
    views: 45,
    createdAt: '2025-09-25T20:15:00Z',
    status: 'flagged',
    flagged: true
  },
  {
    postId: '5',
    user: 'Sneha Reddy',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    section: 'Computer Science',
    year: '3rd Year',
    text: '🎨 Just finished designing the new campus event website! Used Figma for the design and it came out better than expected. Check out the modern UI with dark mode support. What do you all think? Feedback welcome! #UIUXDesign #WebDesign',
    postImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    likes: 267,
    comments: 52,
    views: 1834,
    createdAt: '2025-09-25T14:30:00Z',
    status: 'approved',
    flagged: false
  },
  {
    postId: '6',
    user: 'Vijay Singh',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
    section: 'Mechanical',
    year: '2nd Year',
    text: 'Anyone interested in forming a study group for the upcoming Data Structures exam? We can meet at the library every weekend. Drop a comment if you\'re in! 📚',
    postImage: null,
    likes: 78,
    comments: 15,
    views: 456,
    createdAt: '2025-09-24T11:20:00Z',
    status: 'approved',
    flagged: false
  }
];

const PostsManagement = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredPosts = posts
    .filter(post => 
      post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post => 
      filterStatus === 'all' || post.status === filterStatus
    );

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.postId !== postId));
    setSuccessMessage('Post deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowPostModal(false);
  };

  const handleApprove = (postId) => {
    setPosts(posts.map(p => 
      p.postId === postId ? { ...p, status: 'approved', flagged: false } : p
    ));
    setSuccessMessage('Post approved successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFlag = (postId) => {
    setPosts(posts.map(p => 
      p.postId === postId ? { ...p, status: 'flagged', flagged: true } : p
    ));
    setSuccessMessage('Post flagged for review');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'flagged': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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

  const approvedCount = posts.filter(p => p.status === 'approved').length;
  const flaggedCount = posts.filter(p => p.status === 'flagged').length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-pink-600" />
                Posts Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor and moderate all user posts</p>
            </div>
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
            icon={FileText}
            label="Total Posts"
            value={posts.length}
            color="text-pink-600"
            bgColor="bg-pink-50"
          />
          <StatCard
            icon={Heart}
            label="Total Likes"
            value={totalLikes}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={totalViews.toLocaleString()}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={Flag}
            label="Flagged Posts"
            value={flaggedCount}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent min-w-[200px]"
            >
              <option value="all">All Posts</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.postId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                setShowPostModal(true);
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.profilePicture}
                      alt={post.user}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.user}</h3>
                      <p className="text-sm text-gray-600">{post.section} • {post.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                    {post.flagged && (
                      <Flag className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{post.text}</p>

                {post.postImage && (
                  <img
                    src={post.postImage}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">{post.views}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No posts found</p>
          </div>
        )}
      </div>

      {/* Post Details Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPostModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-8">
              {/* User Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPost.profilePicture}
                    alt={selectedPost.user}
                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedPost.user}</h3>
                    <p className="text-gray-600">{selectedPost.section} • {selectedPost.year}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedPost.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedPost.status)}`}>
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                  </span>
                  {selectedPost.flagged && (
                    <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200 flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      Flagged
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">{selectedPost.text}</p>
                </div>
              </div>

              {/* Post Image */}
              {selectedPost.postImage && (
                <div className="mb-6">
                  <img
                    src={selectedPost.postImage}
                    alt="Post"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
              )}

              {/* Engagement Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{selectedPost.likes}</p>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{selectedPost.comments}</p>
                  <p className="text-sm text-gray-600">Comments</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="w-6 h-6 text-purple-500" />
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{selectedPost.views}</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {((selectedPost.likes + selectedPost.comments) / selectedPost.views * 100).toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-indigo-400" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedPost.status !== 'approved' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedPost.postId);
                      setShowPostModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Post
                  </button>
                )}
                
                {selectedPost.status !== 'flagged' && (
                  <button
                    onClick={() => {
                      handleFlag(selectedPost.postId);
                      setShowPostModal(false);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Flag className="w-5 h-5" />
                    Flag Post
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selectedPost.postId)}
                  className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsManagement;