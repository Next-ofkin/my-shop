import {
    CreatePaymentResult,
    LanguageCode,
    PaymentMethodHandler,
    SettlePaymentResult,
    SettlePaymentErrorResult,
} from '@vendure/core';
import { PaystackService } from './paystack.service';

/**
 * Paystack Payment Method Handler
 * 
 * This handler integrates Paystack with Vendure's payment system.
 * It supports both NGN and USD currencies.
 * 
 * How it works:
 * 1. Customer selects Paystack at checkout
 * 2. createPayment() is called - initializes Paystack transaction
 * 3. Customer is redirected to Paystack checkout page
 * 4. After payment, Paystack sends webhook to /paystack/webhook
 * 5. Webhook handler calls settlePayment() to complete the order
 */

export const paystackPaymentHandler = new PaymentMethodHandler({
    code: 'paystack',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Paystack Payment - Supports Card, Bank Transfer, USSD, and Mobile Money',
        },
    ],
    
    args: {
        // No args needed - config comes from environment variables
    },

    /**
     * Create a payment - initializes Paystack transaction
     */
    createPayment: async (
        ctx,
        order,
        amount,
        args,
        metadata
    ): Promise<CreatePaymentResult> => {
        const paystackService: PaystackService = (global as any).paystackService;
        
        if (!paystackService) {
            return {
                amount: order.total,
                state: 'Cancelled',
                metadata: {
                    errorMessage: 'Paystack service not initialized',
                },
            };
        }

        try {
            // Convert amount to kobo (NGN) or cents (USD)
            // Paystack expects amount in smallest currency unit
            const currency = order.currencyCode as 'NGN' | 'USD';
            const amountInSmallestUnit = currency === 'NGN' 
                ? Math.round(amount * 100) // kobo
                : Math.round(amount * 100); // cents

            // Generate unique reference
            const reference = `ORDER_${order.id}_${Date.now()}`;

            // Get customer email
            const customerEmail = order.customer?.emailAddress || 'guest@example.com';

            // Initialize transaction
            const result = await paystackService.initializeTransaction({
                email: customerEmail,
                amount: amountInSmallestUnit,
                currency,
                reference,
                metadata: {
                    orderId: order.id,
                    orderCode: order.code,
                    customerEmail,
                },
            });

            return {
                amount: order.total,
                state: 'Authorized', // Authorized means pending customer action
                metadata: {
                    paystackReference: reference,
                    authorizationUrl: result.data.authorization_url,
                    accessCode: result.data.access_code,
                    // Return the URL for frontend to redirect customer
                    redirectUrl: result.data.authorization_url,
                },
            };
        } catch (error: any) {
            return {
                amount: order.total,
                state: 'Cancelled',
                metadata: {
                    errorMessage: error.message,
                },
            };
        }
    },

    /**
     * Settle payment - called by webhook when payment is confirmed
     */
    settlePayment: async (
        ctx,
        order,
        payment,
        args
    ): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
        const paystackService: PaystackService = (global as any).paystackService;
        
        if (!paystackService) {
            return {
                success: false,
                metadata: {
                    errorMessage: 'Paystack service not initialized',
                },
            };
        }

        try {
            const reference = payment.metadata.paystackReference;
            
            if (!reference) {
                return {
                    success: false,
                    metadata: {
                        errorMessage: 'No Paystack reference found',
                    },
                };
            }

            // Verify transaction with Paystack
            const result = await paystackService.verifyTransaction(reference);

            if (result.status && result.data.status === 'success') {
                return {
                    success: true,
                    metadata: {
                        paystackTransactionId: result.data.id,
                        paystackReference: result.data.reference,
                        gatewayResponse: result.data.gateway_response,
                        paidAt: result.data.paid_at,
                        channel: result.data.channel,
                        authorizationCode: result.data.authorization?.authorization_code,
                    },
                };
            } else {
                return {
                    success: false,
                    metadata: {
                        errorMessage: `Payment verification failed: ${result.message}`,
                        paystackStatus: result.data?.status,
                    },
                };
            }
        } catch (error: any) {
            return {
                success: false,
                metadata: {
                    errorMessage: error.message,
                },
            };
        }
    },
});
