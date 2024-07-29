import { Config } from './config.type';

export default (): Config => ({
  port: parseInt(process.env.PORT || '3000', 10),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCELL_URL,
  },
});
