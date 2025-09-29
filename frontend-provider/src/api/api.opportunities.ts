import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces
export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface CreateOppRequest {
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  type: string;
  status: string;
  creator: string;
  createdBy: {
    id: string;
    name: string;
  };
  deadline: string;
  skills?: Skill[];
}

export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  deadline: string;
  skills?: Skill[];
  proofOfWork?: {
    screenshot: string | null;
    link: string | null;
  };
  type: string;
  status: string;
  creator: string;
  createdBy: {
    id: string;
    name: string;
  };
  applicants?: any[];
  selectedCandidates?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface OpportunitiesResponse {
  opportunities: Opportunity[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalCount?: number;
}

// Helper function to get token
const getAuthToken = (): string | null => {
  try {
    // Method 1: Direct from Zustand persist storage
    const companyStorage = localStorage.getItem('company-storage');
    
    if (companyStorage) {
      const parsed = JSON.parse(companyStorage);
      console.log('Full localStorage structure:', parsed);
      
      // Zustand persist stores in: { state: { company: { ...data } }, version: 0 }
      const token = parsed.state?.company?.token;
      
      if (token) {
        console.log('✓ Token found from company-storage');
        return token;
      } else {
        console.error('✗ Token not found in expected location');
        console.log('Expected path: parsed.state.company.token');
        console.log('Company data:', parsed.state?.company);
      }
    } else {
      console.error('✗ company-storage not found in localStorage');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Axios instance with auth token
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.warn('No token available for request');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ 401 Unauthorized Error');
      console.error('   Request URL:', error.config?.url);
      console.error('   Headers sent:', error.config?.headers);
      
      // Check if token exists in storage
      const storage = localStorage.getItem('company-storage');
      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          const hasToken = !!parsed.state?.company?.token;
          console.error('   Token in storage:', hasToken);
          if (hasToken) {
            console.error('   ⚠️ Token exists but request failed - token may be expired or invalid');
          }
        } catch (e) {
          console.error('   Error checking storage:', e);
        }
      }
    }
    return Promise.reject(error);
  }
);

const OpportunityService = {
  // Create a new opportunity
  CreateOpportunity: async (data: CreateOppRequest): Promise<Opportunity> => {
    console.log('Creating opportunity with data:', data);
    const response = await apiClient.post('/company/create', data);
    return response.data;
  },

  // Get all opportunities (public - from separate route if you have one)
  GetAllOpportunities: async (params?: {
    page?: number;
    limit?: number;
    skills?: string[];
  }): Promise<OpportunitiesResponse> => {
    const response = await apiClient.get('/opportunities/all', { params });
    return response.data;
  },

  // Get opportunities by company ID
  GetCompanyOpportunities: async (companyId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<OpportunitiesResponse> => {
    console.log('🔍 GetCompanyOpportunities called');
    console.log('   Company ID:', companyId);
    console.log('   Params:', params);
    
    // Debug: Check token before request
    const token = getAuthToken();
    console.log('   Token available:', !!token);
    if (token) {
      console.log('   Token preview:', token.substring(0, 30) + '...');
    } else {
      console.error('   ❌ NO TOKEN - Request will fail with 401');
      
      // Check storage directly
      const storage = localStorage.getItem('company-storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        console.log('   Storage structure:', {
          hasState: !!parsed.state,
          hasCompany: !!parsed.state?.company,
          hasToken: !!parsed.state?.company?.token
        });
      }
    }
    
    const response = await apiClient.get(`/company/myopportunities/${companyId}`, { params });
    console.log('   ✅ Response received:', response.data);
    return response.data;
  },

  // Get opportunity by ID
  GetOpportunityById: async (id: string): Promise<Opportunity> => {
    const response = await apiClient.get(`/company/${id}`);
    return response.data;
  },

  // Update opportunity
  UpdateOpportunity: async (id: string, data: Partial<CreateOppRequest>): Promise<Opportunity> => {
    const response = await apiClient.put(`/company/${id}`, data);
    return response.data;
  },

  // Delete opportunity
  DeleteOpportunity: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/company/${id}`);
    return response.data;
  },

  // Close opportunity
  CloseOpportunity: async (id: string): Promise<{ message: string; opportunity: Opportunity }> => {
    const response = await apiClient.put(`/company/${id}/close`);
    return response.data;
  },

  // Get applicants for an opportunity
  GetApplicants: async (opportunityId: string): Promise<any> => {
    const response = await apiClient.get(`/company/applicants/${opportunityId}`);
    return response.data;
  },

  // Update applicant status
  UpdateApplicantStatus: async (
    opportunityId: string,
    userId: string,
    data: { status: string; additionalData?: any }
  ): Promise<any> => {
    const response = await apiClient.put(
      `/company/applicants/status/${opportunityId}/${userId}`,
      data
    );
    return response.data;
  },

  // Mark opportunity as completed
  MarkOpportunityCompleted: async (
    opportunityId: string,
    userId: string,
    data?: any
  ): Promise<any> => {
    const response = await apiClient.put(
      `/company/applicants/complete/${opportunityId}/${userId}`,
      data
    );
    return response.data;
  },

  // Get payment info for opportunity
  GetPaymentInfo: async (opportunityId: string): Promise<any> => {
    const response = await apiClient.get(`/company/payments/opportunity/${opportunityId}`);
    return response.data;
  },
};

export default OpportunityService;