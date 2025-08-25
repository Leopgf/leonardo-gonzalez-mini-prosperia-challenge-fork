import { OcrProvider } from './ocr.interface.js';
import { createWorker } from 'tesseract.js';

export class TesseractOcr implements OcrProvider {
  async extractText({ filePath, mimeType }: { filePath: string; mimeType: string }) {

    const worker = await createWorker('eng+spa');

    let file = filePath
    if(mimeType === 'application/pdf') {
      file = convertPdfToImage(filePath)
    }
    const { data } = await worker.recognize(filePath);

    // worker.terminate();

    return { text: '', confidence: 0 };
  }
}


