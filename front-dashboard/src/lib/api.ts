import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    console.log('Axios request:', config.method?.toUpperCase(), config.url);
    console.log('Request data:', config.data);

    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token ? token.substring(0, 50) + '...' : 'NO HAY TOKEN');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header agregado');
    } else {
      console.warn('NO SE AGREGÓ TOKEN - Usuario no autenticado');
    }

    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Solo redirigir si no estamos ya en login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;