// ===== RESTAURANT DISCOVERY AI ENGINE FOR NAGARAM-DAMMIGUDA =====

class FoodieBotAI {
    constructor() {
        this.currentLocation = "Nagaram, Dammiguda";
        this.nearbyRestaurants = this.initializeRestaurantDatabase();
        this.contextMemory = new Map();
        this.currentContext = 'discovery';
        this.userPreferences = {};
        this.orderSession = null;
        this.conversationState = 'greeting';
        this.selectedRestaurant = null;
        this.dishCategories = this.initializeDishCategories();
    }

    initializeRestaurantDatabase() {
        return [
            // Indian Restaurants
            {
                id: 1,
                name: "Biryani Paradise",
                location: "Nagaram Main Road",
                distance: "0.8 km",
                rating: 4.5,
                deliveryTime: "25-35 min",
                cuisines: ["Indian", "Biryani", "Hyderabadi"],
                priceRange: "₹₹",
                image: "🍛",
                offers: ["50% off on orders above ₹300"],
                isOpen: true,
                deliveryFee: 30,
                menu: {
                    biryani: [
                        { id: 101, name: "Chicken Biryani", price: 180, description: "Aromatic basmati rice with tender chicken", veg: false, rating: 4.8, popular: true, category: "biryani" },
                        { id: 102, name: "Mutton Biryani", price: 220, description: "Premium mutton with fragrant spices", veg: false, rating: 4.7, popular: true, category: "biryani" },
                        { id: 103, name: "Veg Biryani", price: 150, description: "Mixed vegetables with saffron rice", veg: true, rating: 4.5, popular: false, category: "biryani" },
                        { id: 104, name: "Egg Biryani", price: 160, description: "Boiled eggs with spiced rice", veg: false, rating: 4.3, popular: false, category: "biryani" }
                    ],
                    curries: [
                        { id: 105, name: "Butter Chicken", price: 160, description: "Creamy tomato-based chicken curry", veg: false, rating: 4.6, popular: true, category: "curry" },
                        { id: 106, name: "Dal Tadka", price: 90, description: "Yellow lentils with tempering", veg: true, rating: 4.4, popular: false, category: "curry" },
                        { id: 107, name: "Paneer Butter Masala", price: 140, description: "Cottage cheese in rich gravy", veg: true, rating: 4.5, popular: true, category: "curry" }
                    ]
                }
            },
            {
                id: 2,
                name: "Dosa Junction",
                location: "Dammiguda Circle",
                distance: "1.2 km",
                rating: 4.3,
                deliveryTime: "20-30 min",
                cuisines: ["South Indian", "Dosa", "Breakfast"],
                priceRange: "₹",
                image: "🥞",
                offers: ["Free chutney with every order"],
                isOpen: true,
                deliveryFee: 25,
                menu: {
                    dosas: [
                        { id: 201, name: "Plain Dosa", price: 80, description: "Crispy rice crepe", veg: true, rating: 4.3, popular: false, category: "dosa" },
                        { id: 202, name: "Masala Dosa", price: 100, description: "Dosa with spiced potato filling", veg: true, rating: 4.7, popular: true, category: "dosa" },
                        { id: 203, name: "Cheese Dosa", price: 120, description: "Dosa with cheese filling", veg: true, rating: 4.4, popular: true, category: "dosa" },
                        { id: 204, name: "Chicken Dosa", price: 140, description: "Dosa with chicken filling", veg: false, rating: 4.5, popular: false, category: "dosa" }
                    ],
                    idli_vada: [
                        { id: 205, name: "Idli (2pcs)", price: 60, description: "Steamed rice cakes", veg: true, rating: 4.5, popular: true, category: "south_indian" },
                        { id: 206, name: "Vada (2pcs)", price: 70, description: "Fried lentil donuts", veg: true, rating: 4.2, popular: false, category: "south_indian" },
                        { id: 207, name: "Sambar Vada", price: 80, description: "Vada in sambar", veg: true, rating: 4.4, popular: false, category: "south_indian" }
                    ]
                }
            },
            {
                id: 3,
                name: "Pizza Corner",
                location: "Nagaram X Roads",
                distance: "0.5 km",
                rating: 4.1,
                deliveryTime: "30-40 min",
                cuisines: ["Italian", "Pizza", "Fast Food"],
                priceRange: "₹₹",
                image: "🍕",
                offers: ["Buy 1 Get 1 on medium pizzas"],
                isOpen: true,
                deliveryFee: 35,
                menu: {
                    pizzas: [
                        { id: 301, name: "Margherita Pizza", price: 200, description: "Classic tomato and mozzarella", veg: true, rating: 4.5, popular: true, category: "pizza" },
                        { id: 302, name: "Chicken Supreme", price: 280, description: "Chicken with vegetables", veg: false, rating: 4.6, popular: true, category: "pizza" },
                        { id: 303, name: "Paneer Tikka Pizza", price: 250, description: "Indian style paneer pizza", veg: true, rating: 4.4, popular: false, category: "pizza" },
                        { id: 304, name: "Pepperoni Pizza", price: 300, description: "Spicy pepperoni with cheese", veg: false, rating: 4.7, popular: true, category: "pizza" }
                    ],
                    sides: [
                        { id: 305, name: "Garlic Bread", price: 120, description: "Herb-infused garlic bread", veg: true, rating: 4.2, popular: false, category: "appetizer" },
                        { id: 306, name: "Chicken Wings", price: 180, description: "Spicy chicken wings", veg: false, rating: 4.5, popular: true, category: "appetizer" }
                    ]
                }
            },
            {
                id: 4,
                name: "Burger King",
                location: "Dammiguda Main Road",
                distance: "1.5 km",
                rating: 4.0,
                deliveryTime: "20-30 min",
                cuisines: ["American", "Burgers", "Fast Food"],
                priceRange: "₹₹",
                image: "🍔",
                offers: ["20% off on combo meals"],
                isOpen: true,
                deliveryFee: 40,
                menu: {
                    burgers: [
                        { id: 401, name: "Whopper", price: 220, description: "Flame-grilled beef burger", veg: false, rating: 4.4, popular: true, category: "burger" },
                        { id: 402, name: "Chicken Maharaja", price: 180, description: "Spicy chicken burger", veg: false, rating: 4.6, popular: true, category: "burger" },
                        { id: 403, name: "Veg Whopper", price: 160, description: "Plant-based patty burger", veg: true, rating: 4.2, popular: false, category: "burger" }
                    ],
                    sides: [
                        { id: 404, name: "French Fries", price: 80, description: "Crispy golden fries", veg: true, rating: 4.3, popular: true, category: "fast_food" },
                        { id: 405, name: "Chicken Nuggets", price: 120, description: "Crispy chicken pieces", veg: false, rating: 4.1, popular: false, category: "fast_food" }
                    ]
                }
            },
            {
                id: 5,
                name: "Chai Sutta Bar",
                location: "Nagaram Bus Stop",
                distance: "0.3 km",
                rating: 4.4,
                deliveryTime: "15-25 min",
                cuisines: ["Beverages", "Snacks", "Street Food"],
                priceRange: "₹",
                image: "☕",
                offers: ["Free delivery on orders above ₹150"],
                isOpen: true,
                deliveryFee: 20,
                menu: {
                    beverages: [
                        { id: 501, name: "Masala Chai", price: 25, description: "Traditional spiced tea", veg: true, rating: 4.7, popular: true, category: "beverage" },
                        { id: 502, name: "Filter Coffee", price: 30, description: "South Indian filter coffee", veg: true, rating: 4.5, popular: true, category: "beverage" },
                        { id: 503, name: "Lemon Tea", price: 20, description: "Refreshing lemon tea", veg: true, rating: 4.2, popular: false, category: "beverage" }
                    ],
                    snacks: [
                        { id: 504, name: "Samosa", price: 15, description: "Crispy fried pastry", veg: true, rating: 4.4, popular: true, category: "snack" },
                        { id: 505, name: "Pakoda", price: 40, description: "Mixed vegetable fritters", veg: true, rating: 4.3, popular: false, category: "snack" }
                    ]
                }
            },
            {
                id: 6,
                name: "Chinese Dragon",
                location: "Dammiguda Market",
                distance: "1.0 km",
                rating: 4.2,
                deliveryTime: "25-35 min",
                cuisines: ["Chinese", "Indo-Chinese", "Asian"],
                priceRange: "₹₹",
                image: "🍜",
                offers: ["30% off on weekdays"],
                isOpen: true,
                deliveryFee: 30,
                menu: {
                    noodles: [
                        { id: 601, name: "Chicken Noodles", price: 140, description: "Stir-fried noodles with chicken", veg: false, rating: 4.5, popular: true, category: "noodles" },
                        { id: 602, name: "Veg Noodles", price: 120, description: "Mixed vegetable noodles", veg: true, rating: 4.3, popular: false, category: "noodles" },
                        { id: 603, name: "Schezwan Noodles", price: 150, description: "Spicy Schezwan sauce noodles", veg: true, rating: 4.6, popular: true, category: "noodles" }
                    ],
                    rice: [
                        { id: 604, name: "Chicken Fried Rice", price: 160, description: "Wok-tossed rice with chicken", veg: false, rating: 4.4, popular: true, category: "fried_rice" },
                        { id: 605, name: "Veg Fried Rice", price: 130, description: "Vegetable fried rice", veg: true, rating: 4.2, popular: false, category: "fried_rice" }
                    ]
                }
            }
        ];
    }

