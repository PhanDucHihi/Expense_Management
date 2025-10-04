/* eslint-disable @typescript-eslint/no-floating-promises */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchEverythingFilter } from './filters/catch-everything.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin: frontend, // Frontend
    credentials: true, // CHÍNH TẢ đúng
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
