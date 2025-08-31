export interface Company {
  _id: string;
  username: string;
  name: string;
  email: string;
  url: string | null;
  profilePicture: string;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  token: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  deadline: string;
  proofOfWork: {
    screenshot: string | null;
    link: string | null;
  };
  type: 'engagement' | 'survey' | 'academic' | 'development' | 'marketing' | 'design' | 'research' | 'other';
  status: 'open' | 'closed' | 'filled' | 'expired';
  creator: 'company' | 'user';
  createdBy: {
    id: string;
    name: string;
  };
  applicants: Array<{
    userId: string;
    status: 'applied' | 'shortlisted' | 'selected' | 'rejected';
    appliedAt: string;
  }>;
  paymentStatus: {
    firstPayment: {
      status: boolean;
      date: string | null;
    };
    secondPayment: {
      status: boolean;
      date: string | null;
    };
  };
  selectedCandidates: Array<{
    userId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

 
export interface Applicant {
  _id: string;
  userId: string;
  opportunityId: string;
  coverLetter: string;
  proofOfWork: {
    screenshot: string | null;
    link: string | null;
  };
  status: 'applied' | 'shortlisted' | 'selected' | 'rejected';
  paymentStatus: {
    firstPayment: {
      status: boolean;
      date: string | null;
    };
    secondPayment: {
      status: boolean;
      date: string | null;
    };
  };
  completionStatus: 'pending' | 'completed' | 'failed';
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

 
