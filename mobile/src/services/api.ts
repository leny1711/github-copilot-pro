import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
  }) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // User endpoints
  async updateProfile(data: any) {
    const response = await this.api.patch('/users/profile', data);
    return response.data;
  }

  async getNearbyProviders(latitude: number, longitude: number, radius?: number) {
    const response = await this.api.get('/users/nearby-providers', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  }

  // Mission endpoints
  async createMission(data: any) {
    const response = await this.api.post('/missions', data);
    return response.data;
  }

  async getMissions(filters?: any) {
    const response = await this.api.get('/missions', { params: filters });
    return response.data;
  }

  async getMissionById(id: string) {
    const response = await this.api.get(`/missions/${id}`);
    return response.data;
  }

  async acceptMission(id: string) {
    const response = await this.api.post(`/missions/${id}/accept`);
    return response.data;
  }

  async updateMissionStatus(id: string, status: string) {
    const response = await this.api.patch(`/missions/${id}/status`, { status });
    return response.data;
  }

  async getUserMissions(role?: string) {
    const response = await this.api.get('/missions/user', { params: { role } });
    return response.data;
  }

  // Payment endpoints
  async createPaymentIntent(missionId: string) {
    const response = await this.api.post('/payments/create-intent', { missionId });
    return response.data;
  }

  async confirmPayment(paymentIntentId: string) {
    const response = await this.api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  }

  async getPaymentHistory() {
    const response = await this.api.get('/payments/history');
    return response.data;
  }

  // Admin endpoints
  async getDashboardStats() {
    const response = await this.api.get('/admin/stats');
    return response.data;
  }

  async getAllUsers(params?: any) {
    const response = await this.api.get('/admin/users', { params });
    return response.data;
  }

  async getAllMissions(params?: any) {
    const response = await this.api.get('/admin/missions', { params });
    return response.data;
  }

  async getAllPayments(params?: any) {
    const response = await this.api.get('/admin/payments', { params });
    return response.data;
  }
}

export default new ApiService();