    initializeDishCategories() {
        return {
            'biryani': {
                name: 'Biryani',
                description: 'Aromatic rice dishes with premium ingredients',
                icon: '🍛',
                popular_items: []
            },
            'pizza': {
                name: 'Pizza',
                description: 'Italian classics with fresh toppings',
                icon: '🍕',
                popular_items: []
            },
            'dosa': {
                name: 'Dosa',
                description: 'South Indian crispy crepes',
                icon: '🥞',
                popular_items: []
            },
            'burger': {
                name: 'Burger',
                description: 'Juicy burgers with premium patties',
                icon: '🍔',
                popular_items: []
            },
            'noodles': {
                name: 'Noodles',
                description: 'Stir-fried noodles with authentic flavors',
                icon: '🍜',
                popular_items: []
            },
            'beverage': {
                name: 'Beverages',
                description: 'Refreshing drinks and traditional teas',
                icon: '☕',
                popular_items: []
            },
            'curry': {
                name: 'Curry',
                description: 'Rich gravies with authentic spices',
                icon: '🍛',
                popular_items: []
            },
            'fast_food': {
                name: 'Fast Food',
                description: 'Quick bites and crispy snacks',
                icon: '🍟',
                popular_items: []
            }
        };
    }

    async generateResponse(userMessage, conversationHistory) {
        const processedMessage = this.preprocessMessage(userMessage);
        const intent = this.detectIntent(processedMessage, conversationHistory);
        
        let response;
        
        switch (intent.type) {
            case 'greeting':
                response = this.generateGreeting(intent);
                break;
            case 'find_restaurants':
                response = this.handleRestaurantSearch(intent);
                break;
            case 'cuisine_search':
                response = this.handleCuisineSearch(intent);
                break;
            case 'restaurant_details':
                response = this.handleRestaurantDetails(intent);
                break;
            case 'menu_inquiry':
                response = this.handleMenuInquiry(intent);
                break;
            case 'add_to_cart':
                response = this.handleAddToCart(intent);
                break;
            case 'dietary_filter':
                response = this.handleDietaryFilter(intent);
                break;
            case 'location_inquiry':
                response = this.handleLocationInquiry(intent);
                break;
            case 'delivery_inquiry':
                response = this.handleDeliveryInquiry(intent);
                break;
            case 'popular_items':
                response = this.handlePopularItems(intent);
                break;
            case 'best_dishes':
                response = this.handleBestDishes(intent);
                break;
            case 'dish_category_search':
                response = this.handleDishCategorySearch(intent);
                break;
            case 'price_inquiry':
                response = this.handlePriceInquiry(intent);
                break;
            default:
                response = this.generateFallbackResponse(intent);
        }
        
        return this.addPersonality(response, intent);
    }

