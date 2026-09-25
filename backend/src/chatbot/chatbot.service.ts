import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER, type AIProvider } from './ai-provider.js';
@Injectable()
export class ChatbotService {
  constructor(@Inject(AI_PROVIDER) private readonly provider: AIProvider) {}
  async message(message: string) {
    return { answer: await this.provider.answer(message) };
  }
}
