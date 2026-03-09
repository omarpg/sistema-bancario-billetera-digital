'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Título de página - lo actualizaremos dinámicamente después */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Acciones */}
        <div className="flex items-center space-x-4">
          {/* Usuario mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}