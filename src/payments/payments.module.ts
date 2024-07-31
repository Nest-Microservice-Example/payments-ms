import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PaymentsService} from './payments.service';
import {PaymentsController} from './payments.controller';
import {NatsModule} from "../transports/nats/nats.module";

@Module({
    imports: [ConfigModule, NatsModule],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {
}
