import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as hbs from 'hbs';
import * as methodOverride from 'method-override';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './car/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TimingInterceptor } from './timing.interceptor';
import { ETagMiddleware } from './etag.middleware';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import supertokens from 'supertokens-node'; // Импортируем middleware

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));

  hbs.registerPartials(path.join(process.cwd(), 'views/partials'));
  console.log('Partials registered successfully');

  app.setViewEngine('hbs');

  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  app.use(methodOverride('_method'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Добавляем ETagMiddleware
  app.use(new ETagMiddleware().use);

  // Оставляем только TimingInterceptor
  app.useGlobalInterceptors(new TimingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Car API')
    .setDescription('Документация REST API для автомобилей')
    .setVersion('1.0')
    .addTag('cars')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
