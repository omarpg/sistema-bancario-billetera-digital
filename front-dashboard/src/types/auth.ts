export interface User {
  userId: string;
  rut: string;
  fullName: string;
  email: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  rut: string;
  fullName: string;
  email: string;
  token?: string;
  requireOtp: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  userId: string;
  code: string;
}

export interface VerifyOtpResponse {
  userId: string;
  rut: string;
  fullName: string;
  email: string;
  token: string;
  message: string;
}