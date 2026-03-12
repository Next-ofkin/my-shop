import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to set up default tax zone and rate
 * This runs automatically to fix the "active tax zone could not be determined" error
 */
export class SetupDefaultTaxZone1741794000000 implements MigrationInterface {
    name = 'SetupDefaultTaxZone1741794000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
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

        // Add Nigeria to the zone (or use a region if available)
        // First check if region exists
        const nigeriaRegion = await queryRunner.query(
            `SELECT id FROM region WHERE code = 'NG'`
        );

        if (nigeriaRegion.length > 0) {
            const regionId = nigeriaRegion[0].id;
            
            // Check if already in zone
            const existingMember = await queryRunner.query(
                `SELECT * FROM zone_members_region WHERE "zoneId" = $1 AND "regionId" = $2`,
                [zoneId, regionId]
            );

            if (existingMember.length === 0) {
                await queryRunner.query(
                    `INSERT INTO zone_members_region ("zoneId", "regionId") 
                     VALUES ($1, $2)`,
                    [zoneId, regionId]
                );
                console.log(`✅ Added Nigeria to Default Zone`);
            }
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

        // Create a tax rate (0% for simplicity, you can change later)
        const existingRate = await queryRunner.query(
            `SELECT id FROM tax_rate WHERE name = 'Default Tax Rate'`
        );

        if (existingRate.length === 0) {
            await queryRunner.query(
                `INSERT INTO tax_rate ("createdAt", "updatedAt", name, enabled, value, "categoryId", "zoneId") 
                 VALUES (NOW(), NOW(), 'Default Tax Rate', true, 0, $1, $2)`,
                [taxCategoryId, zoneId]
            );
            console.log(`✅ Created Default Tax Rate (0%)`);
        } else {
            console.log(`✅ Default Tax Rate already exists`);
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
