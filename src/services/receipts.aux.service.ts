import { ParsedReceipt, ParsedReceiptKey } from '../types/receipt';

export function createResponseJson(
  aiStruct: Partial<ParsedReceipt>,
  base: Partial<ParsedReceipt>,
  ocrOut: { text: string },
  category: number | null
) {
  const json = {
    amount: jsonParse(aiStruct, base, 'amount'),
    subtotalAmount: jsonParse(aiStruct, base, 'subtotalAmount'),
    taxAmount: jsonParse(aiStruct, base, 'taxAmount'),
    taxPercentage: jsonParse(aiStruct, base, 'taxPercentage'),
    type: (aiStruct as any).type ?? 'expense',
    currency: (aiStruct as any).currency ?? 'USD',
    date: jsonParse(aiStruct, base, 'date'),
    paymentMethod: jsonParse(aiStruct, base, 'paymentMethod'),
    description: jsonParse(aiStruct, base, 'description'),
    invoiceNumber: jsonParse(aiStruct, base, 'invoiceNumber'),
    category: category,
    vendorId: jsonParse(aiStruct, base, 'vendorId'),
    vendorName: jsonParse(aiStruct, base, 'vendorName'),
    vendorIdentifications: jsonParse(aiStruct, base, 'vendorIdentifications'),
    items: (aiStruct as any).items ?? [],
    rawText: ocrOut.text
  };

  return json;
}

export function jsonParse(
  ai: Partial<ParsedReceipt>,
  base: Partial<ParsedReceipt>,
  param: ParsedReceiptKey
) {
  return ai[param] ?? base[param];
}
