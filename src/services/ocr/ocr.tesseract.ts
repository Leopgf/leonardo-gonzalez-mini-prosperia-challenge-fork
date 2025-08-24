import { OcrProvider } from './ocr.interface.js';
import { createWorker } from 'tesseract.js';

export class TesseractOcr implements OcrProvider {
  // TODO: Implementar extracción de información con Tesseract
  async extractText({ filePath }: { filePath: string; mimeType: string }) {
    const worker = await createWorker('eng+spa');
    const { data } = await worker.recognize(filePath);

    worker.terminate();

    return { text: data.text, confidence: 0 };
  }
}
