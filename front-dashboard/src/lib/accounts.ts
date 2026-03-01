import apiClient from './api';
import type { Account } from '@/types';

export const accountsService = {
  async getAll(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  },

  async getById(id: string): Promise<Account> {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },
};