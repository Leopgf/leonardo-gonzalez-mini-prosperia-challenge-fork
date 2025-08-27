import { prisma } from '../db/client.js';
import { getOcrProvider } from './ocr/index.js';
import { getAiProvider } from './ai/index.js';
import { improvedParser, naiveParse } from './parsing/rawTextParser.js';
import { createResponseJson } from './receipts.aux.service.js';

export async function processReceipt(
  filePath: string,
  meta: { originalName: string; mimeType: string; size: number }
) {
  const ocr = getOcrProvider();
  const ai = getAiProvider();

  const ocrOut = await ocr.extractText({ filePath, mimeType: meta.mimeType });

  // ! const base = naiveParse(ocrOut.text);

  // Se creo una nueva función más adaptable y flexible con mayor grado de exactitud para la extracción de datos
  const base = improvedParser(ocrOut.text);

  const aiStruct = await ai.structure(ocrOut.text).catch(() => ({}) as any);

  const category = await ai.getCategorize(ocrOut.text);

  const json = createResponseJson(aiStruct, base, ocrOut, category);

  const saved = await prisma.receipt.create({
    data: {
      originalName: meta.originalName,
      mimeType: meta.mimeType,
      size: meta.size,
      storagePath: filePath,
      rawText: ocrOut.text || '',
      json,
      ocrProvider: process.env.OCR_PROVIDER || 'tesseract',
      aiProvider: process.env.AI_PROVIDER || 'mock'
    }
  });

  return saved;
}
