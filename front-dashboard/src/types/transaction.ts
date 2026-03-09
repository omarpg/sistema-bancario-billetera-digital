export enum TransactionType {
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  FEE = 'FEE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Transaction {
  id: string;
  operationNumber: number;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  sourceAccountId?: string;
  sourceAccountNumber?: string;
  destAccountId?: string;
  destAccountNumber?: string;
  createdAt: string;
}