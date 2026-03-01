export enum AccountType {
  CORRIENTE = 'CORRIENTE',
  VISTA = 'VISTA',
  AHORRO = 'AHORRO'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED'
}

export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  balanceInUF: number;
  createdAt: string;
}