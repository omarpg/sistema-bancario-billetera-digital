'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/auth';
import { formatRut } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import type { AxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setFormData({ ...formData, identifier: formatted });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.identifier) {
      newErrors.identifier = 'RUT o email es obligatorio';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('=== INICIO LOGIN ===');
    console.log('FormData:', formData);

    if (!validateForm()) {
      console.log('Validación fallida');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.login(formData);

      if (response.requireOtp) {
        // Redirigir a verificación OTP
        console.log('Redirigiendo a verify-otp...');
        router.push(`/verify-otp?userId=${response.userId}`);
      } else {
        // Login exitoso sin 2FA
        console.log('Login sin OTP');
        if (response.token) {
          console.log('Setting auth with token:', response.token);
          setAuth(
            {
              userId: response.userId,
              rut: response.rut,
              fullName: response.fullName,
              email: response.email,
            },
            response.token
          );

          console.log('Auth guardado, verificando...');
          console.log('localStorage token:', localStorage.getItem('token')?.substring(0, 20));

          console.log('Intentando redirigir...');
          router.push('/dashboard');

          // Fallback con window.location
          setTimeout(() => {
            console.log('Fallback redirect...');
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          console.error('No se recibió token en la respuesta');
        }
      }
    } catch (error: unknown) {
      console.error('=== ERROR EN LOGIN ===');
      console.error('Error completo:', error);
      const axiosError = error as AxiosError<{ message: string }>;

      const message =
        axiosError.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';

      setErrors({ submit: message });
    } finally {
      setLoading(false);
      console.log('=== FIN LOGIN ===');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-600 to-primary-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
          <p className="text-primary-100">Ingresa a tu cuenta de Billetera Digital</p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RUT o Email */}
            <Input
              id="identifier"
              label="RUT o Email"
              type="text"
              value={formData.identifier}
              onChange={(e) =>
                e.target.value.includes('@')
                  ? setFormData({ ...formData, identifier: e.target.value })
                  : handleRutChange(e)
              }
              placeholder="12.345.678-9 o tu@email.com"
              error={errors.identifier}
              autoComplete="username"
            />

            {/* Contraseña */}
            <Input
              id="password"
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Tu contraseña"
              error={errors.password}
              autoComplete="current-password"
            />

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
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>

            {/* Link a registro */}
            <p className="text-center text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL}/registro`}
                className="text-primary-700 hover:text-primary-800 font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>

        {/* Link al portal */}
        <div className="text-center mt-6">
          <Link
            href={process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:4321'}
            className="text-white hover:text-primary-100 text-sm"
          >
            ← Volver al portal
          </Link>
        </div>
      </div>
    </div>
  );
}