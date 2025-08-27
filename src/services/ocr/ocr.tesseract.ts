import { OcrProvider } from './ocr.interface.js';
import { createWorker } from 'tesseract.js';

export class TesseractOcr implements OcrProvider {
  async extractText({
    filePath,
    mimeType
  }: {
    filePath: string;
    mimeType: string;
  }) {
    const worker = await createWorker('eng+spa');

    const { data } = await worker.recognize(filePath);

    worker.terminate();

    const text = data?.text ?? '';

    return { text, confidence: 0 };
  }
}
