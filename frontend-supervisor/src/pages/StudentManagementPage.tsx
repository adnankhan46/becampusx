import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Eye, FileText, ExternalLink, Download } from "lucide-react"
import supervisorService, { Submission, FeedbackRequest } from "@/api/api.supervisor"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function StudentManagementPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackRequest>({
    rating: 'Good',
    skills: [],
    attendance: 'Good',
    remarks: '',
    recommendation: true
  })

  useEffect(() => {
    fetchSubmissions()
  }, [page])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await supervisorService.getAssignedStudents(page, 10)
      setSubmissions(response.submissions)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      toast.error('Failed to load student submissions')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Pending</Badge>
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

  const handleViewDetails = async (submissionId: string) => {
    try {
      const submission = await supervisorService.getSubmissionDetails(submissionId)
      setSelectedSubmission(submission)
      setDetailDialogOpen(true)
    } catch (error) {
      console.error('Failed to fetch submission details:', error)
      toast.error('Failed to load submission details')
    }
  }

  const handleProvideFeedback = (submission: Submission) => {
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

  const submitFeedback = async () => {
    if (!selectedSubmission) return

    try {
      await supervisorService.provideFeedback(selectedSubmission._id, feedbackForm)
      toast.success('Feedback provided successfully')
      setFeedbackDialogOpen(false)
      setSelectedSubmission(null)
      fetchSubmissions()
    } catch (error) {
      console.error('Failed to provide feedback:', error)
      toast.error('Failed to provide feedback')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assigned Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
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
            <span>Assigned Students</span>
            <Badge variant="outline">{submissions.length} Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Opportunity</th>
                  <th className="text-left py-3 px-4">Submitted</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{submission.studentId.username}</div>
                        <div className="text-sm text-gray-500">{submission.studentId.email}</div>
                        {submission.studentId.admissionNumber && (
                          <div className="text-xs text-gray-400">{submission.studentId.admissionNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{submission.opportunityId.title}</div>
                        <div className="text-sm text-gray-500">₹{submission.opportunityId.amount}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {formatDate(submission.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(submission._id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {submission.status === 'submitted' && (
                          <Button
                            size="sm"
                            onClick={() => handleProvideFeedback(submission)}
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
            {submissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No student submissions found.
              </div>
            )}
          </div>

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
        </CardContent>
      </Card>

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
                  <Label className="text-sm font-medium">Student</Label>
                  <p>{selectedSubmission.studentId.username}</p>
                  <p className="text-sm text-gray-500">{selectedSubmission.studentId.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Opportunity</Label>
                  <p>{selectedSubmission.opportunityId.title}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="mt-1 text-sm bg-gray-50 p-3 rounded">
                  {selectedSubmission.submission.description}
                </p>
              </div>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Overall Rating</Label>
                <Select
                  value={feedbackForm.rating}
                  onValueChange={(value: any) => setFeedbackForm({...feedbackForm, rating: value})}
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

              <div>
                <Label htmlFor="attendance">Attendance</Label>
                <Select
                  value={feedbackForm.attendance}
                  onValueChange={(value: any) => setFeedbackForm({...feedbackForm, attendance: value})}
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
                placeholder="Provide detailed feedback..."
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
                  <SelectItem value="true">Recommend (Generate Certificate)</SelectItem>
                  <SelectItem value="false">Do Not Recommend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitFeedback}>
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}