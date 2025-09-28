// api/api.opportunities.ts

// Skill interface
export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

// Creator interface
export interface Creator {
  id: string;
  name: string;
}

// Applicant interface
export interface Applicant {
  userId: string;
  status: 'applied' | 'shortlisted' | 'selected' | 'rejected';
  appliedAt: string;
}

// Payment Status interface
export interface PaymentStatus {
  firstPayment: {
    status: boolean;
    date: string | null;
  };
  secondPayment: {
    status: boolean;
    date: string | null;
  };
}

// Selected Candidate interface
export interface SelectedCandidate {
  userId: string;
}

// Proof of Work interface
export interface ProofOfWork {
  screenshot: string | null;
  link: string | null;
}

// Main Opportunity interface
export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  deadline: string;
  skills: Skill[]; // NEW: Skills array
  proofOfWork: ProofOfWork;
  type: 'engagement' | 'survey' | 'academic' | 'development' | 'marketing' | 'design' | 'research' | 'other';
  status: 'open' | 'closed' | 'filled' | 'expired';
  creator: 'Company' | 'User';
  createdBy: Creator;
  applicants: Applicant[];
  paymentStatus: PaymentStatus;
  selectedCandidates: SelectedCandidate[];
  createdAt: string;
  updatedAt: string;
  isExpired?: boolean; // Virtual field
}

// Request interfaces
export interface CreateOppRequest {
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  deadline: string;
  skills?: Skill[]; // NEW: Optional skills array
  proofOfWork?: ProofOfWork;
  type: string;
  status: string;
  creator: string;
  createdBy: Creator;
}

export interface UpdateOppRequest {
  title?: string;
  description?: string;
  numberOfOpenings?: number;
  isPaid?: boolean;
  amount?: number;
  deadline?: string;
  skills?: Skill[]; // NEW: Optional skills array for updates
  proofOfWork?: ProofOfWork;
  type?: string;
  status?: string;
}

// Response interfaces
export interface OpportunitiesResponse {
  opportunities: Opportunity[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalCount?: number;
}

export interface OpportunityResponse {
  opportunity: Opportunity;
}

// Filter interface
export interface OpportunityFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  isPaid?: boolean;
  creator?: string;
  skills?: string[]; // NEW: Filter by skills
  sort?: string;
}

// API Service Class
class OpportunityService {
  private static baseURL = '/api/company'; // Adjust based on your API base URL
  
  // Get authorization headers
  private static getAuthHeaders() {
    const token = localStorage.getItem('token'); // Adjust based on how you store tokens
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Create opportunity
  static async CreateOpportunity(data: CreateOppRequest): Promise<Opportunity> {
    const response = await fetch(`${this.baseURL}/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create opportunity');
    }

    return await response.json();
  }

  // Get all opportunities
  static async GetAllOpportunities(filters?: OpportunityFilters): Promise<OpportunitiesResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.isPaid !== undefined) queryParams.append('isPaid', filters.isPaid.toString());
    if (filters?.creator) queryParams.append('creator', filters.creator);
    if (filters?.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => queryParams.append('skills', skill));
    }
    if (filters?.sort) queryParams.append('sort', filters.sort);

    const response = await fetch(`/api/applicants/getAllOpp?${queryParams}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch opportunities');
    }

    return await response.json();
  }

  // Get opportunity by ID
  static async GetOpportunityById(id: string): Promise<Opportunity> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch opportunity');
    }

    return await response.json();
  }

  // Get opportunities by company ID
  static async GetOpportunitiesByCompanyId(
    companyId: string, 
    filters?: OpportunityFilters
  ): Promise<OpportunitiesResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.sort) queryParams.append('sort', filters.sort);

    const response = await fetch(`${this.baseURL}/myopportunities/${companyId}?${queryParams}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch company opportunities');
    }

    return await response.json();
  }

  // Update opportunity
  static async UpdateOpportunity(id: string, data: UpdateOppRequest): Promise<Opportunity> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update opportunity');
    }

    return await response.json();
  }

  // Delete opportunity
  static async DeleteOpportunity(id: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete opportunity');
    }

    return await response.json();
  }

  // Close opportunity
  static async CloseOpportunity(id: string): Promise<{ message: string; opportunity: Opportunity }> {
    const response = await fetch(`${this.baseURL}/${id}/close`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to close opportunity');
    }

    return await response.json();
  }

  // Get unique skills across all opportunities (utility method)
  static async GetAllSkills(): Promise<string[]> {
    try {
      const response = await this.GetAllOpportunities({ limit: 1000 }); // Get a large number of opportunities
      const allSkills = new Set<string>();
      
      response.opportunities.forEach(opp => {
        opp.skills?.forEach(skill => {
          allSkills.add(skill.name);
        });
      });
      
      return Array.from(allSkills).sort();
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      return [];
    }
  }
}

export default OpportunityService;
export type { CreateOppRequest, UpdateOppRequest, Opportunity, OpportunityFilters };