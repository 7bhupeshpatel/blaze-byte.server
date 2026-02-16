import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    APP_VERSION: process.env.APP_VERSION || 'unknown',
    NODE_ENV: process.env.NODE_ENV || 'production',
    URL: process.env.URL || '',
    PORT: parseInt(process.env.PORT || '5010'),
    LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
    CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN?.split(','),
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || '',

    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME || '',

    ENABLE_TEST_OTP: process.env.ENABLE_TEST_OTP === 'true' ? true : false,
    ENABLE_SMS: process.env.ENABLE_SMS === 'true' ? true : false,
    ENABLE_EMAIL: process.env.ENABLE_EMAIL === 'true' ? true : false,
    ENABLE_PG: process.env.ENABLE_PG === 'true' ? true : false,
    ENABLE_RESULT: process.env.ENABLE_RESULT === 'true' ? true : false,
    ENABLE_AADHAR: process.env.ENABLE_AADHAR === 'true' ? true : false,

    DATABASE_HOST: process.env.DATABASE_HOST || '',
    DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '5432'),
    DATABASE_USER: process.env.DATABASE_USER || '',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
    DATABASE_NAME: process.env.DATABASE_NAME || 'postgres',
    DATABASE_MAXPOOL: parseInt(process.env.DATABASE_MAXPOOL || '10'),
    DATABASE_TIMEOUT_IDLE: parseInt(process.env.DATABASE_TIMEOUT_IDLE || '30000'),
    DATABASE_TIMEOUT_CONNECTION: parseInt(process.env.DATABASE_TIMEOUT_CONNECTION || '5000'),

    USE_TEST_DB: process.env.USE_TEST_DB === 'true' ? true : false,
    TEST_DB_HOST: process.env.TEST_DB_HOST || 'localhost',
    TEST_DB_PORT: parseInt(process.env.TEST_DB_PORT || '5432'),
    TEST_DB_USER: process.env.TEST_DB_USER || 'postgres',
    TEST_DB_PASSWORD: process.env.TEST_DB_PASSWORD || '',
    TEST_DB_NAME: process.env.TEST_DB_NAME || 'postgres',
    TEST_DB_MAXPOOL: parseInt(process.env.TEST_DB_MAXPOOL || '10'),
    TEST_DB_TIMEOUT_IDLE: parseInt(process.env.TEST_DB_TIMEOUT_IDLE || '30000'),
    TEST_DB_TIMEOUT_CONNECTION: parseInt(process.env.TEST_DB_TIMEOUT_CONNECTION || '5000'),

    OTP_EXPIRES_IN: parseInt(process.env.OTP_EXPIRES_IN || '600'),
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    JWT_ISSUER: process.env.JWT_ISSUER || 'nalanda',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'nalanda-users',
    JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || 'default-reset-secret',
    JWT_VERIFICATION_SECRET: process.env.JWT_VERIFICATION_SECRET || 'default-verification-secret',

    ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID || 'default-verification-secret',
    ZOOM_CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET || 'default-verification-secret',
    TEAMS_CLIENT_ID: process.env.TEAMS_CLIENT_ID || 'default-verification-secret',
    TEAMS_CLIENT_SECRET: process.env.TEAMS_CLIENT_SECRET || 'default-verification-secret',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'default-verification-secret',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'default-verification-secret',

    // Internal configs
    // Profile picture settings
    IMAGE_MAX_WIDTH: 400, // Maximum width in pixels
    IMAGE_MAX_HEIGHT: 400, // Maximum height in pixels
    IMAGE_QUALITY: 80, // JPEG quality (0-100)
    IMAGE_FORMAT: 'jpeg', // Output format (jpeg, png, webp)

    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '1073741824'), // 1024MB
    UPLOAD_TIMEOUT: parseInt(process.env.UPLOAD_TIMEOUT || '1200000'), // 20 minutes
    AZURE_UPLOAD_BLOCK_SIZE: parseInt(process.env.AZURE_UPLOAD_BLOCK_SIZE || '4194304'), // 4MB
    AZURE_UPLOAD_CONCURRENCY: parseInt(process.env.AZURE_UPLOAD_CONCURRENCY || '5'),
};
