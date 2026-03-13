import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Final setup migration - creates shipping methods with proper defaults
 */
export class FinalSetup1741799000000 implements MigrationInterface {
    name = 'FinalSetup1741799000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            // Get channel
            const channel = await queryRunner.query(
                `SELECT id, "defaultShippingZoneId" FROM channel LIMIT 1`
            );
            
            if (!channel.length) {
                console.log('No channel found');
                return;
            }

            const channelId = channel[0].id;
            let zoneId = channel[0].defaultShippingZoneId;

            // Create zone if needed
            if (!zoneId) {
                const zone = await queryRunner.query(`SELECT id FROM zone WHERE name = 'Default Zone' LIMIT 1`);
                if (zone.length) {
                    zoneId = zone[0].id;
                    await queryRunner.query(`UPDATE channel SET "defaultShippingZoneId" = $1 WHERE id = $2`, [zoneId, channelId]);
                }
            }

            if (!zoneId) {
                console.log('No shipping zone available');
                return;
            }

            // Check existing shipping methods
            const existing = await queryRunner.query(`SELECT code FROM shipping_method`);
            const existingCodes = existing.map((e: any) => e.code);

            // Create Standard Delivery if not exists
            if (!existingCodes.includes('standard-delivery')) {
                const sm = await queryRunner.query(
                    `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
                     VALUES (NOW(), NOW(), 'standard-delivery', 'manual-fulfillment', '{}', '{}') RETURNING id`
                );
                
                await queryRunner.query(
                    `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
                     VALUES (NOW(), NOW(), 'en', 'Standard Delivery', '1-3 business days', $1)`,
                    [sm[0].id]
                );

                await queryRunner.query(
                    `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId") VALUES ($1, $2)`,
                    [sm[0].id, channelId]
                );
                
                console.log('✅ Standard Delivery created');
            }

            // Create Express Delivery if not exists
            if (!existingCodes.includes('express-delivery')) {
                const sm = await queryRunner.query(
                    `INSERT INTO shipping_method ("createdAt", "updatedAt", code, "fulfillmentHandlerCode", calculator, checker)
                     VALUES (NOW(), NOW(), 'express-delivery', 'manual-fulfillment', '{}', '{}') RETURNING id`
                );
                
                await queryRunner.query(
                    `INSERT INTO shipping_method_translation ("createdAt", "updatedAt", "languageCode", name, description, "baseId")
                     VALUES (NOW(), NOW(), 'en', 'Express Delivery', 'Same-day delivery', $1)`,
                    [sm[0].id]
                );

                await queryRunner.query(
                    `INSERT INTO shipping_method_channels_channel ("shippingMethodId", "channelId") VALUES ($1, $2)`,
                    [sm[0].id, channelId]
                );
                
                console.log('✅ Express Delivery created');
            }

            console.log('✅ Setup complete');
        } catch (error: any) {
            console.error('Migration error:', error.message);
        }
    }

    public async down(): Promise<void> {
        // No down
    }
}
