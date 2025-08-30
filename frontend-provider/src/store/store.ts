import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Define the store state interface
interface CompanyStore {
  company: CompanyData | null;
  isLoading: boolean;
  error: string | null;
  setCompany: (data: CompanyData) => void;
  clearCompany: () => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store with persistence
const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      company: null,
      isLoading: false,
      error: null,
      setCompany: (data) => set({ company: data, error: null }),
      clearCompany: () => set({ company: null }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'company-storage', // unique name for localStorage
      partialize: (state) => ({ company: state.company }), // only persist the company data
    }
  )
);

export default useCompanyStore;