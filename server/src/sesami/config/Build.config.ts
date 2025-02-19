import * as process from 'process';

export default {
    port: process.env.PORT || 80,
    environment: process.env.NODE_ENV || 'development',
    sesamiClientId: String(process.env.SESAMI_CLIENT_ID),
    sesamiClientSecret: String(process.env.SESAMI_CLIENT_SECRET),
    baseUrl: String(process.env.BASE_URL),
    isOAuthEnable: false  // change to true in production or when you want to test oauth flow
};
