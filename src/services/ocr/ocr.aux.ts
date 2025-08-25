import { convert } from 'pdf-poppler';
import os from 'os';
import path from 'path';

export async function convertPdfToImage(filePath: string) {
  const downloadsPath = path.join(os.homedir(), 'Downloads');
  const options = {
    format: 'jpeg',
    out_dir: downloadsPath,
    out_prefix: 'receipt',
    resolution: 300
  };

  const pdfToImage = await convert(filePath, options).catch((e) => {
    console.log('\n\nTHIS IS THE ERROR', e);
  });
  console.log('\n\n Result pdf to image', pdfToImage);
  return pdfToImage;
}
