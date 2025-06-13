-- Create the database
CREATE DATABASE RestaurantChatbot;
GO

USE RestaurantChatbot;
GO

-- Create Restaurants table
CREATE TABLE Restaurants (
    RestaurantID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Location NVARCHAR(200) NOT NULL,
    Distance DECIMAL(5,2) NOT NULL,
    Rating DECIMAL(2,1) NOT NULL,
    DeliveryTime NVARCHAR(20) NOT NULL,
    PriceRange NVARCHAR(10) NOT NULL,
    ImageURL NVARCHAR(200),
    IsOpen BIT DEFAULT 1,
    DeliveryFee DECIMAL(10,2) NOT NULL,
    OpeningHours NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Create Cuisines table
CREATE TABLE Cuisines (
    CuisineID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Create RestaurantCuisines junction table
CREATE TABLE RestaurantCuisines (
    RestaurantID INT,
    CuisineID INT,
    PRIMARY KEY (RestaurantID, CuisineID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID),
    FOREIGN KEY (CuisineID) REFERENCES Cuisines(CuisineID)
);
GO

-- Create MenuCategories table
CREATE TABLE MenuCategories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    Description NVARCHAR(200),
    Icon NVARCHAR(20)
);
GO

-- Create MenuItems table
CREATE TABLE MenuItems (
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    RestaurantID INT,
    CategoryID INT,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Price DECIMAL(10,2) NOT NULL,
    IsVegetarian BIT DEFAULT 0,
    Rating DECIMAL(2,1),
    IsPopular BIT DEFAULT 0,
    ImageURL NVARCHAR(200),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID),
    FOREIGN KEY (CategoryID) REFERENCES MenuCategories(CategoryID)
);
GO

-- Create Offers table
CREATE TABLE Offers (
    OfferID INT IDENTITY(1,1) PRIMARY KEY,
    RestaurantID INT,
    Description NVARCHAR(200) NOT NULL,
    DiscountPercentage INT,
    MinimumOrderAmount DECIMAL(10,2),
    ValidFrom DATETIME NOT NULL,
    ValidTo DATETIME NOT NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID)
);
GO

-- Create Users table
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(200),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Create Orders table
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    RestaurantID INT,
    OrderNumber NVARCHAR(20) UNIQUE NOT NULL,
    OrderType NVARCHAR(20) NOT NULL, -- 'delivery', 'dine-in', 'takeaway'
    Status NVARCHAR(20) NOT NULL, -- 'pending', 'confirmed', 'preparing', 'ready', 'delivered'
    TotalAmount DECIMAL(10,2) NOT NULL,
    DeliveryFee DECIMAL(10,2),
    PaymentStatus NVARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
    PaymentMethod NVARCHAR(20),
    EstimatedDeliveryTime DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID)
);
GO

-- Create OrderItems table
CREATE TABLE OrderItems (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT,
    MenuItemID INT,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    SpecialInstructions NVARCHAR(200),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(ItemID)
);
GO

