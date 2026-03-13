import { PluginCommonModule, VendurePlugin, Logger } from '@vendure/core';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { paystackPaymentHandler } from './paystack.handler';
import { PaystackConfig } from './types';

/**
 * Paystack Plugin for Vendure
 * 
 * This plugin enables Paystack payments in your Vendure store.
 * 
 * Features:
 * - Support for NGN and USD currencies
 * - Multiple payment methods (card, bank transfer, USSD, mobile money)
 * - Webhook handling for automatic payment confirmation
 * - Secure signature verification
 * 
 * Configuration:
 * Set these environment variables:
 * - PAYSTACK_SECRET_KEY: Your Paystack secret key
 * - PAYSTACK_PUBLIC_KEY: Your Paystack public key
 * 
 * Usage:
 * 1. Install and configure the plugin
 * 2. Add Paystack as a payment method in Admin UI
 * 3. Set up webhook URL in Paystack dashboard: https://your-server.com/paystack/webhook
 */

export interface PaystackPluginOptions {
    secretKey: string;
    publicKey: string;
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [PaystackController],
    providers: [
        {
            provide: PaystackService,
            useFactory: () => {
                const secretKey = process.env.PAYSTACK_SECRET_KEY;
                const publicKey = process.env.PAYSTACK_PUBLIC_KEY;

                if (!secretKey) {
                    Logger.warn(
                        'PAYSTACK_SECRET_KEY not set. Paystack payments will not work. Add this environment variable to enable Paystack.',
                        'PaystackPlugin'
                    );
                    // Return a dummy service that will fail gracefully
                    const dummyService = new PaystackService({
                        secretKey: 'dummy_key',
                        publicKey: publicKey || '',
                        callbackUrl: process.env.PAYSTACK_CALLBACK_URL || '',
                    });
                    (global as any).paystackService = dummyService;
                    return dummyService;
                }

                // Store service globally so handler can access it
                const service = new PaystackService({
                    secretKey,
                    publicKey: publicKey || '',
                    callbackUrl: process.env.PAYSTACK_CALLBACK_URL || '',
                });

                (global as any).paystackService = service;

                Logger.info('Paystack plugin initialized successfully', 'PaystackPlugin');

                return service;
            },
        },
    ],
    configuration: (config) => {
        // Add payment method handler
        config.paymentOptions = {
            ...config.paymentOptions,
            paymentMethodHandlers: [
                ...(config.paymentOptions?.paymentMethodHandlers || []),
                paystackPaymentHandler,
            ],
        };

        return config;
    },
})
export class PaystackPlugin {
    static init(options?: PaystackPluginOptions) {
        // Options can be passed here or set via environment variables
        if (options?.secretKey) {
            process.env.PAYSTACK_SECRET_KEY = options.secretKey;
        }
        if (options?.publicKey) {
            process.env.PAYSTACK_PUBLIC_KEY = options.publicKey;
        }
        return PaystackPlugin;
    }
}
