import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  public createSessionPayments() {
    return {
      name: 'createSessionPayments',
    };
  }

  public stripeWebhook() {
    return {
      name: 'createSessionPayments',
    };
  }

  public stripeSuccess() {
    return {
      ok: true,
      message: 'Payment successfully',
    };
  }

  public stripeCancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }
}
