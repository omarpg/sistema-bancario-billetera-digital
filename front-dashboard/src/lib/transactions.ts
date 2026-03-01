import apiClient from './api';
import type { Transaction } from '@/types';

export const transactionsService = {
  async getAll(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return response.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },
};