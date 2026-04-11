import apiClient from './api';
import type { Account, Contact, Transaction, Notification } from '@/types';

export interface DashboardSummary {
  accounts: Array<Account>;
  contacts: Array<Contact>;
  recentTransactions: Array<Transaction>;
  recentNotifications: Array<Notification>;
  totalBalanceCLP: number;
  totalBalanceUF: number;
  monthlyExpensesByType: Record<string, number>;
  accountsCount: number;
  contactsCount: number;
  unreadNotifications: number;
  currencyRates: Array<{
    code: string;
    value: number;
    updatedAt: string;
  }>;
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },
};