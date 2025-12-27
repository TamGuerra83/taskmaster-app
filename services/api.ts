import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, AuthResponse, Task, LocationData } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;


if (!API_URL) {
  console.warn("⚠️ NO SE HA DEFINIDO EXPO_PUBLIC_API_URL en el archivo .env");
}

const api = axios.create({ 
  baseURL: API_URL, 
  timeout: 15000 
});


api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


const handleError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    const errorData = error.response.data;
    console.log("⚠️ Backend Error:", JSON.stringify(errorData, null, 2));

    let errorMessage = "Error de servidor";

   
    if (typeof errorData?.error === 'object' && errorData.error.name === 'ZodError') {
       try {
         const issues = JSON.parse(errorData.error.message);
         if (Array.isArray(issues) && issues.length > 0) errorMessage = issues[0].message;
       } catch (e) { errorMessage = "Datos inválidos"; }
    } 
    else if (typeof errorData?.error === 'string') errorMessage = errorData.error;
    else if (errorData?.message) errorMessage = errorData.message;

    throw new Error(errorMessage);
  }

  throw error;
};


export const ApiService = {
  

  login: async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
      if (!response.data.success) throw new Error(response.data.error);
      return response.data.data;
    } catch (e) { handleError(e); throw e; }
  },

  register: async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', { email, password });
      if (!response.data.success) throw new Error(response.data.error);
      return response.data.data;
    } catch (e) { handleError(e); throw e; }
  },



  getAllTodos: async () => {
    try {
      const response = await api.get<ApiResponse<Task[]>>('/todos');
      return response.data.data || []; 
    } catch (e) { 
      console.error("Error fetching todos", e);
      return []; 
    }
  },

  createTodo: async (title: string, photoUri?: any, location?: LocationData) => {
    try {
     
      let finalPhotoUri = photoUri;
      if (typeof photoUri === 'object' && photoUri !== null) {
        finalPhotoUri = photoUri.url || photoUri.uri || photoUri.image || null;
      }
      if (typeof finalPhotoUri === 'string' && finalPhotoUri.trim() === '') finalPhotoUri = null;

      const response = await api.post<ApiResponse<Task>>('/todos', {
        title, 
        completed: false,
        photoUri: finalPhotoUri,
        location: location || null
      });

      if (!response.data.success) throw new Error(response.data.error);
      return response.data.data;
    } catch (e) { handleError(e); throw e; }
  },


  toggleTodo: async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.patch<ApiResponse<Task>>(`/todos/${id}`, { completed: !currentStatus });
      if (!response.data.success) throw new Error(response.data.error);
      return response.data.data;
    } catch (e) { handleError(e); throw e; }
  },


  updateTaskStatus: async (taskId: string, isCompleted: boolean) => {
    
    try {
        const response = await api.patch<ApiResponse<Task>>(`/todos/${taskId}`, { completed: isCompleted });
        if (!response.data.success) throw new Error(response.data.error);
        return true;
    } catch (e) { handleError(e); throw e; }
  },

  deleteTodo: async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      return true;
    } catch (e) { handleError(e); throw e; }
  },



  uploadImage: async (imageUri: string) => {
    try {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
    
      formData.append('image', { 
        uri: imageUri, 
        name: filename || 'upload.jpg', 
        type 
      } as any);

      const response = await api.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.data.success) throw new Error(response.data.error);
      return response.data.data; 
    } catch (e) { handleError(e); throw e; }
  }

}; 