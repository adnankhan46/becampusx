export interface Post {
    text: string;
    user: string;
    postId : string;
    postImage: string | null;
    createdAt: string;
    updatedAt: string;
    profilePicture: string;
    gender: string;
    section: string;
    year: string;
    isAuthenticated: boolean;
}
 export interface PostResponse {
  posts: Post[];
}
export interface User {
  _id: string;
  admissionNumber: string;
  username: string;
  email: string;
  password: string;
  section: string;
  gender: string;
  year: string;
  profilePicture: string;
  isAdmin: boolean;
  isFreeze: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  token: string | null;
  createdAt: string;  
  updatedAt: string;  
  __v: number;
}
 export interface UserResponse {
  users: User[];
}

 

export interface PostsByUserResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SinglePostResponse {
  post: Post;
}
export interface Comment {
  _id: string;
  text: string;
  user: string;  
  post: string;  
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CommentResponse {
  comments: Comment[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  deadline: string; 
  type: 'engagement' | 'survey' | 'academic' | 'development' | 'marketing' | 'design' | 'research' | 'other';
  status: 'open' | 'closed' | 'filled' | 'expired';
  creator: 'Company' | 'User';

  proofOfWork: {
    screenshot: string | null;
    link: string | null;
  };

  createdBy: {
    id: string;
    name: string;
  };

  applicants: {
    userId: string;
    status: 'applied' | 'shortlisted' | 'selected' | 'rejected';
    appliedAt: string;
    _id?: string;
  }[];

  selectedCandidates: {
    userId: string;
  }[];

  paymentStatus: {
    firstPayment: boolean | { status: boolean; date: string | null };  
    secondPayment: {
      status: boolean;
      date: string | null;
    };
  };

  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OpportunitiesResponse {
  opportunities: Opportunity[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface Company {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string; // hashed password, usually not needed on frontend
  url: string | null;
  profilePicture: string;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  token: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface CompaniesResponse {
  companies: Company[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

 interface ProofOfWork {
  screenshot: string | null;
  link: string | null;
}

interface PaymentInfo {
  status: boolean;
  date: string | null;
}

interface PaymentStatus {
  firstPayment: PaymentInfo;
  secondPayment: PaymentInfo;
}

export interface Applicant {
  _id: string;
  userId: string;
  opportunityId: string;
  coverLetter: string;
  status: "applied" | "rejected" | "selected" | string;
  completionStatus: "pending" | "completed" | string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  proofOfWork: ProofOfWork;
  paymentStatus: PaymentStatus;
}

export interface ApplicantsResponse {
  applicants: Applicant[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}
