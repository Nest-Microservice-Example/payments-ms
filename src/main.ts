import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ConfigEnum} from './config';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {RequestMethod} from "@nestjs/common/enums/request-method.enum";

const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
});

async function bootstrap() {
    const logger = new Logger(AppModule.name);

    const app = await NestFactory.create(AppModule, {rawBody: true});

    const config = app.get(ConfigService);

    const PORT = config.get<number>(ConfigEnum.PORT, {infer: true});
    const NATS = config.get<string[]>(ConfigEnum.NATS, {infer: true});

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.NATS,
        options: {
            servers: NATS
        }
    }, {
        inheritAppConfig: true
    })

    app.setGlobalPrefix('api', {
        exclude: [{
            path: '',
            method: RequestMethod.GET
        }],
    });

    app.useGlobalPipes(validationPipe);

    await app.startAllMicroservices();

    await app.listen(PORT);

    logger.log(`Payments Microservice running on port ${PORT}`);
}

bootstrap();
