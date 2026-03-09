'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';
//import { accountsService } from '@/lib/accounts';
import { transactionsService } from '@/lib/transactions';
//import { notificationsService } from '@/lib/notifications';
import type { Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  /*
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);*/

  // Obtener datos del store (ya cargados en el layout)
  const accounts = useDashboardStore((state) => state.accounts);
  const unreadCount = useDashboardStore((state) => state.unreadNotifications);
  const accountsLoaded = useDashboardStore((state) => state.accountsLoaded);

  // Solo las transacciones se cargan aquí (lazy loading)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accountsLoaded) {
      loadDashboardData();
    }
  }, [accountsLoaded]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      /*
      const [accountsData, transactionsData, unreadNotifications] = await Promise.all([
        accountsService.getAll(),
        transactionsService.getAll(),
        notificationsService.getUnreadCount(),
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData.slice(0, 5)); // Últimas 5
      setUnreadCount(unreadNotifications);*/
      const transactionsData = await transactionsService.getAll();
      setTransactions(transactionsData.slice(0, 5)); // Últimas 5
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const thisMonthTransfers = transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    const now = new Date();
    return (
      tx.type === 'TRANSFER' &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'TRANSFER':
        return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
      case 'DEPOSIT':
        return 'M12 4v16m8-8H4';
      case 'WITHDRAWAL':
        return 'M20 12H4';
      default:
        return 'M12 4v16m8-8H4';
    }
  };

  // Mientras esperamos que el store se cargue
  if (!accountsLoaded || loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.fullName?.split(' ')[0] || 'Usuario'}
          </h2>
          <p className="text-gray-600">Cargando tu información...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Bienvenida */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.fullName?.split(' ')[0] || 'Usuario'}
        </h2>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu actividad financiera
        </p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Saldo Total */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Saldo Total</h3>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''} activa{accounts.length !== 1 ? 's' : ''}
          </p>
          <Link
            href="/dashboard/accounts"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 inline-block"
          >
            Ver cuentas →
          </Link>
        </div>

        {/* Transferencias del mes */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Transferencias</h3>
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{thisMonthTransfers}</p>
          <p className="text-sm text-gray-500 mt-1">Este mes</p>
          <Link
            href="/dashboard/transfers"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 inline-block"
          >
            Nueva transferencia →
          </Link>
        </div>

        {/* Notificaciones */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Notificaciones</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center relative">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
          <p className="text-sm text-gray-500 mt-1">Sin leer</p>
          <Link
            href="/dashboard/notifications"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 inline-block"
          >
            Ver notificaciones →
          </Link>
        </div>
      </div>

      {/* Grid de contenido */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mis cuentas */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mis Cuentas</h3>
              <Link
                href="/dashboard/accounts"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Cuenta {account.type}</p>
                      <p className="text-sm text-gray-600">{account.accountNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                    <p className="text-xs text-gray-500">{account.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas transacciones */}
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Últimas Transacciones</h3>
              <Link
                href="/dashboard/transactions"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Ver todas
              </Link>
            </div>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay transacciones recientes</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getTransactionIcon(tx.type)} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {tx.description || 'Sin descripción'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDateTime(tx.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/transfers"
                className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Nueva Transferencia</span>
              </Link>

              <Link
                href="/dashboard/contacts"
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Mis Contactos</span>
              </Link>

              <Link
                href="/dashboard/transactions"
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Ver Transacciones</span>
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-linear-to-br from-primary-50 to-secondary-50 border-primary-100">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Tip del día</h4>
                <p className="text-sm text-gray-700">
                  Agrega contactos frecuentes para hacer transferencias más rápido y seguro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}