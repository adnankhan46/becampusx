import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Users, AlertCircle, Clock, CheckCircle, Eye, Star, Download, Search, Filter, FileText, TrendingUp, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock Data
const mockSubmissions = [
  {
    id: "1",
    student: { name: "Rahul Sharma", email: "rahul.sharma@student.edu", admissionNo: "ADM2023001" },
    opportunity: { title: "Web Development Internship", amount: 15000 },
    status: "submitted",
    submittedDate: "2025-09-20",
    description: "Completed full-stack web application using React and Node.js. Implemented user authentication, database integration, and responsive design.",
    certificateUrl: null
  },
  {
    id: "2",
    student: { name: "Priya Patel", email: "priya.patel@student.edu", admissionNo: "ADM2023002" },
    opportunity: { title: "Data Analysis Project", amount: 12000 },
    status: "approved",
    submittedDate: "2025-09-15",
    description: "Analyzed sales data using Python and created visualizations. Presented insights to stakeholders.",
    feedback: { rating: "Excellent", attendance: "Excellent", skills: ["Python", "Data Visualization", "Communication"], remarks: "Outstanding work! Shows great analytical skills.", recommendation: true, feedbackDate: "2025-09-18" },
    certificateUrl: "https://example.com/certificate1"
  },
  {
    id: "3",
    student: { name: "Amit Kumar", email: "amit.kumar@student.edu", admissionNo: "ADM2023003" },
    opportunity: { title: "Mobile App Development", amount: 18000 },
    status: "submitted",
    submittedDate: "2025-09-22",
    description: "Built cross-platform mobile app using React Native. Features include push notifications and offline mode.",
    certificateUrl: null
  },
  {
    id: "4",
    student: { name: "Sneha Reddy", email: "sneha.reddy@student.edu", admissionNo: "ADM2023004" },
    opportunity: { title: "UI/UX Design Workshop", amount: 10000 },
    status: "feedback_given",
    submittedDate: "2025-09-10",
    description: "Created comprehensive design system and prototyped user flows for e-commerce platform.",
    feedback: { rating: "Very Good", attendance: "Good", skills: ["Figma", "User Research", "Wireframing"], remarks: "Great design work. Could improve on user testing methodologies.", recommendation: true, feedbackDate: "2025-09-12" }
  },
  {
    id: "5",
    student: { name: "Vikram Singh", email: "vikram.singh@student.edu", admissionNo: "ADM2023005" },
    opportunity: { title: "Cloud Computing Project", amount: 20000 },
    status: "approved",
    submittedDate: "2025-09-08",
    description: "Deployed scalable microservices architecture on AWS. Implemented CI/CD pipeline.",
    feedback: { rating: "Excellent", attendance: "Excellent", skills: ["AWS", "Docker", "Kubernetes"], remarks: "Exceptional technical skills and project execution.", recommendation: true, feedbackDate: "2025-09-11" },
    certificateUrl: "https://example.com/certificate2"
  },
  {
    id: "6",
    student: { name: "Anjali Verma", email: "anjali.verma@student.edu", admissionNo: "ADM2023006" },
    opportunity: { title: "Marketing Campaign", amount: 8000 },
    status: "rejected",
    submittedDate: "2025-09-05",
    description: "Developed social media marketing strategy and executed campaign.",
    feedback: { rating: "Fair", attendance: "Poor", skills: ["Social Media"], remarks: "Attendance was irregular. Content quality needs improvement.", recommendation: false, feedbackDate: "2025-09-07" }
  },
  {
    id: "7",
    student: { name: "Rohan Mehta", email: "rohan.mehta@student.edu", admissionNo: "ADM2023007" },
    opportunity: { title: "Machine Learning Research", amount: 25000 },
    status: "submitted",
    submittedDate: "2025-09-25",
    description: "Implemented neural network for image classification. Achieved 94% accuracy on test dataset.",
    certificateUrl: null
  },
  {
    id: "8",
    student: { name: "Deepika Iyer", email: "deepika.iyer@student.edu", admissionNo: "ADM2023008" },
    opportunity: { title: "Content Writing Internship", amount: 7000 },
    status: "approved",
    submittedDate: "2025-09-01",
    description: "Created technical blog posts and documentation. Published 12 articles over the internship period.",
    feedback: { rating: "Very Good", attendance: "Very Good", skills: ["Technical Writing", "SEO", "Research"], remarks: "Consistent quality work. Good grasp of technical concepts.", recommendation: true, feedbackDate: "2025-09-04" },
    certificateUrl: "https://example.com/certificate3"
  }
]

