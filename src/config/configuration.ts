import {Config} from './config.type';

export default (): Config => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nats: process.env.NATS_SERVERS.split(','),
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        successUrl: process.env.STRIPE_SUCCESS_URL,
        cancelUrl: process.env.STRIPE_CANCEL_URL,
        endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
    },
});
