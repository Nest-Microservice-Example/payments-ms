import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import {PaymentsService} from './payments.service';
import {PaymentSessionDto} from './dto';
import {Request, Response} from 'express';
import {MessagePattern} from "@nestjs/microservices";

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {
    }

    @MessagePattern('stripe.create.session')
    public createSessionPayments(@Body() payload: PaymentSessionDto) {
        return this.paymentsService.createSessionPayments(payload);
    }

    @Post('stripe-webhook')
    public stripeWebhook(@Req() req: Request, @Res() res: Response) {
        return this.paymentsService.stripeWebhook(req, res);
    }

    @Get('stripe-success')
    public stripeSuccess() {
        return this.paymentsService.stripeSuccess();
    }

    @Get('stripe-cancel')
    public stripeCancel() {
        return this.paymentsService.stripeCancel();
    }
}
