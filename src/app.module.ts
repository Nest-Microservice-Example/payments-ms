import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { PaymentsModule } from './payments/payments.module';
import {HealthCheckModule} from "./health-check/health-check.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PaymentsModule,
    HealthCheckModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
