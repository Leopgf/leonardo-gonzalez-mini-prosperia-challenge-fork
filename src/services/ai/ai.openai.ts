import { AiProvider } from './ai.interface.js';
import axios from 'axios';

export class OpenAiProvider implements AiProvider {
  baseUrl: string;
  token: string;

  constructor() {
    this.baseUrl = process.env.OPENAI_BASE_URL || 'http://localhost:8080';
    this.token = process.env.PROSPERIA_TOKEN || '';
  }

  // TODO: Implementar extracción de información con IA del rawText
  async structure(rawText: string) {
    const payload = {
      // No cambiar modelo. Solo 4o-mini funciona
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
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
      `.trim()
        },
        { role: 'user', content: rawText }
      ],
      temperature: 0.5
    };

    let resp;

    try {
      resp = await axios.post(`${this.baseUrl}/openai/chat`, payload, {
        headers: { 'X-Prosperia-Token': this.token }
      });
    } catch (err: unknown) {
      console.error(
        'OpenAI request failed:',
        err instanceof Error ? err.message : err
      );
      return {};
    }
    console.log('OpenAI response:', resp.data.choices[0].message.content);

    // TODO: mapear resp.data a objeto JS
    return {};
  }

  // TODO: Implementar categorize con openAI para que retorne la categoria/cuenta
  // a la que la factura debería ir destinada
  async categorize() {
    return {};
  }
}
