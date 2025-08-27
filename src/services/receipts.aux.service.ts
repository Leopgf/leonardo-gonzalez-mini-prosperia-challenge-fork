import { ParsedReceipt, ParsedReceiptKey } from '../types/receipt';

interface IJsonParsers {
  textAi: Partial<ParsedReceipt>;
  textBase: Partial<ParsedReceipt>;
  param: ParsedReceiptKey;
}

export function createResponseJson(
  textAi: Partial<ParsedReceipt>,
  textBase: Partial<ParsedReceipt>,
  ocrOut: { text: string },
  category: number | null
) {
  const json = {
    amount: numberParse({ textAi, textBase, param: 'amount' }),
    subtotalAmount: numberParse({ textAi, textBase, param: 'subtotalAmount' }),
    taxAmount: numberParse({ textAi, textBase, param: 'taxAmount' }),
    taxPercentage: numberParse({ textAi, textBase, param: 'taxPercentage' }),
    type: textAi?.type ?? 'expense',
    currency: textAi?.currency ?? 'USD',
    date: stringParse({ textAi, textBase, param: 'date' }),
    paymentMethod: stringParse({ textAi, textBase, param: 'paymentMethod' }),
    description: stringParse({ textAi, textBase, param: 'description' }),
    invoiceNumber: numberParse({ textAi, textBase, param: 'invoiceNumber' }),
    category: category,
    vendorId: numberParse({ textAi, textBase, param: 'vendorId' }),
    vendorName: stringParse({ textAi, textBase, param: 'vendorName' }),
    vendorIdentifications: stringParse({
      textAi,
      textBase,
      param: 'vendorIdentifications'
    }),
    items: arrayParse({ textAi, textBase, param: 'items' }),
    rawText: ocrOut.text
  };

  return json;
}

function stringParse({ textAi, textBase, param }: IJsonParsers) {
  const str = textAi[param] ?? textBase[param];
  return str ?? '';
}

function numberParse({ textAi, textBase, param }: IJsonParsers) {
  const num = textAi[param] ?? textBase[param];
  return num ?? 0;
}

function arrayParse({ textAi, textBase, param }: IJsonParsers) {
  const arr = textAi[param] ?? textBase[param];
  return arr ?? [];
}
