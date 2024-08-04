import {Controller, Get} from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
    @Get()
    healthCheck() {
        return 'Payment MS is up and running!!';
    }
}
