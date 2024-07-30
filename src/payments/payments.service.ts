import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ConfigEnum, StripeConfig } from '../config';
import { PaymentSessionDto } from './dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly configStripe: StripeConfig;

  constructor(private readonly _config: ConfigService) {
    this.configStripe = this._config.get<StripeConfig>(ConfigEnum.STRIPE);

    this.stripe = new Stripe(this.configStripe.secretKey);
  }

  public async createSessionPayments(payload: PaymentSessionDto) {
    const { currency, orderId, items } = payload;

    const lineItems = items.map((product) => ({
      quantity: product.quantity,
      price_data: {
        currency: currency,
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100),
      },
    }));

    const stripeSession = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      payment_intent_data: {
        metadata: { orderId },
      },
      locale: 'es',
      mode: 'payment',
      success_url: this.configStripe.successUrl,
      cancel_url: this.configStripe.cancelUrl,
    });

    return {
      name: 'createSessionPayments',
      stripeSession,
    };
  }

  public stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      const { endpointSecret } = this.configStripe;

      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;

        console.log({
          metadata: chargeSucceeded.metadata,
          orderId: chargeSucceeded.metadata.orderId,
        });
        break;
      default:
        break;
    }

    return res.status(200).json({ sig, event });
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
