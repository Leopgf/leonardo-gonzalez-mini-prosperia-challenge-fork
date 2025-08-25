import { convertPdfToImage } from './ocr.aux.js';
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

    let imageFilePath = filePath;

    if (mimeType === 'application/pdf') {
      console.log('IS A PDF');
      imageFilePath = await convertPdfToImage(filePath);
    }

    console.log('\n\nThis is the final result of imageFilePath', imageFilePath);
    const { data } = await worker.recognize(imageFilePath);

    worker.terminate();

    return { text: '', confidence: 0 };
  }
}
