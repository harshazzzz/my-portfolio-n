import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AI_PROVIDER } from './ai-provider.js';
import { KnowledgeProvider } from './knowledge.provider.js';
import { ChatbotController } from './chatbot.controller.js';
import { ChatbotService } from './chatbot.service.js';
@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }])],
  controllers: [ChatbotController],
  providers: [
    ChatbotService,
    { provide: AI_PROVIDER, useClass: KnowledgeProvider },
  ],
})
export class ChatbotModule {}