    preprocessMessage(message) {
        return {
            original: message,
            lowercase: message.toLowerCase(),
            tokens: message.toLowerCase().split(/\s+/),
            normalized: message.toLowerCase().replace(/[^\w\s]/g, '').trim()
        };
    }

    detectIntent(processedMessage, history) {
        const { tokens, lowercase } = processedMessage;
        
        // Greeting detection
        if (this.matchPatterns(tokens, [['hello', 'hi', 'hey', 'good'], ['morning', 'afternoon', 'evening']])) {
            return { type: 'greeting', confidence: 0.9 };
        }
        
        // Restaurant search
        if (this.matchPatterns(tokens, [['find', 'show', 'search', 'nearby', 'restaurants', 'places']])) {
            return { type: 'find_restaurants', confidence: 0.9 };
        }
        
        // Best dishes / Top rated queries
        const dishCategory = this.detectDishCategory(tokens);
        if (dishCategory && this.matchPatterns(tokens, [['best', 'top', 'good', 'popular', 'rated']])) {
            return { type: 'best_dishes', category: dishCategory, confidence: 0.9 };
        }

        // Cuisine-specific search
        const cuisine = this.detectCuisine(tokens);
        if (cuisine) {
            return { type: 'cuisine_search', cuisine, confidence: 0.8 };
        }

        // Dish category search (without "best" qualifier)
        if (dishCategory) {
            return { type: 'dish_category_search', category: dishCategory, confidence: 0.8 };
        }
        
        // Menu inquiries
        if (this.matchPatterns(tokens, [['menu', 'food', 'dish', 'items', 'order']])) {
            return { type: 'menu_inquiry', confidence: 0.8 };
        }
        
        // Add to cart
        if (this.matchPatterns(tokens, [['add', 'order', 'buy', 'get']])) {
            const item = this.findMenuItemAcrossRestaurants(lowercase);
            return { type: 'add_to_cart', item, confidence: 0.8 };
        }
        
        // Dietary filters
        if (this.matchPatterns(tokens, [['vegetarian', 'vegan', 'veg', 'non-veg']])) {
            const dietary = this.detectDietaryType(tokens);
            return { type: 'dietary_filter', dietary, confidence: 0.8 };
        }
        
        // Popular items
        if (this.matchPatterns(tokens, [['popular', 'trending', 'best', 'top', 'famous']])) {
            return { type: 'popular_items', confidence: 0.8 };
        }
        
        // Delivery inquiry
        if (this.matchPatterns(tokens, [['delivery', 'deliver', 'time', 'fast']])) {
            return { type: 'delivery_inquiry', confidence: 0.8 };
        }
        
        // Price inquiry
        if (this.matchPatterns(tokens, [['price', 'cost', 'cheap', 'expensive', 'budget']])) {
            return { type: 'price_inquiry', confidence: 0.8 };
        }
        
        return { type: 'general', confidence: 0.5 };
    }

