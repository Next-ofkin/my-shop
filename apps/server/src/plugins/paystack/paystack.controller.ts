import {
    Controller,
    Post,
    Body,
    Headers,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger, OrderService, PaymentService, TransactionalConnection } from '@vendure/core';
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
    private readonly logger = new Logger(PaystackController.name);

    constructor(
        private paystackService: PaystackService,
        private orderService: OrderService,
        private paymentService: PaymentService,
        private connection: TransactionalConnection,
    ) {}

    @Post('webhook')
    async handleWebhook(
        @Body() event: PaystackWebhookEvent,
        @Headers('x-paystack-signature') signature: string,
        @Res() res: Response,
    ) {
        this.logger.info(`Received Paystack webhook: ${event.event}`);

        // Verify webhook signature (security check)
        if (signature) {
            const rawBody = JSON.stringify(event);
            const isValid = this.paystackService.verifyWebhookSignature(rawBody, signature);
            
            if (!isValid) {
                this.logger.error('Invalid webhook signature');
                return res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
            }
        } else {
            this.logger.warn('No webhook signature provided - skipping verification (test mode)');
        }

        try {
            // Handle the webhook event
            const { success, reference } = this.paystackService.handleWebhook(event);

            if (success && event.event === 'charge.success') {
                await this.processSuccessfulPayment(event.data);
            }

            // Always return 200 to Paystack
            return res.status(HttpStatus.OK).send({ received: true });
        } catch (error) {
            this.logger.error(`Error processing webhook: ${error.message}`);
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
            this.logger.error('No orderId found in webhook metadata');
            return;
        }

        this.logger.info(`Processing successful payment for order ${orderId}, reference: ${reference}`);

        try {
            // Get the order
            const order = await this.orderService.findOne(this.connection.rawCtx, orderId);
            
            if (!order) {
                this.logger.error(`Order ${orderId} not found`);
                return;
            }

            // Find the payment with this Paystack reference
            const payment = order.payments.find(
                p => p.metadata?.paystackReference === reference
            );

            if (!payment) {
                this.logger.error(`Payment with reference ${reference} not found for order ${orderId}`);
                return;
            }

            // Settle the payment using the handler
            const result = await this.paymentService.settlePayment(
                this.connection.rawCtx,
                payment.id
            );

            if (result) {
                this.logger.info(`Payment ${payment.id} settled successfully`);
            } else {
                this.logger.error(`Failed to settle payment ${payment.id}`);
            }
        } catch (error) {
            this.logger.error(`Error processing payment: ${error.message}`);
        }
    }
}
