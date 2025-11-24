import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResultToExceptionInterceptor } from './common/interceptors/result-to-exception.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResultToExceptionInterceptor());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4455',
    credentials: true,
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
