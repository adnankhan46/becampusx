import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, Search, Flag, Trash2, CheckCircle, Calendar, ThumbsUp, Reply, MoreVertical, AlertTriangle, Eye } from 'lucide-react';
import { Comment, CommentResponse } from '../src/api/api.client.ts';

function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get<CommentResponse>('http://localhost:3000/api/admin/getAllComments');
        setComments(res.data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const filteredComments = comments.filter(comment => 
    (comment.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.user?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || comment.status === filterStatus)
  );

  const handleDelete = async (commentId: string) => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`http://localhost:3000/api/admin/deleteComment/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      setSuccessMessage('Comment deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleApprove = async (commentId: string) => {
    try {
      // Uncomment when API is ready
      // await axios.put(`http://localhost:3000/api/admin/approveComment/${commentId}`);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, status: 'approved', flagged: false } : c
      ));
      setSuccessMessage('Comment approved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error approving comment:', err);
    }
  };

  const handleFlag = async (commentId: string) => {
    try {
      // Uncomment when API is ready
      // await axios.put(`http://localhost:3000/api/admin/flagComment/${commentId}`);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, status: 'flagged', flagged: true } : c
      ));
      setSuccessMessage('Comment flagged for review');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error flagging comment:', err);
    }
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'flagged': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }: any) => (
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

  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const flaggedCount = comments.filter(c => c.status === 'flagged').length;
  const pendingCount = comments.filter(c => c.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                Comments Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor and moderate user comments</p>
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
            icon={MessageSquare}
            label="Total Comments"
            value={comments.length}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={approvedCount}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={AlertTriangle}
            label="Flagged"
            value={flaggedCount}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={Eye}
            label="Pending Review"
            value={pendingCount}
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
                placeholder="Search comments, users, or posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[200px]"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No comments found</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={comment.userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user}`}
                      alt={comment.user}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{comment.user}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(comment.status)}`}>
                            {comment.status ? comment.status.charAt(0).toUpperCase() + comment.status.slice(1) : 'Unknown'}
                          </span>
                          {comment.flagged && (
                            <Flag className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === comment._id ? null : comment._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          {showActionMenu === comment._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                              {comment.status !== 'approved' && (
                                <button
                                  onClick={() => {
                                    handleApprove(comment._id);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-green-600"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                              )}
                              {comment.status !== 'flagged' && (
                                <button
                                  onClick={() => {
                                    handleFlag(comment._id);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-amber-600"
                                >
                                  <Flag className="w-4 h-4" />
                                  Flag
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleDelete(comment._id);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 leading-relaxed">{comment.text}</p>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-3 border border-purple-100">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Reply className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">On post:</span>
                          <span className="text-purple-700">{comment.post}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(comment.createdAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {comment.likes !== undefined && (
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              {comment.likes} likes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentManagement;