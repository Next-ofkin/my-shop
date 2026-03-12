// Standalone migration script for Railway
const { runMigrations } = require('@vendure/core');
const { config } = require('./dist/vendure-config');

console.log('Running migrations...');

runMigrations(config)
    .then(() => {
        console.log('✅ Migrations completed successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    });
