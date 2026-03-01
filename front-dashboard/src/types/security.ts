export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Toggle2FARequest {
  enable: boolean;
  password: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  lastLogin?: string;
}