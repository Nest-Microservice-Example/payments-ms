import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './config';

const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

async function bootstrap() {
  const logger = new Logger(AppModule.name);

  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const PORT = config.get<number>(ConfigEnum.PORT, { infer: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(validationPipe);

  await app.listen(PORT);

  logger.log(`Payments Microservice running on port ${PORT}`);
}

bootstrap();
