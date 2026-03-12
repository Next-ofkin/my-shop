import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import { GraphiqlPlugin } from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        trustProxy: IS_DEV ? false : 1,
        cors: {
            origin: IS_DEV 
                ? ['http://localhost:3001', 'http://localhost:3000']
                : [
                    'https://freshmarket.vercel.app',
                    'https://www.freshmarket.vercel.app',
                    'https://freshmarket-storefront.vercel.app',
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
                  ].filter(Boolean),
            credentials: true,
        },
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET,
        },
    },

    // 🔥 SUPERBASE DATABASE CONFIGURATION 🔥
    dbConnectionOptions: {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '6543'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || 'postgres',
        synchronize: false,  // Schema is now created, use migrations for future changes
        migrationsRun: true,  // 🔥 Must be true for auto-migrations
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: true,
        ssl: { rejectUnauthorized: false },
        // Optional: Connection pooling settings for production
        extra: {
            max: 10, // Max connections in pool
        },
    },

    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        GraphiqlPlugin.init(),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            assetUrlPrefix: IS_DEV ? undefined : `${process.env.RAILWAY_PUBLIC_DOMAIN || ''}/assets/`,
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
            globalTemplateVars: {
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
            },
        }),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: path.join(__dirname, '../dist/dashboard'),
        }),
    ],
};