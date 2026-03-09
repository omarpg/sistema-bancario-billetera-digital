export interface Contact {
  id: string;
  fullName: string;
  rut: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  email?: string;
  createdAt: string;
}

export interface ContactFormData {
  fullName: string;
  rut: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  email?: string;
}