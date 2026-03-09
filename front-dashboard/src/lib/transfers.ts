import apiClient from './api';
import type { TransferInitRequest, TransferInitResponse, TransferConfirmRequest, TransferConfirmResponse } from '@/types';

export const transfersService = {
  async initiate(data: TransferInitRequest): Promise<TransferInitResponse> {
    const response = await apiClient.post<TransferInitResponse>('/transfers/initiate', data);
    return response.data;
  },

  async confirm(data: TransferConfirmRequest): Promise<TransferConfirmResponse> {
    const response = await apiClient.post<TransferConfirmResponse>('/transfers/confirm', data);
    return response.data;
  },
};