import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create shipping methods
 * This sets up Standard and Express delivery options
 */
export class CreateShippingMethods1741797000000 implements MigrationInterface {
    name = 'CreateShippingMethods1741797000000';

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

        // If no shipping zone set, find or create Default Zone
        if (!shippingZoneId) {
            const zoneResult = await queryRunner.query(
                `SELECT id FROM zone WHERE name = 'Default Zone' LIMIT 1`
            );
            
            if (zoneResult.length > 0) {
                shippingZoneId = zoneResult[0].id;
                
                // Update channel
                await queryRunner.query(
                    `UPDATE channel SET "defaultShippingZoneId" = $1 WHERE id = $2`,
                    [shippingZoneId, channelId]
                );
                console.log(`✅ Set Default Shipping Zone for channel`);
            } else {
                console.log('⚠️ No shipping zone found. Please run the SetupDefaultTaxZone migration first.');
                return;
            }
        }

        // ========== 1. STANDARD DELIVERY ==========
        const existingStandard = await queryRunner.query(
            `SELECT id FROM shipping_method WHERE code = 'standard-delivery'`
        );

        if (existingStandard.length === 0) {
            // Create Standard Delivery (₦1,500 / $10)
            const standardResult = await queryRunner.query(
                `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
                 VALUES (NOW(), NOW(), 'standard-delivery', 'manual-fulfillment', 
                 '{"type": "flat-rate", "rate": 1500}'::jsonb, 
                 '{"type": "always-eligible"}'::jsonb)
                 RETURNING id`
            );

            const standardId = standardResult[0].id;

            // Add translation
            await queryRunner.query(
                `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
                 VALUES (NOW(), NOW(), 'en', 'Standard Delivery', 'Delivery within 1-3 business days', $1)`,
                [standardId]
            );

            // Link to channel
            await queryRunner.query(
                `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
                 VALUES ($1, $2)`,
                [standardId, channelId]
            );

            console.log(`✅ Created Standard Delivery (₦1,500 / $10)`);
        } else {
            console.log(`✅ Standard Delivery already exists`);
        }

        // ========== 2. EXPRESS DELIVERY ==========
        const existingExpress = await queryRunner.query(
            `SELECT id FROM shipping_method WHERE code = 'express-delivery'`
        );

        if (existingExpress.length === 0) {
            // Create Express Delivery (₦3,000 / $20)
            const expressResult = await queryRunner.query(
                `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
                 VALUES (NOW(), NOW(), 'express-delivery', 'manual-fulfillment', 
                 '{"type": "flat-rate", "rate": 3000}'::jsonb, 
                 '{"type": "always-eligible"}'::jsonb)
                 RETURNING id`
            );

            const expressId = expressResult[0].id;

            // Add translation
            await queryRunner.query(
                `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
                 VALUES (NOW(), NOW(), 'en', 'Express Delivery', 'Same-day delivery (order before 2 PM)', $1)`,
                [expressId]
            );

            // Link to channel
            await queryRunner.query(
                `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
                 VALUES ($1, $2)`,
                [expressId, channelId]
            );

            console.log(`✅ Created Express Delivery (₦3,000 / $20)`);
        } else {
            console.log(`✅ Express Delivery already exists`);
        }

        // ========== 3. FREE PICKUP ==========
        const existingPickup = await queryRunner.query(
            `SELECT id FROM shipping_method WHERE code = 'free-pickup'`
        );

        if (existingPickup.length === 0) {
            // Create Free Pickup (₦0)
            const pickupResult = await queryRunner.query(
                `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
                 VALUES (NOW(), NOW(), 'free-pickup', 'manual-fulfillment', 
                 '{"type": "flat-rate", "rate": 0}'::jsonb, 
                 '{"type": "always-eligible"}'::jsonb)
                 RETURNING id`
            );

            const pickupId = pickupResult[0].id;

            // Add translation
            await queryRunner.query(
                `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
                 VALUES (NOW(), NOW(), 'en', 'Free Pickup', 'Pick up from our Lagos store (free)', $1)`,
                [pickupId]
            );

            // Link to channel
            await queryRunner.query(
                `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
                 VALUES ($1, $2)`,
                [pickupId, channelId]
            );

            console.log(`✅ Created Free Pickup (₦0)`);
        } else {
            console.log(`✅ Free Pickup already exists`);
        }

        console.log('\n🎉 All shipping methods created successfully!');
        console.log('   - Standard Delivery: ₦1,500');
        console.log('   - Express Delivery: ₦3,000');
        console.log('   - Free Pickup: ₦0');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove shipping methods
        await queryRunner.query(`DELETE FROM shipping_method WHERE code IN ('standard-delivery', 'express-delivery', 'free-pickup')`);
        console.log('Removed shipping methods');
    }
}
