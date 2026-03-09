import { useState } from 'react';
import type { SubmitEvent } from "react";

interface FormData {
  rut: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegistroForm() {
  const [formData, setFormData] = useState<FormData>({
    rut: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateRut = (rut: string): boolean => {
    // Implementación básica de validación de RUT
    const cleanRut = rut.replace(/[.-]/g, '');
    if (cleanRut.length < 2) return false;

    const rutDigits = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = rutDigits.length - 1; i >= 0; i--) {
      sum += parseInt(rutDigits[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDv = 11 - (sum % 11);
    const expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

    return dv === expectedDv;
  };

  const formatRut = (value: string): string => {
    const clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length <= 1) return clean;

    const dv = clean.slice(-1);
    const numbers = clean.slice(0, -1);

    const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setFormData({ ...formData, rut: formatted });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.rut) {
      newErrors.rut = 'El RUT es obligatorio';
    } else if (!validateRut(formData.rut)) {
      newErrors.rut = 'RUT inválido';
    }

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rut: formData.rut,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = 'http://localhost:3000/login';
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Error al registrar usuario' });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión. Verifica que el backend esté corriendo.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Registro exitoso!
        </h2>
        <p className="text-gray-600 mb-4">
          Tu cuenta ha sido creada correctamente.
        </p>
        <p className="text-sm text-gray-500">
          Redirigiendo al login...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Crea tu cuenta
      </h2>

      {/* MENSAJE INFORMATIVO - AGREGAR AQUÍ */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-900 font-medium">
              Al crear tu cuenta, por defecto se te asignará una <strong>Cuenta Vista</strong> para comenzar a usar la billetera de inmediato.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* RUT */}
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
            RUT
          </label>
          <input
            id="rut"
            type="text"
            value={formData.rut}
            onChange={handleRutChange}
            placeholder="12.345.678-9"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.rut ? 'border-red-500' : 'border-gray-300'
              }`}
            aria-invalid={errors.rut ? 'true' : 'false'}
            aria-describedby={errors.rut ? 'rut-error' : undefined}
            aria-required={true}
          />
          {errors.rut && (
            <p className="text-red-500 text-sm mt-1">{errors.rut}</p>
          )}
        </div>

        {/* Nombre completo */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Juanita Pérez"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            aria-required={true}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-required={true}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Mínimo 8 caracteres"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            aria-required={true}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Repite tu contraseña"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            aria-required={true}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Botón submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>

        {/* Link a login */}
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="http://localhost:3000/login" className="text-primary-600 hover:underline font-medium">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}