'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/auth';
import Input from '@/components/ui/Input';
import type { AxiosError } from 'axios';
import type { SubmitEvent } from "react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const userId = searchParams.get('userId');

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push('/login');
    }
  }, [userId, router]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    if (!userId) return;

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp({ userId, code });

      setAuth(
        {
          userId: response.userId,
          rut: response.rut,
          fullName: response.fullName,
          email: response.email,
        },
        response.token
      );

      router.push('/');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;

      const message = axiosError.response?.data?.message ||
        'Código incorrecto o expirado. Intenta nuevamente.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-600 to-primary-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verificación de Seguridad</h1>
          <p className="text-primary-100">
            Ingresa el código de 6 dígitos que enviamos a tu correo
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código OTP */}
            <Input
              id="code"
              label="Código de verificación"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              error={error}
              autoComplete="one-time-code"
              autoFocus
            />

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm">
                💡 <strong>Tip:</strong> Revisa tu bandeja de entrada y también la carpeta de spam.
                El código expira en 5 minutos.
              </p>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full btn-primary cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>

            {/* Link para volver */}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              ← Volver al login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}