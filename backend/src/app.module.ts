import { ChatbotModule } from './chatbot/chatbot.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { BlogsModule } from './blogs/blogs.module.js';
import { AppConfigModule } from './config/config.module.js';
import { AuthModule } from './auth/auth.module.js';
import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    BlogsModule,
    ProjectsModule,
    MessagesModule,
    ChatbotModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ...(process.env.OBSERVE_APP_KEY && process.env.OBSERVE_APP_SECRET
      ? [ObserveModule.forRoot({
          appKey: process.env.OBSERVE_APP_KEY,
          appSecret: process.env.OBSERVE_APP_SECRET,
          serviceId: 'backend',
        })]
      : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
