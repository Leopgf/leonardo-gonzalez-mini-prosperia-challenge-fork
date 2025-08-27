import { ParsedReceipt } from "../../types/receipt.js";
export interface AiProvider {
  structure(rawText: string): Promise<Partial<ParsedReceipt>>;
  getCategorize(rawText: string): Promise<number>;
}
