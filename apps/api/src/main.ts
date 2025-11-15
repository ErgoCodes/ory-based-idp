import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4455',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 API running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
bootstrap();
