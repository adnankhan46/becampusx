import { apiClient } from "./api.config";

// TYPES
export interface Submission {
  _id: string;
  studentId: {
    _id: string;
    username: string;
    email: string;
    admissionNumber?: string;
  };
  opportunityId: {
    _id: string;
    title: string;
    description: string;
    amount: number;
    deadline?: string;
  };
  supervisorId: string;
  submission: {
    description: string;
    pptUrl?: string | null;
    reportUrl?: string | null;
    additionalFiles: Array<{
      fileName: string;
      fileUrl: string;
      uploadedAt: string;
    }>;
  };
  feedback: {
    rating?: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' | null;
    skills?: string[];
    attendance?: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' | null;
    remarks?: string | null;
    recommendation?: boolean | null;
    feedbackGivenAt?: string | null;
  };
  status: 'pending' | 'submitted' | 'feedback_given' | 'approved' | 'rejected';
  certificateGenerated: boolean;
  certificateUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupervisorProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  department?: string;
  expertise: string[];
  isActive: boolean;
  assignedStudents: Array<{
    studentId: {
      _id: string;
      username: string;
      email: string;
    };
    opportunityId: {
      _id: string;
      title: string;
      description: string;
    };
    assignedAt: string;
    status: 'assigned' | 'submitted' | 'feedback_given' | 'completed';
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionsResponse {
  submissions: Submission[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalCount: number;
}

export interface FeedbackRequest {
  rating: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  skills?: string[];
  attendance: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  remarks: string;
  recommendation: boolean;
}

export interface UpdateProfileRequest {
  department?: string;
  expertise?: string[];
}

const supervisorService = {
  // Get supervisor profile
  getSupervisorProfile: async (): Promise<SupervisorProfile> => {
    try {
      const response = await apiClient.get('/api/supervisor/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update supervisor profile
  updateSupervisorProfile: async (
    params: UpdateProfileRequest
  ): Promise<{ message: string; supervisor: SupervisorProfile }> => {
    try {
      const response = await apiClient.put('/api/supervisor/profile', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get assigned students with submissions
  getAssignedStudents: async (
    page: number = 1,
    limit: number = 10
  ): Promise<SubmissionsResponse> => {
    try {
      const response = await apiClient.get(`/api/supervisor/assigned-students?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get specific submission details
  getSubmissionDetails: async (submissionId: string): Promise<Submission> => {
    try {
      const response = await apiClient.get(`/api/supervisor/submission/${submissionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Provide feedback to student submission
  provideFeedback: async (
    submissionId: string,
    feedback: FeedbackRequest
  ): Promise<{ message: string; submission: Submission }> => {
    try {
      const response = await apiClient.put(`/api/supervisor/feedback/${submissionId}`, feedback);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Student submission APIs (for students using the same frontend)
  submitWork: async (
    opportunityId: string,
    submissionData: {
      description: string;
      pptUrl?: string;
      reportUrl?: string;
      additionalFiles?: Array<{
        fileName: string;
        fileUrl: string;
      }>;
    }
  ): Promise<{ message: string; submission: Submission }> => {
    try {
      const response = await apiClient.post(`/api/supervisor/submit/${opportunityId}`, submissionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get student's own submissions
  getMySubmissions: async (
    page: number = 1,
    limit: number = 10
  ): Promise<SubmissionsResponse> => {
    try {
      const response = await apiClient.get(`/api/supervisor/my-submissions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get submission status for a specific opportunity
  getSubmissionStatus: async (opportunityId: string): Promise<Submission> => {
    try {
      const response = await apiClient.get(`/api/supervisor/submission-status/${opportunityId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update submission
  updateSubmission: async (
    opportunityId: string,
    submissionData: {
      description?: string;
      pptUrl?: string;
      reportUrl?: string;
      additionalFiles?: Array<{
        fileName: string;
        fileUrl: string;
      }>;
    }
  ): Promise<{ message: string; submission: Submission }> => {
    try {
      const response = await apiClient.put(`/api/supervisor/update-submission/${opportunityId}`, submissionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default supervisorService;