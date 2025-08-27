import { ParsedReceipt } from '../../types/receipt.js';
import { rules } from './rules.js';

/**
 * @deprecated
 * @param rawText
 * @returns
 */
export function naiveParse(rawText: string): Partial<ParsedReceipt> {
  const lowerCaseText = rawText.replace(/\t|\r/g, '').toLowerCase();

  const amount = findNumber(lowerCaseText, /total\s*[:=]?\s*(\d+[\.,]\d{2})/i);
  const subtotal = findNumber(
    lowerCaseText,
    /(subtotal|sub\s*total)\s*[:=]?\s*(\d+[\.,]\d{2})/i
  );

  const tax = findNumber(
    lowerCaseText,
    /(iva|itbms|impuesto)\s*[:=]?\s*(\d+[\.,]\d{2})/i
  );

  const pct = findNumber(lowerCaseText, /(\d{1,2}[\.,]?\d{0,2})\s*%/i);
  const date = findDate(lowerCaseText);
  const invoice = findInvoice(lowerCaseText);
  const vendorName = guessVendorName(rawText);
  const vendorIds = extractVendorIdentifications(lowerCaseText);

  return {
    amount,
    subtotalAmount: subtotal,
    taxAmount: tax,
    taxPercentage: pct,
    date,
    invoiceNumber: invoice,
    vendorName,
    vendorIdentifications: vendorIds,
    rawText
  };
}

function guessVendorName(raw: string): string {
  const lines = raw
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines[0]?.slice(0, 80) || '';
}

function extractVendorIdentifications(text: string): string[] {
  const ids: string[] = [];
  // Patrones genéricos para RUC/NIT/CIF (muy básicos)
  const patterns = [
    /ruc[:\s-]*([a-z0-9-\.]{6,20})/i,
    /nit[:\s-]*([a-z0-9-\.]{6,20})/i,
    /cif[:\s-]*([a-z0-9-\.]{6,20})/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) ids.push(m[1].toUpperCase());
  }
  return Array.from(new Set(ids));
}

function findNumber(text: string, re: RegExp): number {
  const m = text.match(re);
  return m ? Number(m[1].replace(',', '.')) : 0;
}

function findDate(text: string): string {
  const m = text.match(/(\d{4}[\/-]\d{2}[\/-]\d{2}|\d{2}[\/-]\d{2}[\/-]\d{4})/);
  if (!m) return '';
  const val = m[1].replace(/\//g, '-');
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [d, mth, y] = val.split('-');
    return `${y}-${mth}-${d}`;
  }
  return val;
}

function findInvoice(text: string): string {
  const m = text.match(/(factura|invoice|n[ºo]\.?|no\.?)[^\w]([a-z0-9-]{4,})/i);
  return m ? (m[2] as string).toUpperCase() : '';
}

export function improvedParser(text: string): Partial<ParsedReceipt> {
  const lines = text.toLowerCase().split('\n');
  const result: Record<string, string> = {};
  const foundFields = new Set<string>();

  // Las reglas pueden venir de base de datos o de un archivo de configuración
  const parseRules = rules;

  for (const line of lines) {
    const cleanLine = line.replace(/[^a-zA-ZÀ-ÿ0-9\s.,%\/-]/g, '');

    const tokens = cleanLine.split(/\s+/);

    for (const rule of parseRules) {
      if (foundFields.has(rule.name)) continue;

      if (!foundFields.has(rule.name) && rule.matchInLine) {
        const match = rule.matchInLine(cleanLine);
        if (match) {
          result[rule.name] = match;
          foundFields.add(rule.name);
          continue;
        }
      }

      for (let i = 0; i < tokens.length; i++) {
        if (!rule.labels.includes(tokens[i])) continue;

        if (rule.postLabelJoinRestOfLine) {
          const rest = tokens
            .slice(i + 1)
            .join(' ')
            .trim();
          if (rest) {
            result[rule.name] = rest;
            foundFields.add(rule.name);
            break;
          }
        }

        const maxLook = rule.maxLookahead ?? 2;
        for (let j = 1; j <= maxLook; j++) {
          const candidate = tokens[i + j];
          if (!candidate) continue;

          if (!rule.validate || rule.validate(candidate)) {
            result[rule.name] = candidate;
            foundFields.add(rule.name);
            break;
          }
        }

        if (foundFields.has(rule.name)) break;
      }
    }
    if (foundFields.size === rules.length) break;
  }

  return result;
}
