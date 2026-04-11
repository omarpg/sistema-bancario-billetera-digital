import { create } from 'zustand';
import { dashboardService, type DashboardSummary } from '@/lib/dashboard';
import { notificationsService } from '@/lib/notifications';
import { accountsService } from '@/lib/accounts';
import { contactsService } from '@/lib/contacts';

interface DashboardState extends DashboardSummary {
  // Estado de carga
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  loadDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  setUnreadNotifications: (count: number) => void;
  loadContacts: () => Promise<void>;
  loadAccounts: () => Promise<void>;
  loadUnreadNotifications: () => Promise<void>;
  reset: () => void;
}

const initialState: Partial<DashboardState> = {
  accounts: [],
  contacts: [],
  recentTransactions: [],
  recentNotifications: [],
  totalBalanceCLP: 0,
  totalBalanceUF: 0,
  monthlyExpensesByType: {},
  accountsCount: 0,
  contactsCount: 0,
  unreadNotifications: 0,
  currencyRates: [],
  isLoaded: false,
  isLoading: false,
  error: null,
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initialState as DashboardState,

  loadDashboard: async () => {
    // Si ya está cargado, no volver a cargar
    if (get().isLoaded) {
      console.log('📦 Dashboard ya cargado, usando caché');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await dashboardService.getDashboard();

      set({
        ...data,
        isLoaded: true,
        isLoading: false,
        error: null,
      });

      console.log('✅ Dashboard cargado exitosamente');
      console.log('Cuentas:', data.accounts.length);
      console.log('Contactos:', data.contacts.length);
      console.log('Transacciones recientes:', data.recentTransactions.length);
      console.log('Notificaciones recientes:', data.recentNotifications.length);
    } catch (error: unknown) {
      set({
        error: (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al cargar dashboard',
        isLoading: false,
      });
      console.error('❌ Error cargando dashboard:', error);
    }
  },

  refreshDashboard: async () => {
    try {
      const data = await dashboardService.getDashboard();
      set({ ...data });
    } catch (e) {
      console.error("❌ Error refrescando dashboard:", e);
    }
  },

  setUnreadNotifications: (count: number) => {
    set({ unreadNotifications: count });
  },

  loadContacts: async () => {
    try {
      const data = await contactsService.getAll();
      set({ contacts: data });
    } catch (error) {
      console.error("❌ Error cargando contactos:", error);
      throw error;
    }
  },

  loadAccounts: async () => {
    try {
      const data = await accountsService.getAll();
      set({ accounts: data });
    } catch (error) {
      console.error("❌ Error cargando cuentas:", error);
      throw error;
    }
  },

  loadUnreadNotifications: async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      set({ unreadNotifications: count });
    } catch (e) {
      console.error("❌ Error cargando notificaciones:", e);
    }
  },

  reset: () => {
    set(initialState as DashboardState);
  },
}));