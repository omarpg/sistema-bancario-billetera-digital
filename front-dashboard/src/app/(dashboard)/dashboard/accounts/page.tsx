'use client';

import { useState, useEffect } from 'react';
//import { accountsService } from '@/lib/accounts';
import { useDashboardStore } from '@/store/dashboardStore';
import { transactionsService } from '@/lib/transactions';
import type { Account, Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { AxiosError } from 'axios';

export default function AccountsPage() {
  const accounts = useDashboardStore((state) => state.accounts);
  //const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /*
  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadAccountTransactions(selectedAccount.id);
    }
  }, [selectedAccount]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountsService.getAll();
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0]);
      }
      setError('');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al cargar cuentas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  */

  // Seleccionar primera cuenta al cargar
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  // Cargar transacciones cuando se selecciona una cuenta
  useEffect(() => {
    if (selectedAccount) {
      loadAccountTransactions(selectedAccount.id);
    }
  }, [selectedAccount]);

  const loadAccountTransactions = async (accountId: string) => {
    try {
      setLoading(true);
      const allTransactions = await transactionsService.getAll();
      // Filtrar solo transacciones de esta cuenta
      const filtered = allTransactions.filter(
        (tx) => tx.sourceAccountId === accountId || tx.destAccountId === accountId
      );
      setTransactions(filtered.slice(0, 10)); // Últimas 10
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al cargar transacciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      VISTA: 'Cuenta Vista',
      CORRIENTE: 'Cuenta Corriente',
      AHORRO: 'Cuenta de Ahorro',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      BLOCKED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      ACTIVE: 'Activa',
      INACTIVE: 'Inactiva',
      BLOCKED: 'Bloqueada',
    };
    return labels[status] || status;
  };

  /*
  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mis Cuentas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus cuentas bancarias</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }*/

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Cuentas</h1>
        <p className="text-gray-600 mt-1">Gestiona tus cuentas bancarias</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tienes cuentas
          </h3>
          <p className="text-gray-600">
            Contacta con soporte para abrir una cuenta
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de cuentas */}
          <div className="lg:col-span-1 space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className={`card cursor-pointer transition-all ${selectedAccount?.id === account.id
                  ? 'ring-2 ring-primary-600 bg-primary-50'
                  : 'hover:shadow-md'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getAccountTypeLabel(account.type)}
                    </h3>
                    <p className="text-sm text-gray-600">{account.accountNumber}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      account.status
                    )}`}
                  >
                    {getStatusLabel(account.status)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-600 mb-1">Saldo disponible</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{account.currency}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detalles de cuenta seleccionada */}
          {selectedAccount && (
            <div className="lg:col-span-2 space-y-6">
              {/* Información de la cuenta */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Información de la Cuenta
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tipo de cuenta</p>
                    <p className="font-medium text-gray-900">
                      {getAccountTypeLabel(selectedAccount.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Número de cuenta</p>
                    <p className="font-medium text-gray-900">
                      {selectedAccount.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedAccount.status
                      )}`}
                    >
                      {getStatusLabel(selectedAccount.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Moneda</p>
                    <p className="font-medium text-gray-900">{selectedAccount.currency}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Saldo disponible</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {formatCurrency(selectedAccount.balance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Últimos movimientos */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Últimos Movimientos
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay movimientos recientes en esta cuenta
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => {
                      const isIncoming = tx.destAccountId === selectedAccount.id;
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncoming ? 'bg-green-100' : 'bg-gray-200'
                                }`}
                            >
                              <svg
                                className={`w-5 h-5 ${isIncoming ? 'text-green-600' : 'text-gray-600'
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d={
                                    isIncoming
                                      ? 'M7 16l-4-4m0 0l4-4m-4 4h18'
                                      : 'M17 8l4 4m0 0l-4 4m4-4H3'
                                  }
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {tx.description || 'Sin descripción'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDateTime(tx.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-semibold ${isIncoming ? 'text-green-600' : 'text-gray-900'
                                }`}
                            >
                              {isIncoming ? '+' : '-'} {formatCurrency(tx.amount)}
                            </p>
                            <p className="text-xs text-gray-500">Op. #{tx.operationNumber}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}