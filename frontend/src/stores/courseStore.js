import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useCourseStore = create((set, get) => ({
  courses: [],
  chapters: [],
  isLoading: false,

  fetchCourses: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/course/');
      if (response.data.success) {
        set({ courses: response.data.courses });
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      toast.error('Failed to fetch courses');
    } finally {
      set({ isLoading: false });
    }
  },

  createCourse: async (courseName) => {
    try {
      set({ isLoading: true });
     
      
      const response = await axiosInstance.post(`/course/`, { courseName });
      
      if (response.data.success) {
        const updatedCourses = [...get().courses, response.data.course];
        set({ courses: updatedCourses });
        toast.success('Course created successfully!');
        return { success: true, course: response.data.course };
      }
    } catch (error) {
      console.error('Create course error:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChapters: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/chapter/');
      if (response.data.success) {
        set({ chapters: response.data.chapters });
      }
    } catch (error) {
      console.error('Fetch chapters error:', error);
      toast.error('Failed to fetch chapters');
    } finally {
      set({ isLoading: false });
    }
  },

  createChapter: async (chapterData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/chapter/', chapterData);
      
      if (response.data.success) {
        const updatedChapters = [...get().chapters, response.data.chapter];
        set({ chapters: updatedChapters });
        toast.success('Chapter created successfully!');
        return { success: true, chapter: response.data.chapter };
      }
    } catch (error) {
      console.error('Create chapter error:', error);
      toast.error(error.response?.data?.message || 'Failed to create chapter');
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  uploadVTTFiles: async (files, chapterId, courseId) => {
    try {
      set({ isLoading: true });
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await axiosInstance.post(
        `/upload/video/${chapterId}/${courseId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('VTT files uploaded successfully!');
        return { success: true };
      }
    } catch (error) {
      console.error('Upload VTT files error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload VTT files');
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
}));