import { AiProvider } from './ai.interface.js';

export class MockAi implements AiProvider {
  async structure(rawText: string) {
    const totalMatch = rawText.match(/total\D*(\d+[\.,]\d{2})/i);
    const taxMatch = rawText.match(
      /(iva|itbms|impuesto)[^\d]*(\d+[\.,]\d{2})/i
    );
    const pctMatch = rawText.match(/(\d{1,2}[\.,]?\d{0,2})\s*%/);
    const dateMatch = rawText.match(
      /(\d{4}[\/-]\d{2}[\/-]\d{2}|\d{2}[\/-]\d{2}[\/-]\d{4})/
    );
    const invoiceMatch = rawText.match(
      /(factura|invoice|n[ºo]\.?|no\.?)[^\w]([a-z0-9-]{4,})/i
    );
    // Vendor name naive: first line or words near RUC/NIT
    const lines = rawText
      .split(/\n|\r/)
      .map((l) => l.trim())
      .filter(Boolean);
    const vendorName = lines[0]?.slice(0, 80) || undefined;

    return {
      amount: totalMatch ? Number(totalMatch[1].replace(',', '.')) : undefined,
      subtotalAmount: undefined,
      taxAmount: taxMatch ? Number(taxMatch[2].replace(',', '.')) : undefined,
      taxPercentage: pctMatch
        ? Number(pctMatch[1].replace(',', '.'))
        : undefined,
      date: dateMatch ? dateMatch[1].replace(/\//g, '-') : undefined,
      invoiceNumber: invoiceMatch
        ? String(invoiceMatch[2]).toUpperCase()
        : undefined,
      type: 'expense' as 'expense' | 'income',
      currency: 'USD',
      description: undefined,
      vendorName
    };
  }
  async getCategorize(rawText: string) {
    return 0;
  }
}
