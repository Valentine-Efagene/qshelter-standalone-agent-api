import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { QueryFailedFilter } from './common/common.error';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  //app.setGlobalPrefix('agent/api');
  app.enableCors();

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: false,
    }),
  );

  // Register MySQL exception filter globally
  app.useGlobalFilters(new QueryFailedFilter());

  const config = new DocumentBuilder()
    .setTitle('Agents')
    .setDescription('The API for Agents')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
