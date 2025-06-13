const sql = require('mssql');

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: 'RestaurantChatbot',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Create connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Database class for handling all database operations
class Database {
    constructor() {
        this.pool = pool;
        this.poolConnect = poolConnect;
    }

    // Initialize database connection
    async initialize() {
        try {
            await this.poolConnect;
            console.log('Connected to SQL Server');
        } catch (err) {
            console.error('Error connecting to SQL Server:', err);
            throw err;
        }
    }

    // Restaurant operations
    async getRestaurants() {
        try {
            const result = await this.pool.request()
                .execute('sp_GetNearbyRestaurants');
            return result.recordset;
        } catch (err) {
            console.error('Error getting restaurants:', err);
            throw err;
        }
    }

    async getRestaurantById(id) {
        try {
            const result = await this.pool.request()
                .input('RestaurantID', sql.Int, id)
                .query('SELECT * FROM Restaurants WHERE RestaurantID = @RestaurantID');
            return result.recordset[0];
        } catch (err) {
            console.error('Error getting restaurant by ID:', err);
            throw err;
        }
    }

    async getRestaurantMenu(restaurantId) {
        try {
            const result = await this.pool.request()
                .input('RestaurantID', sql.Int, restaurantId)
                .execute('sp_GetRestaurantMenu');
            return result.recordset;
        } catch (err) {
            console.error('Error getting restaurant menu:', err);
            throw err;
        }
    }

    // Order operations
    async createOrder(orderData) {
        try {
            const result = await this.pool.request()
                .input('UserID', sql.Int, orderData.userId)
                .input('RestaurantID', sql.Int, orderData.restaurantId)
                .input('OrderType', sql.NVarChar, orderData.orderType)
                .input('TotalAmount', sql.Decimal(10, 2), orderData.totalAmount)
                .input('DeliveryFee', sql.Decimal(10, 2), orderData.deliveryFee)
                .input('PaymentMethod', sql.NVarChar, orderData.paymentMethod)
                .execute('sp_CreateOrder');

            const orderId = result.recordset[0].OrderID;
            const orderNumber = result.recordset[0].OrderNumber;

            // Add order items
            for (const item of orderData.items) {
                await this.pool.request()
                    .input('OrderID', sql.Int, orderId)
                    .input('MenuItemID', sql.Int, item.menuItemId)
                    .input('Quantity', sql.Int, item.quantity)
                    .input('UnitPrice', sql.Decimal(10, 2), item.price)
                    .input('SpecialInstructions', sql.NVarChar, item.specialInstructions)
                    .execute('sp_AddOrderItem');
            }

            return { orderId, orderNumber };
        } catch (err) {
            console.error('Error creating order:', err);
            throw err;
        }
    }

    async updateOrderStatus(orderId, status, paymentStatus = null) {
        try {
            await this.pool.request()
                .input('OrderID', sql.Int, orderId)
                .input('Status', sql.NVarChar, status)
                .input('PaymentStatus', sql.NVarChar, paymentStatus)
                .execute('sp_UpdateOrderStatus');
        } catch (err) {
            console.error('Error updating order status:', err);
            throw err;
        }
    }

    async getOrderDetails(orderId) {
        try {
            const orderResult = await this.pool.request()
                .input('OrderID', sql.Int, orderId)
                .query(`
                    SELECT o.*, r.Name AS RestaurantName, r.Location AS RestaurantLocation
                    FROM Orders o
                    JOIN Restaurants r ON o.RestaurantID = r.RestaurantID
                    WHERE o.OrderID = @OrderID
                `);

            const itemsResult = await this.pool.request()
                .input('OrderID', sql.Int, orderId)
                .query(`
                    SELECT oi.*, mi.Name AS ItemName, mi.Description AS ItemDescription
                    FROM OrderItems oi
                    JOIN MenuItems mi ON oi.MenuItemID = mi.ItemID
                    WHERE oi.OrderID = @OrderID
                `);

            return {
                order: orderResult.recordset[0],
                items: itemsResult.recordset
            };
        } catch (err) {
            console.error('Error getting order details:', err);
            throw err;
        }
    }

    // Chat history operations
    async saveChatMessage(userId, message, isFromUser, intent = null, sentiment = null) {
        try {
            await this.pool.request()
                .input('UserID', sql.Int, userId)
                .input('Message', sql.NVarChar(sql.MAX), message)
                .input('IsFromUser', sql.Bit, isFromUser)
                .input('Intent', sql.NVarChar, intent)
                .input('Sentiment', sql.NVarChar, sentiment)
                .query(`
                    INSERT INTO ChatHistory (UserID, Message, IsFromUser, Intent, Sentiment)
                    VALUES (@UserID, @Message, @IsFromUser, @Intent, @Sentiment)
                `);
        } catch (err) {
            console.error('Error saving chat message:', err);
            throw err;
        }
    }

    async getChatHistory(userId, limit = 50) {
        try {
            const result = await this.pool.request()
                .input('UserID', sql.Int, userId)
                .input('Limit', sql.Int, limit)
                .query(`
                    SELECT TOP (@Limit) *
                    FROM ChatHistory
                    WHERE UserID = @UserID
                    ORDER BY CreatedAt DESC
                `);
            return result.recordset;
        } catch (err) {
            console.error('Error getting chat history:', err);
            throw err;
        }
    }

    // User operations
    async createUser(userData) {
        try {
            const result = await this.pool.request()
                .input('Name', sql.NVarChar, userData.name)
                .input('Email', sql.NVarChar, userData.email)
                .input('PhoneNumber', sql.NVarChar, userData.phoneNumber)
                .input('Address', sql.NVarChar, userData.address)
                .query(`
                    INSERT INTO Users (Name, Email, PhoneNumber, Address)
                    VALUES (@Name, @Email, @PhoneNumber, @Address);
                    SELECT SCOPE_IDENTITY() AS UserID;
                `);
            return result.recordset[0].UserID;
        } catch (err) {
            console.error('Error creating user:', err);
            throw err;
        }
    }

    async getUserById(userId) {
        try {
            const result = await this.pool.request()
                .input('UserID', sql.Int, userId)
                .query('SELECT * FROM Users WHERE UserID = @UserID');
            return result.recordset[0];
        } catch (err) {
            console.error('Error getting user by ID:', err);
            throw err;
        }
    }

    // Close database connection
    async close() {
        try {
            await this.pool.close();
            console.log('Database connection closed');
        } catch (err) {
            console.error('Error closing database connection:', err);
            throw err;
        }
    }
}

// Create and export database instance
const db = new Database();
module.exports = db; 