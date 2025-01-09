import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'decimal', 
    minimumFractionDigits: 0,
  });
  return `${formatter.format(value)} (VND)`;
}

export function formatProductType(type: string) {
  return type.replace(/([A-Z])/g, ' $1').trim();
}

export function formatProductCategory(category: string) {
  return category.replace(/([A-Z])/g, ' $1').trim();
}

