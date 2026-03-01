import { create } from 'zustand';
import type { Account, Contact, Transaction } from '@/types';

interface DashboardState {
  // Datos
  accounts: Account[];
  contacts: Contact[];
  transactions: Transaction[];
  unreadNotifications: number;

  // Estados de carga
  accountsLoaded: boolean;
  contactsLoaded: boolean;
  transactionsLoaded: boolean;

  // Acciones
  setAccounts: (accounts: Account[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setUnreadNotifications: (count: number) => void;

  // Invalidar caché (forzar recarga)
  invalidateAccounts: () => void;
  invalidateContacts: () => void;
  invalidateTransactions: () => void;

  // Reset completo
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Estado inicial
  accounts: [],
  contacts: [],
  transactions: [],
  unreadNotifications: 0,

  accountsLoaded: false,
  contactsLoaded: false,
  transactionsLoaded: false,

  // Setters
  setAccounts: (accounts) => set({ accounts, accountsLoaded: true }),
  setContacts: (contacts) => set({ contacts, contactsLoaded: true }),
  setTransactions: (transactions) => set({ transactions, transactionsLoaded: true }),
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),

  // Invalidar
  invalidateAccounts: () => set({ accountsLoaded: false }),
  invalidateContacts: () => set({ contactsLoaded: false }),
  invalidateTransactions: () => set({ transactionsLoaded: false }),

  // Reset
  reset: () => set({
    accounts: [],
    contacts: [],
    transactions: [],
    unreadNotifications: 0,
    accountsLoaded: false,
    contactsLoaded: false,
    transactionsLoaded: false,
  }),
}));