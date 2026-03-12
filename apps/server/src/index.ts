import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config).catch(err => {
    console.error('Failed to bootstrap server:', err);
    process.exit(1);
});
