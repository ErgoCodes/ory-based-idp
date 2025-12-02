import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResultToExceptionInterceptor } from './common/interceptors/result-to-exception.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResultToExceptionInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8362',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie'], // Important for cookie debugging
  });

  const config = new DocumentBuilder()
    .setTitle('Ory-based Identity Provider API')
    .setDescription(
      'API for managing users, OAuth2 clients, and authentication',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
