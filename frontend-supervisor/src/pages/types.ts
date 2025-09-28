// types.ts

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

export interface Stats {
  totalStudents: number
  pendingFeedback: number
  completed: number
  inProgress: number
}
