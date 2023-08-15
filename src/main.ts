import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.API_PORT;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(' Auto market API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('auto_market')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(PORT, () =>
    console.log(`Server successfully started on PORT ${PORT}`),
  );
}
bootstrap();
