import apiClient from './api';
import type { Contact, ContactFormData } from '@/types';

export const contactsService = {
  async getAll(): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts');
    return response.data;
  },

  async getById(id: string): Promise<Contact> {
    const response = await apiClient.get<Contact>(`/contacts/${id}`);
    return response.data;
  },

  async create(data: ContactFormData): Promise<Contact> {
    const response = await apiClient.post<Contact>('/contacts', data);
    return response.data;
  },

  async update(id: string, data: ContactFormData): Promise<Contact> {
    const response = await apiClient.put<Contact>(`/contacts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/contacts/${id}`);
  },
};