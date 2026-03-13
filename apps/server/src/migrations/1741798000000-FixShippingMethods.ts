import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix shipping methods
 * Creates shipping methods with proper configuration
 */
export class FixShippingMethods1741798000000 implements MigrationInterface {
    name = 'FixShippingMethods1741798000000';

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

        // If no shipping zone, find Default Zone
        if (!shippingZoneId) {
            const zoneResult = await queryRunner.query(
                `SELECT id FROM zone WHERE name = 'Default Zone' LIMIT 1`
            );
            
            if (zoneResult.length > 0) {
                shippingZoneId = zoneResult[0].id;
                
                await queryRunner.query(
                    `UPDATE channel SET "defaultShippingZoneId" = $1 WHERE id = $2`,
                    [shippingZoneId, channelId]
                );
                console.log(`✅ Set Default Shipping Zone for channel`);
            } else {
                console.log('⚠️ No Default Zone found');
                return;
            }
        }

        console.log(`Using shipping zone ID: ${shippingZoneId}`);

        // Delete existing shipping methods to recreate them properly
        await queryRunner.query(`DELETE FROM shipping_method_translation WHERE "baseId" IN (
            SELECT id FROM shipping_method WHERE code IN ('standard-delivery', 'express-delivery', 'free-pickup')
        )`);
        await queryRunner.query(`DELETE FROM shipping_method_channels_channel WHERE "shippingMethodId" IN (
            SELECT id FROM shipping_method WHERE code IN ('standard-delivery', 'express-delivery', 'free-pickup')
        )`);
        await queryRunner.query(`DELETE FROM shipping_method WHERE code IN ('standard-delivery', 'express-delivery', 'free-pickup')`);
        console.log('✅ Cleaned up existing shipping methods');

        // ========== 1. STANDARD DELIVERY ==========
        const standardResult = await queryRunner.query(
            `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
             VALUES (NOW(), NOW(), 'standard-delivery', 'manual-fulfillment', '{}', '{}')
             RETURNING id`
        );

        const standardId = standardResult[0].id;

        await queryRunner.query(
            `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
             VALUES (NOW(), NOW(), 'en', 'Standard Delivery', 'Delivery within 1-3 business days', $1)`,
            [standardId]
        );

        await queryRunner.query(
            `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
             VALUES ($1, $2)`,
            [standardId, channelId]
        );

        console.log(`✅ Created Standard Delivery`);

        // ========== 2. EXPRESS DELIVERY ==========
        const expressResult = await queryRunner.query(
            `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
             VALUES (NOW(), NOW(), 'express-delivery', 'manual-fulfillment', '{}', '{}')
             RETURNING id`
        );

        const expressId = expressResult[0].id;

        await queryRunner.query(
            `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
             VALUES (NOW(), NOW(), 'en', 'Express Delivery', 'Same-day delivery (order before 2 PM)', $1)`,
            [expressId]
        );

        await queryRunner.query(
            `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
             VALUES ($1, $2)`,
            [expressId, channelId]
        );

        console.log(`✅ Created Express Delivery`);

        // ========== 3. FREE PICKUP ==========
        const pickupResult = await queryRunner.query(
            `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
             VALUES (NOW(), NOW(), 'free-pickup', 'manual-fulfillment', '{}', '{}')
             RETURNING id`
        );

        const pickupId = pickupResult[0].id;

        await queryRunner.query(
            `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
             VALUES (NOW(), NOW(), 'en', 'Free Pickup', 'Pick up from our Lagos store', $1)`,
            [pickupId]
        );

        await queryRunner.query(
            `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId")
             VALUES ($1, $2)`,
            [pickupId, channelId]
        );

        console.log(`✅ Created Free Pickup`);

        // Verify zone has countries
        const zoneMembers = await queryRunner.query(
            `SELECT * FROM zone_members_region WHERE "zoneId" = $1`,
            [shippingZoneId]
        );
        console.log(`✅ Zone has ${zoneMembers.length} countries/regions`);

        console.log('\n🎉 Shipping methods created! Refresh your checkout page.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM shipping_method WHERE code IN ('standard-delivery', 'express-delivery', 'free-pickup')`);
    }
}
