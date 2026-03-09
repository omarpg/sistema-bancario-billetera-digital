'use client';

import { useState, useEffect } from 'react';
import { transactionsService } from '@/lib/transactions';
import { accountsService } from '@/lib/accounts';
import type { Transaction, Account } from '@/types';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { AxiosError } from 'axios';

type FilterType = 'all' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
type FilterStatus = 'all' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'FAILED';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Detalle de transacción
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('=== CARGANDO TRANSACCIONES ===');
      const [transactionsData, accountsData] = await Promise.all([
        transactionsService.getAll(),
        accountsService.getAll(),
      ]);
      console.log('Transacciones recibidas:', transactionsData);
      console.log('Cantidad:', transactionsData.length);
      console.log('Cuentas del usuario:', accountsData);
      console.log('================================');
      setTransactions(transactionsData);
      setAccounts(accountsData);
      setError('');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message ||
        'Error al cargar transacciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transacciones
  const filteredTransactions = transactions.filter((tx) => {
    // Filtro por tipo
    if (filterType !== 'all' && tx.type !== filterType) return false;

    // Filtro por estado
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;

    // Filtro por búsqueda (descripción o número de operación)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesDescription = tx.description?.toLowerCase().includes(search);
      const matchesOperation = tx.operationNumber?.toString().includes(search);
      if (!matchesDescription && !matchesOperation) return false;
    }

    return true;
  });

  // Determinar si es entrada o salida
  const isIncoming = (tx: Transaction) => {
    return accounts.some((acc) => acc.id === tx.destAccountId);
  };

  const getAccountNumber = (accountId?: string) => {
    if (!accountId) return 'Externa';
    const account = accounts.find((a) => a.id === accountId);
    return account?.accountNumber || accountId.substring(0, 8) + '...';
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      TRANSFER: 'Transferencia',
      DEPOSIT: 'Depósito',
      WITHDRAWAL: 'Retiro',
      FEE: 'Comisión',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmada',
      COMPLETED: 'Completada',
      FAILED: 'Fallida',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
        <p className="text-gray-600 mt-1">Historial completo de tus movimientos</p>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Descripción o N° operación"
              className="input-field"
            />
          </div>

          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="TRANSFER">Transferencias</option>
              <option value="DEPOSIT">Depósitos</option>
              <option value="WITHDRAWAL">Retiros</option>
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="input-field"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendientes</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="COMPLETED">Completadas</option>
              <option value="FAILED">Fallidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        // Estado vacío
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No se encontraron transacciones'
              : 'Aún no tienes transacciones'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Realiza tu primera transferencia para ver tu historial'}
          </p>
        </div>
      ) : (
        // Lista de transacciones
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen/Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((tx) => {
                  const incoming = isIncoming(tx);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(tx.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getTransactionTypeLabel(tx.type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">{tx.description || 'Sin descripción'}</div>
                        <div className="text-xs text-gray-500">Op. #{tx.operationNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {incoming ? (
                          <span className="text-green-600">← {getAccountNumber(tx.sourceAccountId)}</span>
                        ) : (
                          <span className="text-gray-600">→ {getAccountNumber(tx.destAccountId)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <span className={incoming ? 'text-green-600' : 'text-gray-900'}>
                          {incoming ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={tx.status}>
                          {getStatusLabel(tx.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="text-primary-600 hover:text-primary-900 cursor-pointer"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalles (simplificado por ahora) */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTransaction(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalle de Transacción</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Número de operación</p>
                  <p className="text-lg font-semibold">{selectedTransaction.operationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-medium">{formatDateTime(selectedTransaction.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium">{getTransactionTypeLabel(selectedTransaction.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monto</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <Badge status={selectedTransaction.status}>
                    {getStatusLabel(selectedTransaction.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Descripción</p>
                  <p className="font-medium">{selectedTransaction.description || 'Sin descripción'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cuenta origen</p>
                  <p className="font-medium">{getAccountNumber(selectedTransaction.sourceAccountId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cuenta destino</p>
                  <p className="font-medium">{getAccountNumber(selectedTransaction.destAccountId)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full mt-6 btn-primary cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}