const stats = {
  totalStudents: 48,
  pendingFeedback: 8,
  completed: 32,
  inProgress: 8
}

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 'Good',
    skills: [],
    attendance: 'Good',
    remarks: '',
    recommendation: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Awaiting Review</Badge>
      case "feedback_given":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Feedback Given</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRatingStars = (rating) => {
    const ratings = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Very Good': 4, 'Excellent': 5 }
    const stars = ratings[rating] || 3
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleProvideFeedback = (submission) => {
    setSelectedSubmission(submission)
    setFeedbackForm({
      rating: 'Good',
      skills: [],
      attendance: 'Good',
      remarks: '',
      recommendation: true
    })
    setFeedbackDialogOpen(true)
  }

  const submitFeedback = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === selectedSubmission.id 
          ? { 
              ...sub, 
              status: 'feedback_given',
              feedback: {
                ...feedbackForm,
                feedbackDate: new Date().toISOString().split('T')[0]
              }
            }
          : sub
      )
      setSubmissions(updatedSubmissions)
      setIsSubmitting(false)
      setFeedbackDialogOpen(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'approved' && submission.status === 'approved') ||
                         (filterStatus === 'rejected' && submission.status === 'rejected') ||
                         (filterStatus === 'pending' && submission.status === 'submitted')
    
    return matchesSearch && matchesFilter
  })

  const feedbackHistory = submissions.filter(s => s.status === 'feedback_given' || s.status === 'approved' || s.status === 'rejected')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supervisor Portal</h1>
              <p className="text-sm text-gray-500">Welcome back, Dr. Kumar</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'students' ? 'default' : 'outline'}
                onClick={() => setActiveTab('students')}
              >
                Students
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'outline'}
                onClick={() => setActiveTab('history')}
              >
                History
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Feedback submitted successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                    <Users className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalStudents}</div>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> +12% from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending Feedback</CardTitle>
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.pendingFeedback}</div>
                    <p className="text-xs text-amber-600 mt-1">Requires attention</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                    <Clock className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.inProgress}</div>
                    <p className="text-xs text-gray-500 mt-1">Active submissions</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Award className="h-3 w-3" /> 67% success rate
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((sub, idx) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{sub.student.name}</div>
                        <div className="text-sm text-gray-500">{sub.opportunity.title}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">{formatDate(sub.submittedDate)}</div>
                        {getStatusBadge(sub.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assigned Students</span>
                <Badge variant="outline">{submissions.length} Total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Opportunity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <motion.tr
                        key={submission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-blue-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{submission.student.name}</div>
                            <div className="text-sm text-gray-500">{submission.student.email}</div>
                            <div className="text-xs text-gray-400">{submission.student.admissionNo}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{submission.opportunity.title}</div>
                            <div className="text-sm text-gray-500">₹{submission.opportunity.amount}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {formatDate(submission.submittedDate)}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(submission.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission)
                                setDetailDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {submission.status === 'submitted' && (
                              <Button
                                size="sm"
                                onClick={() => handleProvideFeedback(submission)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Provide Feedback
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Feedback History</span>
                  <Badge variant="outline">{feedbackHistory.length} Records</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by student name or opportunity..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === 'approved' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('approved')}
                    >
                      Approved
                    </Button>
                    <Button
                      variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('rejected')}
                    >
                      Rejected
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Opportunity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Attendance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackHistory.map((submission, index) => (
                        <motion.tr
                          key={submission.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-blue-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{submission.student.name}</div>
                              <div className="text-sm text-gray-500">{submission.student.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-sm">{submission.opportunity.title}</div>
                              <div className="text-xs text-gray-500">₹{submission.opportunity.amount}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {submission.feedback?.rating ? 
                              getRatingStars(submission.feedback.rating) : 
                              <span className="text-gray-400 text-sm">Not rated</span>
                            }
                          </td>
                          <td className="py-4 px-4">
                            {submission.feedback?.attendance ? (
                              <Badge variant="outline" className="text-xs">
                                {submission.feedback.attendance}
                              </Badge>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(submission.status)}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {submission.feedback?.feedbackDate ? 
                              formatDate(submission.feedback.feedbackDate) : 
                              formatDate(submission.submittedDate)
                            }
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {submissions.filter(s => s.status === 'approved').length}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">Approved</div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600">
                    {submissions.filter(s => s.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-700 mt-1">Rejected</div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {submissions.filter(s => s.feedback?.rating === 'Excellent').length}
                  </div>
                  <div className="text-sm text-green-700 mt-1">Excellent Ratings</div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {submissions.filter(s => s.certificateUrl).length}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">Certificates Issued</div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Student</Label>
                  <p className="text-lg font-semibold mt-1">{selectedSubmission.student.name}</p>
                  <p className="text-sm text-gray-500">{selectedSubmission.student.email}</p>
                  <p className="text-xs text-gray-400">{selectedSubmission.student.admissionNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Opportunity</Label>
                  <p className="text-lg font-semibold mt-1">{selectedSubmission.opportunity.title}</p>
                  <p className="text-sm text-gray-500">Amount: ₹{selectedSubmission.opportunity.amount}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Submission Date</Label>
                <p className="mt-1">{formatDate(selectedSubmission.submittedDate)}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="mt-2 text-sm bg-gray-50 p-4 rounded-lg border">
                  {selectedSubmission.description}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <div className="mt-2">
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>

              {selectedSubmission.feedback && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-4">Feedback Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Rating</Label>
                      <div className="mt-2">{getRatingStars(selectedSubmission.feedback.rating)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Attendance</Label>
                      <p className="mt-2">{selectedSubmission.feedback.attendance}</p>
                    </div>
                  </div>
                  {selectedSubmission.feedback.skills && selectedSubmission.feedback.skills.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-700">Skills</Label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {selectedSubmission.feedback.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                    <p className="mt-2 text-sm bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {selectedSubmission.feedback.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="font-medium">{selectedSubmission.student.name}</div>
                <div className="text-sm text-gray-600">{selectedSubmission.opportunity.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Overall Rating</Label>
                  <Select
                    value={feedbackForm.rating}
                    onValueChange={(value) => setFeedbackForm({...feedbackForm, rating: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor ⭐</SelectItem>
                      <SelectItem value="Fair">Fair ⭐⭐</SelectItem>
                      <SelectItem value="Good">Good ⭐⭐⭐</SelectItem>
                      <SelectItem value="Very Good">Very Good ⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="Excellent">Excellent ⭐⭐⭐⭐⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="attendance">Attendance</Label>
                  <Select
                    value={feedbackForm.attendance}
                    onValueChange={(value) => setFeedbackForm({...feedbackForm, attendance: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., JavaScript, React, Communication"
                  value={feedbackForm.skills?.join(', ') || ''}
                  onChange={(e) => setFeedbackForm({
                    ...feedbackForm,
                    skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                />
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Provide detailed feedback about the student's performance..."
                  value={feedbackForm.remarks}
                  onChange={(e) => setFeedbackForm({...feedbackForm, remarks: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="recommendation">Recommendation</Label>
                <Select
                  value={feedbackForm.recommendation ? 'true' : 'false'}
                  onValueChange={(value) => setFeedbackForm({...feedbackForm, recommendation: value === 'true'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">✅ Recommend (Generate Certificate)</SelectItem>
                    <SelectItem value="false">❌ Do Not Recommend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setFeedbackDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitFeedback}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}