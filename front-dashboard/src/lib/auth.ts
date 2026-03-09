import apiClient from './api';
import type { LoginRequest, LoginResponse, VerifyOtpRequest, VerifyOtpResponse } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', data);
    return response.data;
  },

  async logout() {
    // Por ahora solo limpiamos el estado local
    // En el futuro podrías llamar a un endpoint de logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};