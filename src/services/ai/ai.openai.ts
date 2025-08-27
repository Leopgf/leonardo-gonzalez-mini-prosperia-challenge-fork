import axios, { AxiosError } from 'axios';
import { AiProvider } from './ai.interface.js';
import { aiCategorizePrompt, aiStructurePrompt } from './ai.aux.js';
import { categorize } from '../parsing/categorizer.js';
import { ParsedReceipt } from '../../types/receipt.js';

export class OpenAiProvider implements AiProvider {
  baseUrl: string;
  token: string;

  constructor() {
    this.baseUrl = process.env.OPENAI_BASE_URL || 'http://localhost:8080';
    this.token = process.env.PROSPERIA_TOKEN || '';
  }
  // categorize(input: {
  //   rawText: string;
  //   items?: ParsedReceipt['items'];
  // }): Promise<Partial<ParsedReceipt>> {
  //   throw new Error('Method not implemented.');
  // }

  async structure(rawText: string) {
    // El prompt puede venir de base de datos para que se pueda modificar en cualquier momento sin necesidad de realizar un deploy
    const prompt = aiStructurePrompt;

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

    let rawResp;

    try {
      rawResp = await axios.post(`${this.baseUrl}/openai/chat`, payload, {
        headers: { 'X-Prosperia-Token': this.token }
      });
    } catch (err: unknown) {
      console.error(
        'OpenAI request failed:',
        err instanceof AxiosError ? err.response?.data : err
      );
      return {};
    }

    const resp = rawResp?.data?.choices[0]?.message?.content;

    if (!resp) return {};

    const respJson = JSON.parse(resp);
    return respJson;
  }

  async getCategorize(rawText: string): Promise<number> {
    const prompt = await aiCategorizePrompt(rawText);

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a classification engine.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5
    };

    const rawResp = await axios.post(`${this.baseUrl}/openai/chat`, payload, {
      headers: { 'X-Prosperia-Token': this.token }
    });

    const resp = rawResp?.data?.choices[0]?.message?.content;
    if (!resp) return 0;

    const categoryId = await categorize(String(resp));

    if (!categoryId) return 0;

    return categoryId;
  }
}
