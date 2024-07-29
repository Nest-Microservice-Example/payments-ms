import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('stripe-create-session')
  public createSessionPayments() {
    return this.paymentsService.createSessionPayments();
  }

  @Post('stripe-webhook')
  public stripeWebhook() {
    return this.paymentsService.stripeWebhook();
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
