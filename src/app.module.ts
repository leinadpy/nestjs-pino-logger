import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from './correlation-id/correlation-id.middleware';
import { Request } from 'express';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                  colorize: true,
                  levelFirst: true,
                  singleLine: true,
                  colorizeObjects: true,
                },
              },
        messageKey: 'message',
        customProps: (req: Request) => ({
          correlationId: req[CORRELATION_ID_HEADER],
        }),
        /* autoLogging: false, */
        serializers: {
          req: (req) => {
            return {
              method: req.method,
              url: req.url,
              params: req.params,
              body: req.raw.body,
              headers: req.headers,
            };
          },
          /* res: () => undefined, */
        },
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
