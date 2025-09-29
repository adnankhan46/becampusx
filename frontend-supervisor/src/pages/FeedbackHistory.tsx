import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Download, Search, Filter } from "lucide-react"
import supervisorService, { Submission } from "@/api/api.supervisor"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function FeedbackHistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchFeedbackHistory()
  }, [page])

  const fetchFeedbackHistory = async () => {
    try {
      setLoading(true)
      // Get all submissions and filter for those with feedback
      const response = await supervisorService.getAssignedStudents(page, 20)
      const submissionsWithFeedback = response.submissions.filter(
        s => s.status === 'feedback_given' || s.status === 'approved' || s.status === 'rejected'
      )
      setSubmissions(submissionsWithFeedback)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to fetch feedback history:', error)
      toast.error('Failed to load feedback history')
    } finally {
      setLoading(false)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.opportunityId.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'approved' && submission.status === 'approved') ||
                         (filterStatus === 'rejected' && submission.status === 'rejected') ||
                         (filterStatus === 'pending' && submission.status === 'feedback_given')
    
    return matchesSearch && matchesFilter
  })

  const getRatingStars = (rating: string) => {
    const ratings = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Very Good': 4, 'Excellent': 5 }
    const stars = ratings[rating as keyof typeof ratings] || 3
    
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

  const getRecommendationBadge = (recommendation: boolean | null, status: string) => {
    if (status === 'approved') {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>
    } else if (status === 'rejected') {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>
    } else if (recommendation === true) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Recommended</Badge>
    } else if (recommendation === false) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Not Recommended</Badge>
    }
    return <Badge variant="outline">Pending</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDownloadCertificate = (submission: Submission) => {
    if (submission.certificateUrl) {
      window.open(submission.certificateUrl, '_blank')
    } else {
      toast.info('Certificate not available')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Feedback History</span>
            <Badge variant="outline">{filteredSubmissions.length} Records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
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

          {/* Feedback History Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Opportunity</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Attendance</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{submission.studentId.username}</div>
                        <div className="text-sm text-gray-500">{submission.studentId.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-sm">{submission.opportunityId.title}</div>
                        <div className="text-xs text-gray-500">₹{submission.opportunityId.amount}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {submission.feedback.rating ? 
                        getRatingStars(submission.feedback.rating) : 
                        <span className="text-gray-400 text-sm">Not rated</span>
                      }
                    </td>
                    <td className="py-4 px-4">
                      {submission.feedback.attendance ? (
                        <Badge variant="outline" className="text-xs">
                          {submission.feedback.attendance}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getRecommendationBadge(submission.feedback.recommendation, submission.status)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {submission.feedback.feedbackGivenAt ? 
                        formatDate(submission.feedback.feedbackGivenAt) : 
                        formatDate(submission.updatedAt)
                      }
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        {submission.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCertificate(submission)}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="mb-4">
                  <Filter className="h-12 w-12 text-gray-300 mx-auto" />
                </div>
                <p className="text-lg font-medium mb-2">No feedback records found</p>
                <p className="text-sm">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'You haven\'t provided any feedback yet'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {submissions.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-sm text-blue-700">Approved</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {submissions.filter(s => s.status === 'rejected').length}
              </div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.feedback.rating === 'Excellent').length}
              </div>
              <div className="text-sm text-green-700">Excellent Ratings</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {submissions.filter(s => s.certificateGenerated).length}
              </div>
              <div className="text-sm text-purple-700">Certificates Issued</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}