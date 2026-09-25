import { Body, Controller, Header, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ChatbotService } from './chatbot.service.js';
import { MessageDto } from './dto/message.dto.js';
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbot: ChatbotService) {}
  @Post('message')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Header('Cache-Control', 'no-store')
  message(@Body() dto: MessageDto) {
    return this.chatbot.message(dto.message);
  }
}
