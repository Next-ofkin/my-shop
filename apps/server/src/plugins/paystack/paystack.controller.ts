import {
    Controller,
    Post,
    Body,
    Headers,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger, OrderService, PaymentService, RequestContext } from '@vendure/core';
import { PaystackService } from './paystack.service';
import { PaystackWebhookEvent } from './types';

/**
 * Paystack Webhook Controller
 * 
 * Handles webhook events from Paystack.
 * URL: POST /paystack/webhook
 */
@Controller('paystack')
export class PaystackController {
    constructor(
        private paystackService: PaystackService,
        private orderService: OrderService,
        private paymentService: PaymentService,
    ) {}

    @Post('webhook')
    async handleWebhook(
        @Body() event: PaystackWebhookEvent,
        @Headers('x-paystack-signature') signature: string,
        @Res() res: Response,
    ) {
        Logger.info(`Received Paystack webhook: ${event.event}`, 'PaystackController');

        // Verify webhook signature (security check)
        if (signature) {
            const rawBody = JSON.stringify(event);
            const isValid = this.paystackService.verifyWebhookSignature(rawBody, signature);
            
            if (!isValid) {
                Logger.error('Invalid webhook signature', 'PaystackController');
                return res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
            }
        } else {
            Logger.warn('No webhook signature provided - skipping verification (test mode)', 'PaystackController');
        }

        try {
            // Handle the webhook event
            const { success, reference } = this.paystackService.handleWebhook(event);

            if (success && event.event === 'charge.success') {
                await this.processSuccessfulPayment(event.data);
            }

            // Always return 200 to Paystack
            return res.status(HttpStatus.OK).send({ received: true });
        } catch (error: any) {
            Logger.error(`Error processing webhook: ${error.message}`, 'PaystackController');
            // Still return 200 to prevent Paystack from retrying
            return res.status(HttpStatus.OK).send({ received: true, error: error.message });
        }
    }

    /**
     * Process a successful payment from Paystack webhook
     */
    private async processSuccessfulPayment(data: any): Promise<void> {
        const orderId = data.metadata?.orderId;
        const reference = data.reference;

        if (!orderId) {
            Logger.error('No orderId found in webhook metadata', 'PaystackController');
            return;
        }

        Logger.info(`Processing successful payment for order ${orderId}, reference: ${reference}`, 'PaystackController');

        try {
            // Create a request context
            const ctx = RequestContext.empty();
            
            // Get the order
            const order = await this.orderService.findOne(ctx, orderId);
            
            if (!order) {
                Logger.error(`Order ${orderId} not found`, 'PaystackController');
                return;
            }

            // Find the payment with this Paystack reference
            const payment = order.payments.find(
                (p: any) => p.metadata?.paystackReference === reference
            );

            if (!payment) {
                Logger.error(`Payment with reference ${reference} not found for order ${orderId}`, 'PaystackController');
                return;
            }

            // Settle the payment using the handler
            const result = await this.paymentService.settlePayment(
                ctx,
                payment.id
            );

            if (result) {
                Logger.info(`Payment ${payment.id} settled successfully`, 'PaystackController');
            } else {
                Logger.error(`Failed to settle payment ${payment.id}`, 'PaystackController');
            }
        } catch (error: any) {
            Logger.error(`Error processing payment: ${error.message}`, 'PaystackController');
        }
    }
}
