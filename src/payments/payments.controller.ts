import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('stripe-create-session')
  public createSessionPayments() {
    return {
      name: 'createSessionPayments',
    };
  }

  @Post('stripe-webhook')
  public stripeWebhook() {
    return {
      name: 'createSessionPayments',
    };
  }

  @Get('stripe-success')
  public stripeSuccess() {
    return {
      ok: true,
      message: 'Payment successfully',
    };
  }

  @Get('stripe-cancel')
  public stripeCancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }
}
