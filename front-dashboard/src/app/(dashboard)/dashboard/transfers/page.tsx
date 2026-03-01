'use client';

import { useState, useEffect } from 'react';
import { accountsService } from '@/lib/accounts';
import { contactsService } from '@/lib/contacts';
import { transfersService } from '@/lib/transfers';
import { useDashboardStore } from '@/store/dashboardStore';
import type { TransferReceiptData } from '@/types';
import Stepper from '@/components/ui/Stepper';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import TransferReceipt from '@/components/dashboard/TransferReceipt';

const steps = [
  { number: 1, title: 'Datos' },
  { number: 2, title: 'Confirmar' },
  { number: 3, title: 'Verificar' },
];

export default function TransfersPage() {
  const {
    accounts,
    contacts,
    accountsLoaded,
    contactsLoaded,
    setAccounts,
    setContacts,
    invalidateAccounts,
    invalidateTransactions
  } = useDashboardStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(!accountsLoaded || !contactsLoaded);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationType, setDestinationType] = useState<'contact' | 'manual'>('contact');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [manualAccountNumber, setManualAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Transfer response
  const [transferId, setTransferId] = useState('');
  const [operationNumber, setOperationNumber] = useState(0);

  // Estados para el comprobante
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<TransferReceiptData | null>(null);

  // OTP
  const [otpCode, setOtpCode] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cargar cuentas y contactos
  const loadData = async () => {
    try {
      setLoading(true);
      /*
      const [accountsData, contactsData] = await Promise.all([
        accountsService.getAll(),
        contactsService.getAll(),
      ]);

      setAccounts(accountsData);
      setContacts(contactsData);

      // Seleccionar primera cuenta solo si no hay una ya seleccionada
      if (accountsData.length > 0 && !sourceAccountId) {
        setSourceAccountId(accountsData[0].id);
      }*/
      const promises = [];

      // Solo cargar si no están en caché
      if (!accountsLoaded) {
        promises.push(accountsService.getAll().then(setAccounts));
      }
      if (!contactsLoaded) {
        promises.push(contactsService.getAll().then(setContacts));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accountsLoaded || !contactsLoaded) {
      loadData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Paso 1: Validar y pasar a confirmación
  const handleStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!sourceAccountId) {
      newErrors.sourceAccount = 'Selecciona una cuenta origen';
    }

    if (destinationType === 'contact' && !selectedContactId) {
      newErrors.destination = 'Selecciona un contacto';
    }

    if (destinationType === 'manual' && !manualAccountNumber) {
      newErrors.destination = 'Ingresa un número de cuenta';
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Ingresa un monto válido';
    }

    const selectedAccount = accounts.find((a) => a.id === sourceAccountId);
    if (selectedAccount && parseFloat(amount) > selectedAccount.balance) {
      newErrors.amount = 'Saldo insuficiente';
    }

    if (!description) {
      newErrors.description = 'Ingresa una descripción';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  // Paso 2: Iniciar transferencia
  const handleStep2 = async () => {
    setSubmitting(true);
    setErrors({});

    try {

      console.log('=== DEBUG TRANSFERENCIA ===');
      console.log('sourceAccountId:', sourceAccountId);
      console.log('selectedContactId:', selectedContactId);
      console.log('selectedContactId TYPE:', typeof selectedContactId);
      console.log('amount:', parseFloat(amount));
      console.log('description:', description);

      // Ver el contacto seleccionado completo
      const selectedContact = contacts.find(c => c.id === selectedContactId);
      console.log('Selected contact full:', selectedContact);
      console.log('===========================');

      const payload = {
        sourceAccountId,
        contactId: selectedContactId,
        amount: parseFloat(amount),
        description,
      };

      console.log('PAYLOAD A ENVIAR:', payload);

      const response = await transfersService.initiate(payload);

      setTransferId(response.transactionId);
      setOperationNumber(response.operationNumber);
      setCurrentStep(3);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message ||
        'Error al iniciar transferencia';
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  // Paso 3: Confirmar con OTP
  const handleStep3 = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: 'El código debe tener 6 dígitos' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await transfersService.confirm({
        transactionId: transferId,
        otpCode,
      });

      // Preparar datos para el comprobante
      const sourceAccount = accounts.find(a => a.id === sourceAccountId);
      const selectedContact = contacts.find(c => c.id === selectedContactId);

      const receiptInfo = {
        operationNumber: response.operationNumber || operationNumber,
        sourceAccountNumber: sourceAccount?.accountNumber || '',
        destinationAccountNumber: selectedContact?.accountNumber || '',
        destinationName: selectedContact?.fullName || '',
        amount: parseFloat(amount),
        description: description || 'Sin descripción',
        date: new Date().toISOString(),
      };

      setReceiptData(receiptInfo);

      // Toast de éxito
      toast.success('Transferencia realizada con éxito', {
        duration: 5000,
      });

      // Invalidar cachés relacionados
      invalidateAccounts(); // Saldos cambiaron
      invalidateTransactions(); // Hay nueva transacción

      // Recargar cuentas para actualizar saldos
      await loadData();

      // Resetear formulario
      resetForm();

      // Mostrar comprobante después de un breve delay
      setTimeout(() => {
        setShowReceipt(true);
      }, 500);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message ||
        'Código incorrecto o expirado';
      setErrors({ otp: message });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSourceAccountId(accounts[0]?.id || '');
    setDestinationType('contact');
    setSelectedContactId('');
    setManualAccountNumber('');
    setAmount('');
    setDescription('');
    setTransferId('');
    setOperationNumber(0);
    setOtpCode('');
    setErrors({});
  };

  const getDestinationAccountNumber = () => {
    if (destinationType === 'contact') {
      return contacts.find((c) => c.id === selectedContactId)?.accountNumber || '';
    }
    return manualAccountNumber;
  };

  const getDestinationName = () => {
    if (destinationType === 'contact') {
      return contacts.find((c) => c.id === selectedContactId)?.fullName || '';
    }
    return 'Cuenta manual';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transferencias</h1>
        <p className="text-gray-600 mt-1">Realiza transferencias de forma segura</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Stepper */}
          <Stepper steps={steps} currentStep={currentStep} />

          {/* Contenido por paso */}
          <div className="max-w-2xl mx-auto">
            <div className="card">
              {/* PASO 1: Datos de la transferencia */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos de la transferencia</h2>

                  {/* Cuenta origen */}
                  <div>
                    <label htmlFor="sourceAccount" className="block text-sm font-medium text-gray-700 mb-2">
                      Cuenta origen
                    </label>
                    <select
                      id="sourceAccount"
                      value={sourceAccountId}
                      onChange={(e) => setSourceAccountId(e.target.value)}
                      className={`input-field ${errors.sourceAccount ? 'input-error' : ''}`}
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.type} / {account.accountNumber} / {formatCurrency(account.balance)}
                        </option>
                      ))}
                    </select>
                    {errors.sourceAccount && (
                      <p className="text-red-500 text-sm mt-1">{errors.sourceAccount}</p>
                    )}
                  </div>

                  {/* Tipo de destino */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destino
                    </label>
                    <div className="flex space-x-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setDestinationType('contact')}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors cursor-pointer ${destinationType === 'contact'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        Contacto guardado
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestinationType('manual')}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors cursor-pointer ${destinationType === 'manual'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        Ingresar manualmente
                      </button>
                    </div>

                    {destinationType === 'contact' ? (
                      <select
                        value={selectedContactId}
                        onChange={(e) => setSelectedContactId(e.target.value)}
                        className={`input-field ${errors.destination ? 'input-error' : ''}`}
                      >
                        <option value="">Seleccionar contacto</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.id}>
                            {contact.fullName} - {contact.accountNumber}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id="manualAccount"
                        label=""
                        type="text"
                        value={manualAccountNumber}
                        onChange={(e) => setManualAccountNumber(e.target.value)}
                        placeholder="Número de cuenta destino"
                        error={errors.destination}
                      />
                    )}
                  </div>

                  {/* Monto */}
                  <Input
                    id="amount"
                    label="Monto"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    error={errors.amount}
                  />

                  {/* Descripción */}
                  <Input
                    id="description"
                    label="Descripción"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Pago de arriendo"
                    error={errors.description}
                  />

                  <button onClick={handleStep1} className="w-full btn-primary cursor-pointer">
                    Continuar
                  </button>
                </div>
              )}

              {/* PASO 2: Confirmar transferencia */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmar transferencia</h2>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuenta origen:</span>
                      <span className="font-medium">
                        {accounts.find((a) => a.id === sourceAccountId)?.accountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuenta destino:</span>
                      <span className="font-medium">{getDestinationAccountNumber()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destinatario:</span>
                      <span className="font-medium">{getDestinationName()}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="text-gray-900 font-semibold">Monto:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatCurrency(parseFloat(amount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Descripción:</span>
                      <span className="font-medium">{description}</span>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleStep2}
                      disabled={submitting}
                      className="flex-1 btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Procesando...' : 'Confirmar y enviar OTP'}
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: Verificar OTP */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificar transferencia</h2>
                    <p className="text-gray-600">
                      Ingresa el código de 6 dígitos enviado a tu correo
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Operación #{operationNumber}
                    </p>
                  </div>

                  <Input
                    id="otpCode"
                    label="Código de verificación"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    error={errors.otp}
                    autoFocus
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 text-sm">
                      💡 <strong>Tip:</strong> Revisa tu bandeja de entrada. El código expira en 5 minutos.
                    </p>
                  </div>

                  <button
                    onClick={handleStep3}
                    disabled={submitting || otpCode.length !== 6}
                    className="w-full btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Verificando...' : 'Completar transferencia'}
                  </button>

                  <button
                    onClick={resetForm}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    Cancelar transferencia
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Modal de comprobante */}
      {showReceipt && receiptData && (
        <TransferReceipt
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          data={receiptData}
        />
      )}
    </div>
  );
}