import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Устанавливаем путь для views
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));

  // Регистрируем папку для partials
  hbs.registerPartials(path.join(__dirname, '..', 'views/partials'));

  // Устанавливаем движок шаблонов
  app.setViewEngine('hbs');

  // Настроим статику
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  await app.listen(3000);
}
bootstrap();
