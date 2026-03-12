import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to set up default tax zone and rate
 * This runs automatically to fix the "active tax zone could not be determined" error
 */
export class SetupDefaultTaxZone1741794000000 implements MigrationInterface {
    name = 'SetupDefaultTaxZone1741794000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Nigeria region if it doesn't exist
        let nigeriaRegionId: number;
        const existingNigeria = await queryRunner.query(
            `SELECT id FROM region WHERE code = 'NG'`
        );

        if (existingNigeria.length === 0) {
            const regionResult = await queryRunner.query(
                `INSERT INTO region ("createdAt", "updatedAt", code, type, enabled, "discriminator") 
                 VALUES (NOW(), NOW(), 'NG', 'country', true, 'country')
                 RETURNING id`
            );
            nigeriaRegionId = regionResult[0].id;
            
            // Add Nigeria translation
            await queryRunner.query(
                `INSERT INTO region_translation ("createdAt", "updatedAt", "languageCode", name, "baseId")
                 VALUES (NOW(), NOW(), 'en', 'Nigeria', $1)`,
                [nigeriaRegionId]
            );
            console.log(`✅ Created Nigeria region with ID: ${nigeriaRegionId}`);
        } else {
            nigeriaRegionId = existingNigeria[0].id;
            console.log(`✅ Nigeria region already exists with ID: ${nigeriaRegionId}`);
        }

        // Create USA region if it doesn't exist
        let usaRegionId: number;
        const existingUSA = await queryRunner.query(
            `SELECT id FROM region WHERE code = 'US'`
        );

        if (existingUSA.length === 0) {
            const regionResult = await queryRunner.query(
                `INSERT INTO region ("createdAt", "updatedAt", code, type, enabled, "discriminator") 
                 VALUES (NOW(), NOW(), 'US', 'country', true, 'country')
                 RETURNING id`
            );
            usaRegionId = regionResult[0].id;
            
            // Add USA translation
            await queryRunner.query(
                `INSERT INTO region_translation ("createdAt", "updatedAt", "languageCode", name, "baseId")
                 VALUES (NOW(), NOW(), 'en', 'United States', $1)`,
                [usaRegionId]
            );
            console.log(`✅ Created USA region with ID: ${usaRegionId}`);
        } else {
            usaRegionId = existingUSA[0].id;
            console.log(`✅ USA region already exists with ID: ${usaRegionId}`);
        }

        // Check if zone already exists
        const existingZone = await queryRunner.query(
            `SELECT id FROM zone WHERE name = 'Default Zone'`
        );

        let zoneId: number;

        if (existingZone.length === 0) {
            // Create a default zone
            const zoneResult = await queryRunner.query(
                `INSERT INTO zone ("createdAt", "updatedAt", name) 
                 VALUES (NOW(), NOW(), 'Default Zone') 
                 RETURNING id`
            );
            zoneId = zoneResult[0].id;
            console.log(`✅ Created Default Zone with ID: ${zoneId}`);
        } else {
            zoneId = existingZone[0].id;
            console.log(`✅ Default Zone already exists with ID: ${zoneId}`);
        }

        // Add Nigeria to the zone
        const existingNigeriaMember = await queryRunner.query(
            `SELECT * FROM zone_members_region WHERE "zoneId" = $1 AND "regionId" = $2`,
            [zoneId, nigeriaRegionId]
        );

        if (existingNigeriaMember.length === 0) {
            await queryRunner.query(
                `INSERT INTO zone_members_region ("zoneId", "regionId") 
                 VALUES ($1, $2)`,
                [zoneId, nigeriaRegionId]
            );
            console.log(`✅ Added Nigeria to Default Zone`);
        }

        // Add USA to the zone
        const existingUSAMember = await queryRunner.query(
            `SELECT * FROM zone_members_region WHERE "zoneId" = $1 AND "regionId" = $2`,
            [zoneId, usaRegionId]
        );

        if (existingUSAMember.length === 0) {
            await queryRunner.query(
                `INSERT INTO zone_members_region ("zoneId", "regionId") 
                 VALUES ($1, $2)`,
                [zoneId, usaRegionId]
            );
            console.log(`✅ Added USA to Default Zone`);
        }

        // Check if tax category exists
        let taxCategoryId: number;
        const existingCategory = await queryRunner.query(
            `SELECT id FROM tax_category WHERE "isDefault" = true`
        );

        if (existingCategory.length === 0) {
            const categoryResult = await queryRunner.query(
                `INSERT INTO tax_category ("createdAt", "updatedAt", name, "isDefault") 
                 VALUES (NOW(), NOW(), 'Standard', true) 
                 RETURNING id`
            );
            taxCategoryId = categoryResult[0].id;
            console.log(`✅ Created Standard Tax Category with ID: ${taxCategoryId}`);
        } else {
            taxCategoryId = existingCategory[0].id;
            console.log(`✅ Standard Tax Category already exists with ID: ${taxCategoryId}`);
        }

        // Create or update tax rate with 7.5%
        const existingRate = await queryRunner.query(
            `SELECT id FROM tax_rate WHERE name = 'Default Tax Rate'`
        );

        if (existingRate.length === 0) {
            await queryRunner.query(
                `INSERT INTO tax_rate ("createdAt", "updatedAt", name, enabled, value, "categoryId", "zoneId") 
                 VALUES (NOW(), NOW(), 'Default Tax Rate', true, 7.50, $1, $2)`,
                [taxCategoryId, zoneId]
            );
            console.log(`✅ Created Default Tax Rate (7.5%)`);
        } else {
            // Update existing rate to 7.5%
            await queryRunner.query(
                `UPDATE tax_rate SET value = 7.50 WHERE id = $1`,
                [existingRate[0].id]
            );
            console.log(`✅ Updated Default Tax Rate to 7.5%`);
        }

        // Update channel to use this zone as default tax zone
        await queryRunner.query(
            `UPDATE channel 
             SET "defaultTaxZoneId" = $1 
             WHERE "defaultTaxZoneId" IS NULL`,
            [zoneId]
        );
        console.log(`✅ Set Default Tax Zone for channel`);

        // Also set default shipping zone if not set
        await queryRunner.query(
            `UPDATE channel 
             SET "defaultShippingZoneId" = $1 
             WHERE "defaultShippingZoneId" IS NULL`,
            [zoneId]
        );
        console.log(`✅ Set Default Shipping Zone for channel`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes if needed
        console.log('Down migration not implemented - manual cleanup required');
    }
}
