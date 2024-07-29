export type StripeConfig = {
  secretKey: string;
  successUrl: string;
  cancelUrl: string;
};

export type Config = {
  port: number;
  stripe: StripeConfig;
};