-- Create Reservations table
CREATE TABLE Reservations (
    ReservationID INT IDENTITY(1,1) PRIMARY KEY,
    RestaurantID INT,
    UserID INT,
    TableNumber INT,
    NumberOfGuests INT NOT NULL,
    ReservationDate DATE NOT NULL,
    ReservationTime TIME NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- 'pending', 'confirmed', 'cancelled'
    SpecialRequests NVARCHAR(200),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- Create ChatHistory table
CREATE TABLE ChatHistory (
    ChatID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    Message NVARCHAR(MAX) NOT NULL,
    IsFromUser BIT NOT NULL,
    Intent NVARCHAR(50),
    Sentiment NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- Create stored procedures for common operations

-- Procedure to add a new restaurant
CREATE PROCEDURE sp_AddRestaurant
    @Name NVARCHAR(100),
    @Location NVARCHAR(200),
    @Distance DECIMAL(5,2),
    @Rating DECIMAL(2,1),
    @DeliveryTime NVARCHAR(20),
    @PriceRange NVARCHAR(10),
    @ImageURL NVARCHAR(200),
    @DeliveryFee DECIMAL(10,2),
    @OpeningHours NVARCHAR(50),
    @PhoneNumber NVARCHAR(20)
AS
BEGIN
    INSERT INTO Restaurants (Name, Location, Distance, Rating, DeliveryTime, PriceRange, 
                           ImageURL, DeliveryFee, OpeningHours, PhoneNumber)
    VALUES (@Name, @Location, @Distance, @Rating, @DeliveryTime, @PriceRange, 
            @ImageURL, @DeliveryFee, @OpeningHours, @PhoneNumber);
    
    SELECT SCOPE_IDENTITY() AS RestaurantID;
END
GO

-- Procedure to add a menu item
CREATE PROCEDURE sp_AddMenuItem
    @RestaurantID INT,
    @CategoryID INT,
    @Name NVARCHAR(100),
    @Description NVARCHAR(500),
    @Price DECIMAL(10,2),
    @IsVegetarian BIT,
    @Rating DECIMAL(2,1),
    @IsPopular BIT,
    @ImageURL NVARCHAR(200)
AS
BEGIN
    INSERT INTO MenuItems (RestaurantID, CategoryID, Name, Description, Price, 
                          IsVegetarian, Rating, IsPopular, ImageURL)
    VALUES (@RestaurantID, @CategoryID, @Name, @Description, @Price, 
            @IsVegetarian, @Rating, @IsPopular, @ImageURL);
    
    SELECT SCOPE_IDENTITY() AS ItemID;
END
GO

-- Procedure to create a new order
CREATE PROCEDURE sp_CreateOrder
    @UserID INT,
    @RestaurantID INT,
    @OrderType NVARCHAR(20),
    @TotalAmount DECIMAL(10,2),
    @DeliveryFee DECIMAL(10,2),
    @PaymentMethod NVARCHAR(20)
AS
BEGIN
    DECLARE @OrderNumber NVARCHAR(20) = 'ORD-' + CONVERT(NVARCHAR(10), GETDATE(), 112) + 
                                      '-' + RIGHT('0000' + CAST(ABS(CHECKSUM(NEWID())) % 10000 AS NVARCHAR(4)), 4);
    
    INSERT INTO Orders (UserID, RestaurantID, OrderNumber, OrderType, Status, 
                       TotalAmount, DeliveryFee, PaymentStatus, PaymentMethod, 
                       EstimatedDeliveryTime)
    VALUES (@UserID, @RestaurantID, @OrderNumber, @OrderType, 'pending', 
            @TotalAmount, @DeliveryFee, 'pending', @PaymentMethod, 
            DATEADD(MINUTE, 45, GETDATE()));
    
    SELECT SCOPE_IDENTITY() AS OrderID, @OrderNumber AS OrderNumber;
END
GO

-- Procedure to add items to an order
CREATE PROCEDURE sp_AddOrderItem
    @OrderID INT,
    @MenuItemID INT,
    @Quantity INT,
    @UnitPrice DECIMAL(10,2),
    @SpecialInstructions NVARCHAR(200)
AS
BEGIN
    INSERT INTO OrderItems (OrderID, MenuItemID, Quantity, UnitPrice, SpecialInstructions)
    VALUES (@OrderID, @MenuItemID, @Quantity, @UnitPrice, @SpecialInstructions);
END
GO

-- Procedure to update order status
CREATE PROCEDURE sp_UpdateOrderStatus
    @OrderID INT,
    @Status NVARCHAR(20),
    @PaymentStatus NVARCHAR(20) = NULL
AS
BEGIN
    UPDATE Orders
    SET Status = @Status,
        PaymentStatus = ISNULL(@PaymentStatus, PaymentStatus),
        UpdatedAt = GETDATE()
    WHERE OrderID = @OrderID;
END
GO

-- Procedure to get restaurant menu
CREATE PROCEDURE sp_GetRestaurantMenu
    @RestaurantID INT
AS
BEGIN
    SELECT 
        m.ItemID,
        m.Name,
        m.Description,
        m.Price,
        m.IsVegetarian,
        m.Rating,
        m.IsPopular,
        m.ImageURL,
        c.Name AS CategoryName,
        c.Description AS CategoryDescription,
        c.Icon AS CategoryIcon
    FROM MenuItems m
    JOIN MenuCategories c ON m.CategoryID = c.CategoryID
    WHERE m.RestaurantID = @RestaurantID
    ORDER BY c.Name, m.Name;
END
GO

-- Procedure to get nearby restaurants
CREATE PROCEDURE sp_GetNearbyRestaurants
    @MaxDistance DECIMAL(5,2)
AS
BEGIN
    SELECT 
        r.*,
        STRING_AGG(c.Name, ', ') AS Cuisines
    FROM Restaurants r
    LEFT JOIN RestaurantCuisines rc ON r.RestaurantID = rc.RestaurantID
    LEFT JOIN Cuisines c ON rc.CuisineID = c.CuisineID
    WHERE r.Distance <= @MaxDistance AND r.IsOpen = 1
    GROUP BY r.RestaurantID, r.Name, r.Location, r.Distance, r.Rating, 
             r.DeliveryTime, r.PriceRange, r.ImageURL, r.IsOpen, 
             r.DeliveryFee, r.OpeningHours, r.PhoneNumber, r.CreatedAt, r.UpdatedAt
    ORDER BY r.Rating DESC, r.Distance ASC;
END
GO

-- Create indexes for better performance
CREATE INDEX IX_MenuItems_RestaurantID ON MenuItems(RestaurantID);
CREATE INDEX IX_Orders_UserID ON Orders(UserID);
CREATE INDEX IX_Orders_RestaurantID ON Orders(RestaurantID);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);
CREATE INDEX IX_ChatHistory_UserID ON ChatHistory(UserID);
CREATE INDEX IX_ChatHistory_CreatedAt ON ChatHistory(CreatedAt);
GO 