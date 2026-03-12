import { runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => {
        console.log('✅ Migrations completed');
        process.exit(0);
    })
    .catch((err: any) => {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    });