import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

// Run migrations first, then start server
runMigrations(config)
    .then(() => {
        console.log('✅ Migrations completed, starting server...');
        return bootstrap(config);
    })
    .catch(err => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });
