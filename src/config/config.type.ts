export type StripeConfig = {
  secretKey: string;
  successUrl: string;
  cancelUrl: string;
  endpointSecret: string;
};

export type Config = {
  port: number;
  stripe: StripeConfig;
};
