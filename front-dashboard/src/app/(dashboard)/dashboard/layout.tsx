'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { accountsService } from '@/lib/accounts';
import { notificationsService } from '@/lib/notifications';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { accountsLoaded, setAccounts, setUnreadNotifications } = useDashboardStore();

  // Solo verificar autenticación después de hidratar
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      console.log('No autenticado, redirigiendo a login...');
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Cargar datos críticos una vez autenticado
  useEffect(() => {
    if (hasHydrated && isAuthenticated && !accountsLoaded) {
      const loadCriticalData = async () => {
        try {
          console.log('=== CARGANDO DATOS CRÍTICOS DEL DASHBOARD ===');

          const [accounts, unreadCount] = await Promise.all([
            accountsService.getAll(),
            notificationsService.getUnreadCount(),
          ]);

          setAccounts(accounts);
          setUnreadNotifications(unreadCount);

          console.log('✓ Cuentas cargadas:', accounts.length);
          console.log('✓ Notificaciones sin leer:', unreadCount);
          console.log('==============================================');
        } catch (error) {
          console.error('Error cargando datos críticos:', error);
        }
      };

      loadCriticalData();
    }
  }, [hasHydrated, isAuthenticated, accountsLoaded, setAccounts, setUnreadNotifications]);

  // Mostrar loader mientras se hidrata
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Si no está autenticado después de hidratar, mostrar loader mientras redirige
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}