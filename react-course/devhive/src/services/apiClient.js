import axios from 'axios';
import { sessionStore } from '../state/storage/sessionStore';

const BASE_URL = 'https://api.devhive.com'; // Replace with your API URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStore.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStore.remove('authToken');
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
); 