import { AIProvider } from './types.ts';
import { GeminiProvider } from './gemini-provider.ts';

let currentProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!currentProvider) {
    currentProvider = new GeminiProvider();
  }
  return currentProvider;
}

export function setAIProvider(provider: AIProvider): void {
  currentProvider = provider;
}