    matchPatterns(tokens, patterns) {
        return patterns.some(pattern => 
            pattern.some(word => tokens.includes(word))
        );
    }

    detectCuisine(tokens) {
        const cuisines = {
            'indian': ['indian', 'biryani', 'curry', 'dal', 'roti'],
            'south indian': ['south', 'dosa', 'idli', 'sambar', 'vada'],
            'chinese': ['chinese', 'noodles', 'fried rice', 'manchurian'],
            'italian': ['italian', 'pizza', 'pasta'],
            'fast food': ['fast', 'burger', 'fries', 'quick'],
            'beverages': ['tea', 'coffee', 'chai', 'drinks']
        };
        
        for (const [cuisine, keywords] of Object.entries(cuisines)) {
            if (keywords.some(keyword => tokens.includes(keyword))) {
                return cuisine;
            }
        }
        return null;
    }

    detectDishCategory(tokens) {
        const categories = {
            'biryani': ['biryani', 'biriyani', 'rice'],
            'pizza': ['pizza', 'pizzas'],
            'dosa': ['dosa', 'dosas', 'crepe'],
            'burger': ['burger', 'burgers'],
            'noodles': ['noodles', 'noodle'],
            'beverage': ['tea', 'coffee', 'chai', 'drink', 'beverage'],
            'curry': ['curry', 'curries', 'gravy'],
            'fast_food': ['fries', 'nuggets', 'wings'],
            'snack': ['samosa', 'pakoda', 'snacks'],
            'fried_rice': ['fried rice', 'rice']
        };
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => tokens.includes(keyword) || tokens.join(' ').includes(keyword))) {
                return category;
            }
        }
        return null;
    }

    generateGreeting(intent) {
        const greetings = [
            "Hello! Welcome to FoodieBot! 🍽️ I can help you discover amazing restaurants near Nagaram-Dammiguda. What are you craving today?",
            "Hi there! 👋 Ready to explore delicious food options in your area? I know all the best spots around Nagaram and Dammiguda!",
            "Welcome! 😊 I'm here to help you find the perfect meal from restaurants near you. What type of cuisine are you in the mood for?",
            "Hey! 🤖 Hungry? Let me help you discover fantastic restaurants and order your favorite food right to your doorstep!"
        ];
        
        return {
            text: greetings[Math.floor(Math.random() * greetings.length)],
            action: 'show_welcome',
            data: { location: this.currentLocation }
        };
    }

    handleRestaurantSearch(intent) {
        const restaurants = this.nearbyRestaurants.slice(0, 6); // Show top 6
        
        const restaurantList = restaurants.map(r => 
            `🍽️ **${r.name}** (${r.rating}⭐)\n📍 ${r.location} • ${r.distance}\n🍴 ${r.cuisines.join(', ')}\n⏱️ ${r.deliveryTime} • ${r.priceRange}`
        ).join('\n\n');
        
        return {
            text: `Here are the top restaurants near you in ${this.currentLocation}:\n\n${restaurantList}\n\nTap on any restaurant to view their menu! 🍽️`,
            action: 'show_restaurants',
            data: restaurants
        };
    }

    handleCuisineSearch(intent) {
        const { cuisine } = intent;
        const filteredRestaurants = this.nearbyRestaurants.filter(r => 
            r.cuisines.some(c => c.toLowerCase().includes(cuisine.toLowerCase()))
        );
        
        if (filteredRestaurants.length > 0) {
            const restaurantList = filteredRestaurants.slice(0, 4).map(r => 
                `🍽️ **${r.name}** (${r.rating}⭐)\n📍 ${r.distance} • ${r.deliveryTime}\n🎯 Specializes in ${cuisine}`
            ).join('\n\n');
            
            return {
                text: `Great choice! Here are the best ${cuisine} restaurants near you:\n\n${restaurantList}\n\nWhich one catches your eye? 👀`,
                action: 'show_restaurants',
                data: filteredRestaurants
            };
        } else {
            return {
                text: `I couldn't find ${cuisine} restaurants in your immediate area, but let me show you some similar options that you might love! 🤔`,
                action: 'show_alternatives',
                data: { requestedCuisine: cuisine }
            };
        }
    }

    handleMenuInquiry(intent) {
        if (this.selectedRestaurant) {
            const restaurant = this.selectedRestaurant;
            const menuText = this.formatRestaurantMenu(restaurant);
            
            return {
                text: `Here's the menu for **${restaurant.name}**:\n\n${menuText}\n\nWhat would you like to add to your cart? 🛒`,
                action: 'show_menu',
                data: restaurant
            };
        } else {
            return {
                text: "Which restaurant's menu would you like to see? Here are some popular options near you:",
                action: 'show_restaurants',
                data: this.nearbyRestaurants.slice(0, 4)
            };
        }
    }

    handlePopularItems(intent) {
        const popularItems = [
            { restaurant: "Biryani Paradise", item: "Chicken Biryani", price: 180 },
            { restaurant: "Pizza Corner", item: "Margherita Pizza", price: 200 },
            { restaurant: "Dosa Junction", item: "Masala Dosa", price: 100 },
            { restaurant: "Chinese Dragon", item: "Chicken Noodles", price: 140 }
        ];
        
        const itemList = popularItems.map(item => 
            `⭐ **${item.item}** - ₹${item.price}\nFrom ${item.restaurant}`
        ).join('\n\n');
        
        return {
            text: `Here are the most popular dishes in your area right now:\n\n${itemList}\n\nWant to order any of these? Just let me know! 🌟`,
            action: 'show_popular',
            data: popularItems
        };
    }

    handleDeliveryInquiry(intent) {
        const fastDeliveryRestaurants = this.nearbyRestaurants
            .filter(r => parseInt(r.deliveryTime) <= 25)
            .slice(0, 4);
        
        const deliveryList = fastDeliveryRestaurants.map(r => 
            `🚀 **${r.name}** - ${r.deliveryTime}\n📍 ${r.distance} away`
        ).join('\n\n');
        
        return {
            text: `These restaurants offer the fastest delivery to ${this.currentLocation}:\n\n${deliveryList}\n\nAll deliver within 25 minutes! ⚡`,
            action: 'show_fast_delivery',
            data: fastDeliveryRestaurants
        };
    }

    handleBestDishes(intent) {
        const { category } = intent;
        const bestDishes = this.getBestDishesByCategory(category);
        
        if (bestDishes.length === 0) {
            return {
                text: `I couldn't find any ${category} dishes in your area. Let me show you other popular options! 🤔`,
                action: 'show_alternatives',
                data: { requestedCategory: category }
            };
        }

        const categoryInfo = this.dishCategories[category];
        
        return {
            text: `Here are the **best ${categoryInfo?.name || category}** dishes near you! 🌟`,
            action: 'show_dish_cards',
            data: {
                dishes: bestDishes,
                title: `Best ${categoryInfo?.name || category}`,
                category: category
            }
        };
    }

    handleDishCategorySearch(intent) {
        const { category } = intent;
        const categoryDishes = this.getDishesByCategory(category);
        
        if (categoryDishes.length === 0) {
            return {
                text: `No ${category} dishes found in your area. Let me show you similar options! 🔍`,
                action: 'show_alternatives',
                data: { requestedCategory: category }
            };
        }

        const categoryInfo = this.dishCategories[category];
        
        return {
            text: `Found **${categoryDishes.length} ${categoryInfo?.name || category}** options for you! 📋`,
            action: 'show_dish_cards',
            data: {
                dishes: categoryDishes.slice(0, 8),
                title: `${categoryInfo?.name || category} Options`,
                category: category
            }
        };
    }

    formatRestaurantMenu(restaurant) {
        let menuText = '';
        for (const [category, items] of Object.entries(restaurant.menu)) {
            menuText += `**${category.toUpperCase()}**\n`;
            items.forEach(item => {
                const vegIcon = item.veg ? '🟢' : '🔴';
                menuText += `${vegIcon} ${item.name} - ₹${item.price}\n${item.description}\n\n`;
            });
        }
        return menuText;
    }

    findMenuItemAcrossRestaurants(query) {
        for (const restaurant of this.nearbyRestaurants) {
            for (const category of Object.values(restaurant.menu)) {
                const item = category.find(item => 
                    query.includes(item.name.toLowerCase()) ||
                    item.name.toLowerCase().includes(query.split(' ')[0])
                );
                if (item) {
                    return { ...item, restaurant: restaurant.name, restaurantId: restaurant.id };
                }
            }
        }
        return null;
    }

    detectDietaryType(tokens) {
        if (tokens.includes('vegetarian') || tokens.includes('veg')) return 'vegetarian';
        if (tokens.includes('non-veg') || tokens.includes('chicken') || tokens.includes('mutton')) return 'non-vegetarian';
        return 'vegetarian';
    }

    generateFallbackResponse(intent) {
        const fallbacks = [
            "I'd love to help you find great food! Try asking me about restaurants near you, specific cuisines, or popular dishes! 🍽️",
            "Not sure what you're looking for? Ask me about nearby restaurants, delivery options, or what's popular in your area! 😊",
            "I'm here to help you discover amazing food! You can ask about restaurants, menus, prices, or place orders. What sounds good? 🤔",
            "Let me help you find something delicious! Try searching for cuisines like 'Indian food' or 'pizza near me'! 🍕"
        ];
        
        return {
            text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
            action: null,
            data: null
        };
    }

    addPersonality(response, intent) {
        // Add location context and emojis
        if (!response.text.includes('😊') && !response.text.includes('🍽️') && Math.random() > 0.3) {
            const emojis = ['😊', '🍽️', '🤤', '✨', '🎉', '🚀'];
            response.text += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
        }
        
        return response;
    }

    // Helper methods for dish categories
    getBestDishesByCategory(category) {
        const allDishes = [];
        
        this.nearbyRestaurants.forEach(restaurant => {
            Object.values(restaurant.menu).forEach(menuCategory => {
                menuCategory.forEach(dish => {
                    if (dish.category === category && dish.rating >= 4.5) {
                        allDishes.push({
                            ...dish,
                            restaurant: restaurant.name,
                            restaurantId: restaurant.id
                        });
                    }
                });
            });
        });
        
        // Sort by rating (highest first) and popularity
        return allDishes
            .sort((a, b) => {
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.rating - a.rating;
            })
            .slice(0, 5);
    }
    
    getDishesByCategory(category) {
        const allDishes = [];
        
        this.nearbyRestaurants.forEach(restaurant => {
            Object.values(restaurant.menu).forEach(menuCategory => {
                menuCategory.forEach(dish => {
                    if (dish.category === category) {
                        allDishes.push({
                            ...dish,
                            restaurant: restaurant.name,
                            restaurantId: restaurant.id
                        });
                    }
                });
            });
        });
        
        // Sort by rating and popularity
        return allDishes
            .sort((a, b) => {
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.rating - a.rating;
            });
    }

    // Helper method to set current restaurant context
    setSelectedRestaurant(restaurantId) {
        this.selectedRestaurant = this.nearbyRestaurants.find(r => r.id === restaurantId);
    }
}

// Initialize the AI when script loads
const chatbotAI = new FoodieBotAI();

// Make it globally accessible
window.chatbotAI = chatbotAI;
