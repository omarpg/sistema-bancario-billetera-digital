'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { securityService } from '@/lib/security';
import type { SecuritySettings } from '@/types';
import Input from '@/components/ui/Input';
import { formatDateTime, formatRut } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});
  const [changingPassword, setChangingPassword] = useState(false);
  //const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Estado para 2FA
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [toggling2FA, setToggling2FA] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await securityService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const errors: { [key: string]: string } = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Contraseña actual es obligatoria';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'Nueva contraseña es obligatoria';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Confirmar contraseña es obligatorio';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setChangingPassword(true);
    setPasswordErrors({});
    //setPasswordSuccess(false);

    try {
      await securityService.changePassword(passwordForm);
      //setPasswordSuccess(true);
      toast.success('Contraseña cambiada exitosamente', {
        duration: 5000,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      //setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al cambiar contraseña';
      setPasswordErrors({ submit: message });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!twoFactorPassword) {
      setTwoFactorError('Ingresa tu contraseña para continuar');
      return;
    }

    setToggling2FA(true);
    setTwoFactorError('');

    try {
      await securityService.toggle2FA({
        enable: !settings?.twoFactorEnabled,
        password: twoFactorPassword,
      });

      const message = settings?.twoFactorEnabled
        ? '2FA desactivado exitosamente'
        : '2FA activado exitosamente';

      toast.success(message, {
        duration: 5000,
      });

      // Recargar settings
      await loadSettings();
      setTwoFactorPassword('');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || 'Error al actualizar 2FA';
      setTwoFactorError(message);
    } finally {
      setToggling2FA(false);
    }
  };
  /*
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">Perfil y Seguridad</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información y configuración de seguridad</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Perfil y Seguridad</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información y configuración de seguridad</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Información del perfil */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-primary-700">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">RUT: {formatRut(user?.rut || '')}</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Información de cuenta</h3>
                <div className="space-y-3 text-sm">
                  {settings?.lastLogin && (
                    <div>
                      <p className="text-gray-600">Último acceso</p>
                      <p className="font-medium text-gray-900">{formatDateTime(settings.lastLogin)}</p>
                    </div>
                  )}
                  {settings?.lastPasswordChange && (
                    <div>
                      <p className="text-gray-600">Último cambio de contraseña</p>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(settings.lastPasswordChange)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuración de seguridad */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cambio de contraseña */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cambiar Contraseña</h2>

            {/*passwordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700">✓ Contraseña cambiada exitosamente</p>
              </div>
            )*/}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                id="currentPassword"
                label="Contraseña actual"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                error={passwordErrors.currentPassword}
                autoComplete="current-password"
              />

              <Input
                id="newPassword"
                label="Nueva contraseña"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                error={passwordErrors.newPassword}
                autoComplete="new-password"
              />

              <Input
                id="confirmPassword"
                label="Confirmar nueva contraseña"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                error={passwordErrors.confirmPassword}
                autoComplete="new-password"
              />

              {passwordErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{passwordErrors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="btn-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </div>

          {/* Autenticación de dos factores */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Autenticación de Dos Factores (2FA)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Agrega una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${settings?.twoFactorEnabled
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {settings?.twoFactorEnabled ? 'Activado' : 'Desactivado'}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                {settings?.twoFactorEnabled
                  ? '🔒 Tu cuenta está protegida con 2FA. Cada vez que inicies sesión, recibirás un código de verificación por email.'
                  : '⚠️ Tu cuenta no está protegida con 2FA. Te recomendamos activarla para mayor seguridad.'}
              </p>
            </div>

            <div className="space-y-4">
              <Input
                id="twoFactorPassword"
                label="Ingresa tu contraseña para continuar"
                type="password"
                value={twoFactorPassword}
                onChange={(e) => setTwoFactorPassword(e.target.value)}
                error={twoFactorError}
                placeholder="Tu contraseña"
              />

              <button
                onClick={handleToggle2FA}
                disabled={toggling2FA}
                className={`${settings?.twoFactorEnabled ? 'btn-danger' : 'btn-primary'
                  } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {toggling2FA
                  ? 'Procesando...'
                  : settings?.twoFactorEnabled
                    ? 'Desactivar 2FA'
                    : 'Activar 2FA'}
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card bg-gray-50 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Consejos de Seguridad</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-0.5">✓</span>
                <span>Usa una contraseña única que no uses en otros sitios</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-0.5">✓</span>
                <span>Cambia tu contraseña periódicamente</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-0.5">✓</span>
                <span>Activa la autenticación de dos factores para mayor seguridad</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 mt-0.5">✓</span>
                <span>No compartas tu contraseña con nadie</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}