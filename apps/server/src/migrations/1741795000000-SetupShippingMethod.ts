import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to set up default shipping method
 * This creates a standard delivery option for the store
 */
export class SetupShippingMethod1741795000000 implements MigrationInterface {
    name = 'SetupShippingMethod1741795000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get the default channel
        const channelResult = await queryRunner.query(
            `SELECT id, "defaultShippingZoneId" FROM channel WHERE code = '__default_channel__' LIMIT 1`
        );

        if (channelResult.length === 0) {
            console.log('⚠️ No default channel found');
            return;
        }

        const channelId = channelResult[0].id;
        let shippingZoneId = channelResult[0].defaultShippingZoneId;

        // If no shipping zone, create one
        if (!shippingZoneId) {
            // Check if Default Zone exists
            const zoneResult = await queryRunner.query(
                `SELECT id FROM zone WHERE name = 'Default Zone' LIMIT 1`
            );
            
            if (zoneResult.length > 0) {
                shippingZoneId = zoneResult[0].id;
                
                // Update channel with this zone
                await queryRunner.query(
                    `UPDATE channel SET "defaultShippingZoneId" = $1 WHERE id = $2`,
                    [shippingZoneId, channelId]
                );
                console.log(`✅ Set Default Shipping Zone for channel`);
            }
        }

        if (!shippingZoneId) {
            console.log('⚠️ No shipping zone available');
            return;
        }

        // Check if shipping method already exists
        const existingMethod = await queryRunner.query(
            `SELECT id FROM shipping_method WHERE code = 'standard-delivery'`
        );

        if (existingMethod.length > 0) {
            console.log(`✅ Standard Delivery shipping method already exists`);
            return;
        }

        // Create shipping method
        const shippingMethodResult = await queryRunner.query(
            `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
             VALUES (NOW(), NOW(), 'standard-delivery', 'manual-fulfillment', '{}', '{}')
             RETURNING id`
        );

        const shippingMethodId = shippingMethodResult[0].id;
        console.log(`✅ Created Standard Delivery shipping method`);

        // Add translation
        await queryRunner.query(
            `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
             VALUES (NOW(), NOW(), 'en', 'Standard Delivery', 'Delivery within 1-3 business days', $1)`,
            [shippingMethodId]
        );

        // Link to channel
        await queryRunner.query(
            `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
             VALUES ($1, $2)`,
            [shippingMethodId, channelId]
        );
        console.log(`✅ Linked shipping method to channel`);

        // Check for Paystack payment method
        const existingPaymentMethod = await queryRunner.query(
            `SELECT id FROM payment_method WHERE code = 'paystack'`
        );

        if (existingPaymentMethod.length === 0) {
            // Create Paystack payment method
            const paymentMethodResult = await queryRunner.query(
                `INSERT INTO payment_method ("createdAt", "updatedAt", code, enabled, handler)
                 VALUES (NOW(), NOW(), 'paystack', true, '{}')
                 RETURNING id`
            );

            const paymentMethodId = paymentMethodResult[0].id;
            console.log(`✅ Created Paystack payment method`);

            // Add translation
            await queryRunner.query(
                `INSERT INTO payment_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
                 VALUES (NOW(), NOW(), 'en', 'Paystack', 'Pay with Card, Bank Transfer, or USSD', $1)`,
                [paymentMethodId]
            );

            // Link to channel
            await queryRunner.query(
                `INSERT INTO payment_method_channels_channel ("paymentMethodId", "channelId")
                 VALUES ($1, $2)`,
                [paymentMethodId, channelId]
            );
            console.log(`✅ Linked Paystack payment method to channel`);
        } else {
            console.log(`✅ Paystack payment method already exists`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('Down migration not implemented - manual cleanup required');
    }
}
