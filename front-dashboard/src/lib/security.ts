import apiClient from './api';
import type { ChangePasswordRequest, Toggle2FARequest, SecuritySettings } from '@/types';

export const securityService = {
  async getSettings(): Promise<SecuritySettings> {
    const response = await apiClient.get<SecuritySettings>('/security/settings');
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.put('/security/change-password', data);
  },

  async toggle2FA(data: Toggle2FARequest): Promise<void> {
    await apiClient.put('/security/2fa', data);
  },
};