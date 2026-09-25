import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Header,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { MessagesService } from './messages.service.js';
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}
  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Header('Cache-Control', 'no-store')
  create(@Body() dto: CreateMessageDto) {
    return this.messages.create(dto);
  }
  @Get() @UseGuards(JwtAuthGuard) @Header('Cache-Control', 'no-store') all() {
    return this.messages.all();
  }
  @Get(':id') @UseGuards(JwtAuthGuard) @Header('Cache-Control', 'no-store') one(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.messages.one(id);
  }
  @Patch(':id/read') @UseGuards(JwtAuthGuard) read(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.messages.read(id);
  }
  @Delete(':id') @UseGuards(JwtAuthGuard) remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.messages.remove(id);
  }
}
