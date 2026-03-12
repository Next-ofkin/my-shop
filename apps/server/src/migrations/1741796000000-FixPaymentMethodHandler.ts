import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix payment_method handler field
 * Converts invalid string values to valid JSON
 */
export class FixPaymentMethodHandler1741796000000 implements MigrationInterface {
    name = 'FixPaymentMethodHandler1741796000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fix any payment methods with invalid handler values
        await queryRunner.query(
            `UPDATE payment_method 
             SET handler = '{}' 
             WHERE handler IS NULL 
                OR handler::text = '"paystack"' 
                OR handler::text = 'paystack'
                OR handler::text = 'null'`
        );
        console.log(`✅ Fixed payment_method handler fields`);

        // Also fix shipping_method calculator and checker if needed
        await queryRunner.query(
            `UPDATE shipping_method 
             SET calculator = '{}', checker = '{}' 
             WHERE calculator IS NULL 
                OR calculator::text NOT LIKE '{%}'
                OR checker IS NULL
                OR checker::text NOT LIKE '{%}'`
        );
        console.log(`✅ Fixed shipping_method calculator/checker fields`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('Down migration not implemented');
    }
}
