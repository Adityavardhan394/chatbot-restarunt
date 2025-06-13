// Database configuration
const dbConfig = {
    development: {
        user: 'your_username',
        password: 'your_password',
        server: 'localhost',
        database: 'RestaurantChatbot',
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    },
    production: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
};

// Get the appropriate configuration based on environment
const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return dbConfig[env];
};

module.exports = {
    getConfig
}; 