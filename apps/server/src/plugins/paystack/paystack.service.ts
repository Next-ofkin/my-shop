import { Injectable } from '@nestjs/common';
import { Logger } from '@vendure/core';
import {
    PaystackConfig,
    PaystackInitializeResponse,
    PaystackVerifyResponse,
    PaystackWebhookEvent,
} from './types';

@Injectable()
export class PaystackService {
    private readonly baseUrl = 'https://api.paystack.co';

    constructor(private config: PaystackConfig) {}

    /**
     * Initialize a transaction with Paystack
     */
    async initializeTransaction(params: {
        email: string;
        amount: number; // in kobo (NGN) or cents (USD)
        currency: 'NGN' | 'USD';
        reference: string;
        metadata?: Record<string, any>;
    }): Promise<PaystackInitializeResponse> {
        const { email, amount, currency, reference, metadata } = params;

        try {
            const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.config.secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    amount,
                    currency,
                    reference,
                    metadata,
                    callback_url: this.config.callbackUrl,
                }),
            });

            const data = await response.json();
            
            if (!data.status) {
                Logger.error(`Paystack initialization failed: ${data.message}`, 'PaystackService');
                throw new Error(data.message);
            }

            return data;
        } catch (error: any) {
            Logger.error(`Failed to initialize Paystack transaction: ${error.message}`, 'PaystackService');
            throw error;
        }
    }

    /**
     * Verify a transaction with Paystack
     */
    async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/transaction/verify/${reference}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${this.config.secretKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();
            return data;
        } catch (error: any) {
            Logger.error(`Failed to verify Paystack transaction: ${error.message}`, 'PaystackService');
            throw error;
        }
    }

    /**
     * Handle webhook events from Paystack
     */
    handleWebhook(event: PaystackWebhookEvent): { success: boolean; reference: string } {
        const { event: eventType, data } = event;

        Logger.info(`Received Paystack webhook: ${eventType}`, 'PaystackService');

        switch (eventType) {
            case 'charge.success':
                return { success: true, reference: data.reference };
            case 'charge.failed':
                Logger.warn(`Payment failed for reference: ${data.reference}`);
                return { success: false, reference: data.reference };
            default:
                Logger.info(`Unhandled webhook event: ${eventType}`);
                return { success: false, reference: data.reference };
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(body: string, signature: string): boolean {
        const crypto = require('crypto');
        const hash = crypto
            .createHmac('sha512', this.config.secretKey)
            .update(body)
            .digest('hex');
        
        return hash === signature;
    }
}
