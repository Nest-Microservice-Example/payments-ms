import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Stripe from 'stripe';
import {ConfigEnum, NATS_SERVICE, StripeConfig} from '../config';
import {PaymentSessionDto} from './dto';
import {Request, Response} from 'express';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class PaymentsService {
    private readonly stripe: Stripe;
    private readonly configStripe: StripeConfig;

    constructor(
        private readonly _config: ConfigService,
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) {
        this.configStripe = this._config.get<StripeConfig>(ConfigEnum.STRIPE);

        this.stripe = new Stripe(this.configStripe.secretKey);
    }

    public async createSessionPayments(payload: PaymentSessionDto) {
        const {currency, orderId, items} = payload;

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
                metadata: {orderId},
            },
            locale: 'es',
            mode: 'payment',
            success_url: this.configStripe.successUrl,
            cancel_url: this.configStripe.cancelUrl,
        });

        return {
            cancelUrl: stripeSession.cancel_url,
            successUrl: stripeSession.success_url,
            url: stripeSession.url,
        };
    }

    public stripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            const {endpointSecret} = this.configStripe;

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

                const payload = {
                    stripePaymentId: chargeSucceeded.id,
                    orderId: chargeSucceeded.metadata.orderId,
                    receiptUrl: chargeSucceeded.receipt_url,
                }

                this.client.emit('payment.succeeded', payload)
                break;
            default:
                break;
        }

        return res.status(200).json({sig, event});
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
