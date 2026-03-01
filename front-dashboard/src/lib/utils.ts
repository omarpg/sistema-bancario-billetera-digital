import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, '');
  if (clean.length <= 1) return clean;

  const dv = clean.slice(-1);
  const numbers = clean.slice(0, -1);

  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function validateRut(rawRut: string): boolean {
  const rut = rawRut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (rut.length < 2) return false;

  const dv = rut.slice(-1);
  const numbers = rut.slice(0, -1);

  let sum = 0;
  let multiplier = 2;

  for (let i = numbers.length - 1; i >= 0; i--) {
    sum += parseInt(numbers[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = (11 - (sum % 11)) % 11;
  const expectedDvStr = expectedDv === 10 ? 'K' : expectedDv.toString();

  return dv === expectedDvStr;
}