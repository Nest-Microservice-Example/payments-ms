import { Config } from './config.type';
import * as process from 'node:process';

export default (): Config => ({
  port: parseInt(process.env.PORT || '3000', 10),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCELL_URL,
    endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
  },
});
