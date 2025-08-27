import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const aiStructurePrompt = `
You are an expert invoice parser working with OCR-extracted receipts and invoices from various countries and formats.
Your goal is to extract the following fields from messy, unstructured, and potentially multilingual OCR text:
- amount
- subtotalAmount
- taxAmount
- taxPercentage
- date
- invoiceNumber
- vendorName
- vendorIdentification
- items
- currency
- description
Return only a valid and well-formatted JSON object using camelCase keys. If a value cannot be confidently extracted, return null for that key.
Do not include explanations. Do not repeat the text. Only return the JSON object.
      `.trim();

export async function aiCategorizePrompt(rawText: string) {
  const reqCategories = await prisma.account.findMany({
    select: {
      name: true
    }
  });

  const dbCategories = reqCategories.map((category) => category.name);
  let categories = dbCategories;

  if (dbCategories.length < 1) {
    categories = staticCategories;
  }

  const prompt = `
You will receive a receipt or invoice in raw text form. The text was extracted using OCR and may contain noise, typos, or formatting issues. Receipts come from different countries, so content may appear in various languages, formats, and currencies.

Your task is to select the single most appropriate category from the list below based only on the overall content of the receipt.

CATEGORY LIST:
${categories.join('\n')}

Only return the category name. Do not provide any explanation or extra text.

Receipt Text:
"""
${rawText}
"""`.trim();

  return prompt;
}

const staticCategories = [
  'Aseo/Limpieza',
  'Transporte',
  'Alimentación',
  'Servicios Públicos',
  'Combustible',
  'Papelería',
  'Software/Suscripciones',
  'Mantenimiento',
  'Impuestos (IVA/ITBMS)',
  'Ventas',
  'Banco Principal',
  'Caja'
];
