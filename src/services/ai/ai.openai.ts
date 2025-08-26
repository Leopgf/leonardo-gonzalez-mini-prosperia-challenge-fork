import axios from 'axios';
import { AiProvider } from './ai.interface.js';
import { aiPrompt } from './ai.mock.js';

export class OpenAiProvider implements AiProvider {
  baseUrl: string;
  token: string;

  constructor() {
    this.baseUrl = process.env.OPENAI_BASE_URL || 'http://localhost:8080';
    this.token = process.env.PROSPERIA_TOKEN || '';
  }

  // TODO: Implementar extracción de información con IA del rawText
  async structure(rawText: string) {
    // El prompt puede venir de base de datos para que se pueda modificar en cualquier momento sin necesidad de realizar un deploy
    const prompt = aiPrompt;

    const payload = {
      // No cambiar modelo. Solo 4o-mini funciona
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt
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

    if (!resp) return {};

    return {};
  }

  // TODO: Implementar categorize con openAI para que retorne la categoria/cuenta
  // a la que la factura debería ir destinada
  async categorize() {
    return {};
  }
}
