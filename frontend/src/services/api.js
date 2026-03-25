import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401 for NON-auth endpoints (don't interfere with login page)
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
