export type Item = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: number | null; // Account.id
};

export type ParsedReceipt = {
  amount?: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxPercentage?: number;
  type?: 'expense' | 'income';
  currency?: string; // ISO 4217
  date?: string; // YYYY-MM-DD
  paymentMethod?: 'CARD' | 'CASH' | 'TRANSFER' | 'OTHER';
  description?: string;
  invoiceNumber?: string;
  category?: number; // Account.id
  vendorId?: number;
  vendorName?: string;
  vendorIdentifications?: string[];
  items?: Item[];
  rawText?: string;
};

export type ParsedReceiptKey = keyof ParsedReceipt;
