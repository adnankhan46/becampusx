 
 

export interface Stats {
  totalStudents: number
  pendingFeedback: number
  completed: number
  inProgress: number
}
 

export interface Student {
  id: number
  name: string
  rollNo: string
  department: string
  internshipTitle: string
  duration: string
  status: 'in_progress' | 'pending_feedback' | 'completed'
  startDate: string
  endDate: string
}

export interface FeedbackHistory {
  id: number
  studentName: string
  internshipTitle: string
  rating: string
  recommendation: string
  dateSubmitted: string
  certificateId: string
}

 
export interface ApiSubmission {
  _id: string
  studentId: {
    _id: string
    username: string
    email: string
    admissionNumber?: string
  }
  opportunityId: {
    _id: string
    title: string
    description: string
    amount: number
    deadline?: string
  }
  supervisorId: string
  submission: {
    description: string
    pptUrl?: string | null
    reportUrl?: string | null
    additionalFiles: Array<{
      fileName: string
      fileUrl: string
      uploadedAt: string
    }>
  }
  feedback: {
    rating?: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' | null
    skills?: string[]
    attendance?: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' | null
    remarks?: string | null
    recommendation?: boolean | null
    feedbackGivenAt?: string | null
  }
  status: 'pending' | 'submitted' | 'feedback_given' | 'approved' | 'rejected'
  certificateGenerated: boolean
  certificateUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiSupervisorProfile {
  _id: string
  userId: string
  name: string
  email: string
  department?: string
  expertise: string[]
  isActive: boolean
  assignedStudents: Array<{
    studentId: {
      _id: string
      username: string
      email: string
    }
    opportunityId: {
      _id: string
      title: string
      description: string
    }
    assignedAt: string
    status: 'assigned' | 'submitted' | 'feedback_given' | 'completed'
  }>
  createdAt: string
  updatedAt: string
}