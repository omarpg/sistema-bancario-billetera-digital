'use client';

import { useState, useEffect } from 'react';
import type { Contact, ContactFormData } from '@/types';
import { formatRut, validateRut } from '@/lib/utils';
import Input from '@/components/ui/Input';
import type { AxiosError } from 'axios';

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    rut: '',
    bankName: '',
    accountNumber: '',
    accountType: '',
    email: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (contact) {
      setFormData({
        fullName: contact.fullName,
        rut: contact.rut,
        bankName: contact.bankName,
        accountNumber: contact.accountNumber,
        accountType: contact.accountType,
        email: contact.email || '',
      });
    }
  }, [contact]);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setFormData({ ...formData, rut: formatted });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.rut) {
      newErrors.rut = 'El RUT es obligatorio';
    }

    if (formData.rut && !validateRut(formData.rut)) {
      newErrors.rut = 'El RUT no es válido';
    }

    if (!formData.bankName) {
      newErrors.bankName = 'El banco es obligatorio';
    }

    if (!formData.accountNumber) {
      newErrors.accountNumber = 'El número de cuenta es obligatorio';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'El tipo de cuenta es obligatorio';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al guardar el contacto';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre completo */}
      <Input
        id="fullName"
        label="Nombre completo"
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Juan Pérez"
        error={errors.fullName}
      />

      {/* RUT */}
      <Input
        id="rut"
        label="RUT"
        type="text"
        value={formData.rut}
        onChange={handleRutChange}
        placeholder="12.345.678-9"
        error={errors.rut}
      />

      {/* Banco */}
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
          Banco
        </label>
        <select
          id="bankName"
          value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          className={`input-field ${errors.bankName ? 'input-error' : ''}`}
        >
          <option value="">Seleccionar banco</option>
          <option value="Banco Estado">Banco Estado</option>
          <option value="Banco de Chile">Banco de Chile</option>
          <option value="Banco Santander">Banco Santander</option>
          <option value="BCI">BCI</option>
          <option value="Banco Scotiabank">Banco Scotiabank</option>
          <option value="Banco Itaú">Banco Itaú</option>
          <option value="Banco Security">Banco Security</option>
          <option value="Banco Falabella">Banco Falabella</option>
          <option value="Banco Ripley">Banco Ripley</option>
          <option value="Banco Consorcio">Banco Consorcio</option>
        </select>
        {errors.bankName && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.bankName}
          </p>
        )}
      </div>

      {/* Número de cuenta */}
      <Input
        id="accountNumber"
        label="Número de cuenta"
        type="text"
        value={formData.accountNumber}
        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        placeholder="1234567890"
        error={errors.accountNumber}
      />

      {/* Tipo de cuenta */}
      <div>
        <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de cuenta
        </label>
        <select
          id="accountType"
          value={formData.accountType}
          onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
          className={`input-field ${errors.accountType ? 'input-error' : ''}`}
        >
          <option value="">Seleccionar tipo</option>
          <option value="Cuenta Corriente">Cuenta Corriente</option>
          <option value="Cuenta Vista">Cuenta Vista</option>
          <option value="Cuenta de Ahorro">Cuenta de Ahorro</option>
        </select>
        {errors.accountType && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.accountType}
          </p>
        )}
      </div>

      {/* Email (opcional) */}
      <Input
        id="email"
        label="Email (opcional)"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="contacto@example.com"
        error={errors.email}
      />

      {/* Error general */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : contact ? 'Actualizar' : 'Crear Contacto'}
        </button>
      </div>
    </form>
  );
}