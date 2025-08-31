import { apiClient } from "./api.config";

// TYPES
interface RequestLogin {
    username: string,
    password: string,
}

// Define the company data interface
export interface CompanyData {
  _id: string;
  username: string;
  name: string;
  email: string;
  url: string;
  profilePicture: string;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  token: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const authService = {
  Login: async (
    params: RequestLogin
  ): Promise<CompanyData> => {
    try {
    const response = await apiClient.post<CompanyData>('/api/company/signin', params);
    return response.data;
    } catch (error: unknown) {
    throw error || error;
    }
  },
}

export default authService;