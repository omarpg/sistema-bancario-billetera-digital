'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';

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

  // Solo verificar autenticación después de hidratar
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      console.log('No autenticado, redirigiendo a login...');
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    try {
      const loadDashboardData = async () => {
        console.log('=== CARGANDO DATOS DEL DASHBOARD ===');
        useDashboardStore.getState().loadDashboard();
      };

      loadDashboardData();
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      console.log('✓ Dashboard data cargada');
      console.log('===================================');
    }
  }, []);


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