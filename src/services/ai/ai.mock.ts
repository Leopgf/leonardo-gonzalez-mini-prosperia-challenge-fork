import { AiProvider } from "./ai.interface.js";
export class MockAi implements AiProvider {
  async structure(rawText: string) {
    const totalMatch = rawText.match(/total\D*(\d+[\.,]\d{2})/i);
    const taxMatch = rawText.match(/(iva|itbms|impuesto)[^\d]*(\d+[\.,]\d{2})/i);
    const pctMatch = rawText.match(/(\d{1,2}[\.,]?\d{0,2})\s*%/);
    const dateMatch = rawText.match(/(\d{4}[\/-]\d{2}[\/-]\d{2}|\d{2}[\/-]\d{2}[\/-]\d{4})/);
    const invoiceMatch = rawText.match(/(factura|invoice|n[ºo]\.?|no\.?)[^\w]([a-z0-9-]{4,})/i);
    // Vendor name naive: first line or words near RUC/NIT
    const lines = rawText.split(/\n|\r/).map(l=>l.trim()).filter(Boolean);
    const vendorName = lines[0]?.slice(0,80) || null;

    return {
      amount: totalMatch ? Number(totalMatch[1].replace(",", ".")) : null,
      subtotalAmount: null,
      taxAmount: taxMatch ? Number(taxMatch[2].replace(",", ".")) : null,
      taxPercentage: pctMatch ? Number(pctMatch[1].replace(",", ".")) : null,
      date: dateMatch ? dateMatch[1].replace(/\//g, "-") : null,
      invoiceNumber: invoiceMatch ? String(invoiceMatch[2]).toUpperCase() : null,
      type: "expense" as "expense" | "income",
      currency: "USD",
      description: null,
      vendorName
    };
  }
  async categorize() { return {}; }
}

export const aiPrompt = `
You are an expert invoice parser working with OCR-extracted receipts and invoices from various countries and formats.

Your goal is to extract the following fields from messy, unstructured, and potentially multilingual OCR text:

- totalAmount
- subtotalAmount
- taxAmount
- taxPercentage
- date
- invoiceNumber
- vendorName
- vendorIdentification

Return only a valid and well-formatted JSON object using camelCase keys. If a value cannot be confidently extracted, return null for that key.

Do not include explanations. Do not repeat the text. Only return the JSON object.
      `.trim();
