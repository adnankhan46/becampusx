import { apiClient } from "./api.config";

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
    type: string;
    status: string;
    creator: string;
    createdBy: {
      id: string;
      name: string;
    };
    applicants: string[];
    selectedCandidates: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    paymentStatus: {
        firstPayment: {
          status: boolean,
          date: null
        },
        secondPayment: {
          status: boolean,
          date: null
        };
  }}
  
export interface OpportunityResponse {
    opportunities: Opportunity[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }

export interface CreateOppRequest {
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  type: 'engagement' | 'survey' | 'academic' | 'development' | 'marketing' | 'design' | 'research' | 'other' | string;
  status: 'open'| string;
  creator: 'Company';
  createdBy: {
    id: string;
    name: string;
  };
  deadline: string; // ISO string format, e.g. "2025-07-30T23:59:59.999Z"
}

export interface CreateOppResponse {
  _id: string;
  title: string;
  description: string;
  numberOfOpenings: number;
  isPaid: boolean;
  amount: number;
  deadline: string; // ISO 8601 string format

  proofOfWork: {
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
  applicants: string[]; // Can be typed as array of user IDs or user objects
  selectedCandidates: string[]; // Same as above

  createdAt: string; // ISO string (e.g., "2025-07-21T10:23:21.996Z")
  updatedAt: string;
  __v: number;
}


const OpportunityService = {
  /**
   * API 1 : To get Opportunities listed by a Company
   * @param companyId 
   * @returns interface[OpportunityResponse]
   */
  GetCompanyOpportunities: async (
    companyId : string
  ): Promise<OpportunityResponse> => {
    try {
    const response = await apiClient.get(`/api/company/myopportunities/${companyId}`);
    // console.log("=====API response ||||| ",response.data)
    return response.data as OpportunityResponse;
    } catch (error: unknown) {
    throw error || error;
    }
  },
  /**
   * API 2 : To create a nw Opportunities
   * @param companyId 
   * @returns interface[OpportunityResponse]
   */
  CreateOpportunity: async (
    params: CreateOppRequest
  ): Promise<CreateOppResponse> => {
    try {
      const response = await apiClient.post(`/api/company/create`, params);
        return response.data as CreateOppResponse;
    } catch (error: unknown) {
      throw error || error;
    }
  },
}

export default OpportunityService;