import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isLoading: false,
  isLoggedout : true ,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get('/auth/me');
      set({ authUser: response.data.user });
      set({isLoggedout : false})
    } catch (error) {
      console.error('Check auth error:', error);
      set({ authUser: null });
      localStorage.removeItem('authToken');
      set({isLoggedout : true})
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data.success) {
        set({isLoggedout : false})
        localStorage.setItem('authToken', response.data.token);
        set({ authUser: response.data.user });
        toast.success('Login successful!');
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      set({isLoggedout : true})
      return { success: false, error: error.response?.data?.message };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/auth/register', userData);
      
      if (response.data.success) {
        set({isLoggedout : false})
        localStorage.setItem('authToken', response.data.token);
        set({ authUser: response.data.user });
        toast.success('Registration successful!');
        
        return { success: true };
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      set({isLoggedout : true})
      return { success: false, error: error.response?.data?.message };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get('/auth/logout');
      localStorage.removeItem('authToken');
      set({ authUser: null });
      set({isLoggedout : true})
      toast.success('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      set({isLoggedout : false})
      localStorage.removeItem('authToken');
      set({ authUser: null });
    }
  },
}));