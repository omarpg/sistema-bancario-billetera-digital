export interface TransferInitRequest {
  sourceAccountId: string;
  contactId: string;
  amount: number;
  description: string;
}

export interface TransferInitResponse {
  transactionId: string;
  operationNumber: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  description: string;
  status: string;
  message: string;
}

export interface TransferConfirmRequest {
  transactionId: string;
  otpCode: string;
}

export interface TransferConfirmResponse {
  transactionId: string;
  operationNumber: number;
  status: string;
  message: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
}

export interface TransferReceiptData {
  operationNumber: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  destinationName: string;
  amount: number;
  description: string;
  date: string;
}