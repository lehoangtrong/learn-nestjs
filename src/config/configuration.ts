export default () => ({
    // Database configuration
    database: {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '3306', 10),
        username: process.env.DB_USERNAME ?? 'root',
        password: process.env.DB_PASSWORD ?? '',
        name: process.env.DB_DATABASE ?? 'nestjs_db',
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET ?? 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRATION ?? '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
    },

    // Application configuration
    app: {
        port: parseInt(process.env.PORT ?? '3000', 10),
        environment: process.env.NODE_ENV ?? 'development',
    },
});
