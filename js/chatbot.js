// Chatbot State
const state = {
    currentStep: 'greeting',
    order: {
        items: [],
        type: null,
        table: null,
        time: null,
        people: null,
        address: null
    },
    reservation: {
        name: null,
        date: null,
        time: null,
        people: null,
        phone: null
    },
    location: {
        address: "Nagaram-Dammiguda, Hyderabad",
        openingHours: "10:00 AM - 11:00 PM",
        phone: "+91 98765 43210"
    },
    cart: []
};

// Initialize cart if it doesn't exist and make state globally accessible
window.chatbotState = state; // Make state accessible globally for debugging
if (!state.cart) {
    state.cart = [];
}
console.log('Initial cart state:', state.cart);

// Restaurant Information
const restaurantInfo = {
    name: "Spice Garden",
    description: "Authentic Indian cuisine with a modern twist",
    specialties: [
        "Hyderabadi Biryani",
        "Butter Chicken",
        "Tandoori Specialties",
        "South Indian Thalis"
    ],
    ratings: {
        food: 4.5,
        service: 4.3,
        ambiance: 4.4
    },
    deliveryTime: "30-45 minutes",
    minimumOrder: 200,
    deliveryFee: 40
};

// Menu Data with Indian cuisine
const menu = {
    starters: [
        { id: 1, name: 'Veg Spring Roll', price: 120, image: 'spring-roll.jpg', description: 'Crispy rolls filled with mixed vegetables' },
        { id: 2, name: 'Chicken 65', price: 180, image: 'chicken-65.jpg', description: 'Spicy deep-fried chicken' },
        { id: 3, name: 'Paneer Tikka', price: 160, image: 'paneer-tikka.jpg', description: 'Grilled cottage cheese with spices' }
    ],
    mainCourse: [
        { id: 4, name: 'Hyderabadi Biryani', price: 280, image: 'biryani.jpg', description: 'Fragrant rice with spices and choice of meat' },
        { id: 5, name: 'Butter Chicken', price: 320, image: 'butter-chicken.jpg', description: 'Tender chicken in rich tomato gravy' },
        { id: 6, name: 'Veg Pulao', price: 180, image: 'pulao.jpg', description: 'Aromatic rice with mixed vegetables' }
    ],
    breads: [
        { id: 7, name: 'Butter Naan', price: 40, image: 'naan.jpg', description: 'Soft bread baked in tandoor' },
        { id: 8, name: 'Garlic Naan', price: 60, image: 'garlic-naan.jpg', description: 'Naan topped with garlic butter' },
        { id: 9, name: 'Roti', price: 30, image: 'roti.jpg', description: 'Whole wheat flatbread' }
    ],
    desserts: [
        { id: 10, name: 'Gulab Jamun', price: 80, image: 'gulab-jamun.jpg', description: 'Sweet milk solids in sugar syrup' },
        { id: 11, name: 'Ice Cream', price: 60, image: 'ice-cream.jpg', description: 'Vanilla, chocolate, or strawberry' },
        { id: 12, name: 'Kheer', price: 70, image: 'kheer.jpg', description: 'Rice pudding with nuts' }
    ],
    drinks: [
        { id: 13, name: 'Masala Chai', price: 30, image: 'chai.jpg', description: 'Spiced Indian tea' },
        { id: 14, name: 'Lassi', price: 50, image: 'lassi.jpg', description: 'Sweet or salty yogurt drink' },
        { id: 15, name: 'Mineral Water', price: 20, image: 'water.jpg', description: 'Bottled water' }
    ]
};

// Common Questions and Answers
const qaDatabase = {
    'location': `We are located in ${state.location.address}. We're easily accessible from the main road.`,
    'timings': `We are open ${state.location.openingHours} every day.`,
    'delivery': `We deliver within a 5km radius of our location. Delivery time is ${restaurantInfo.deliveryTime}.`,
    'payment': 'We accept cash, UPI, credit/debit cards, and net banking.',
    'parking': 'Yes, we have free parking available for our customers.',
    'reservation': 'You can make a reservation through our chatbot or by calling us directly.',
    'specialties': `Our specialties include: ${restaurantInfo.specialties.join(', ')}.`,
    'minimum order': `Our minimum order for delivery is ₹${restaurantInfo.minimumOrder}.`,
    'delivery fee': `Delivery fee is ₹${restaurantInfo.deliveryFee} for orders within 3km.`,
    'ratings': `Our restaurant has received excellent ratings: Food: ${restaurantInfo.ratings.food}/5, Service: ${restaurantInfo.ratings.service}/5, Ambiance: ${restaurantInfo.ratings.ambiance}/5.`
};

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendMessage');
const darkModeToggle = document.getElementById('darkModeToggle');

// Enhanced conversation analysis
const conversationAnalysis = {
    // Intent recognition patterns
    intents: {
        greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
        menu: ['menu', 'food', 'dishes', 'items', 'what do you have', 'what can i order'],
        order: ['order', 'place order', 'buy', 'purchase', 'get food'],
        payment: ['pay', 'payment', 'how to pay', 'payment method', 'upi', 'card', 'cash'],
        tracking: ['track', 'where is my order', 'order status', 'delivery status'],
        help: ['help', 'how to', 'what can you do', 'commands', 'options'],
        cancel: ['cancel', 'stop', 'remove', 'delete'],
        quantity: ['more', 'less', 'quantity', 'how many'],
        price: ['price', 'cost', 'how much', 'expensive', 'cheap'],
        time: ['time', 'when', 'how long', 'delivery time', 'waiting time']
    },

    // Analyze user input for intent
    analyzeIntent(input) {
        const words = input.toLowerCase().split(' ');
        const matchedIntents = [];

        for (const [intent, patterns] of Object.entries(this.intents)) {
            for (const pattern of patterns) {
                if (input.toLowerCase().includes(pattern)) {
                    matchedIntents.push(intent);
                    break;
                }
            }
        }

        return matchedIntents;
    },

    // Extract quantity from input
    extractQuantity(input) {
        const numbers = input.match(/\d+/);
        return numbers ? parseInt(numbers[0]) : 1;
    },

    // Extract price range from input
    extractPriceRange(input) {
        const priceMatch = input.match(/(\d+)\s*-\s*(\d+)/);
        if (priceMatch) {
            return {
                min: parseInt(priceMatch[1]),
                max: parseInt(priceMatch[2])
            };
        }
        return null;
    }
};

// Add conversation memory and advanced analysis after the conversationAnalysis object
const conversationMemory = {
    messages: [],
    userPreferences: {},
    currentTopic: '',
    lastAction: '',
    addMessage(role, content) {
        this.messages.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        if (this.messages.length > 20) {
            this.messages = this.messages.slice(-20);
        }
    },
    getRecentContext() {
        return this.messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
    }
};

const advancedAnalysis = {
    analyzeSentiment(input) {
        const positive = ['good', 'great', 'awesome', 'love', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect'];
        const negative = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disgusting', 'worst', 'disappointing'];
        
        const words = input.toLowerCase().split(' ');
        let score = 0;
        
        words.forEach(word => {
            if (positive.includes(word)) score++;
            if (negative.includes(word)) score--;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    },

    extractEntities(input) {
        const entities = { foods: [], quantities: [], prices: [] };
        
        const quantityMatches = input.match(/(\d+)\s*(pieces?|items?|plates?|bowls?|cups?)?/gi);
        if (quantityMatches) {
            entities.quantities = quantityMatches.map(m => parseInt(m.match(/\d+/)[0]));
        }
        
        nearbyRestaurants.forEach(restaurant => {
            Object.values(restaurant.menu).flat().forEach(item => {
                if (input.toLowerCase().includes(item.name.toLowerCase())) {
                    entities.foods.push(item.name);
                }
            });
        });
        
        return entities;
    },

    recognizeIntent(input) {
        const patterns = {
            greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            recommendation: ['recommend', 'suggest', 'best', 'popular', 'favorite', 'good', 'tasty'],
            complaint: ['problem', 'issue', 'wrong', 'bad', 'terrible', 'complaint'],
            compliment: ['great', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love']
        };
        
        const inputLower = input.toLowerCase();
        for (const [intent, keywords] of Object.entries(patterns)) {
            if (keywords.some(keyword => inputLower.includes(keyword))) {
                return intent;
            }
        }
        return 'general';
    }
};

// Dynamic response generator with personality
const intelligentResponses = {
    generateResponse(input, context) {
        const sentiment = advancedAnalysis.analyzeSentiment(input);
        const entities = advancedAnalysis.extractEntities(input);
        const intent = advancedAnalysis.recognizeIntent(input);
        
        switch (intent) {
            case 'greeting':
                return this.handleGreeting(sentiment);
            case 'recommendation':
                return this.handleRecommendation(entities);
            case 'complaint':
                return "Oh no! I'm really sorry to hear that. 😔 Your experience matters to us. Can you tell me more about what happened? I'll make sure to address this right away. 💙";
            case 'compliment':
                return "Aww, thank you so much! 😊 That really makes my day! I'm so happy you're enjoying everything!";
            default:
                return this.handleGeneral(input, entities);
        }
    },

    handleGreeting(sentiment) {
        const greetings = [
            "Hello! Welcome to our restaurant family! 😊 What can I help you discover today?",
            "Hi there! I'm excited to help you find some amazing food! 🍽️",
            "Hey! Great to see you here. Ready for a delicious adventure? ✨",
            "Welcome! I'm your friendly food assistant. What sounds good to you today? 🤔"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    },

    handleRecommendation(entities) {
        const restaurant = nearbyRestaurants[currentRestaurantIndex];
        const specials = restaurant.specials;
        
        if (entities.foods.length > 0) {
            return `Great taste! ${entities.foods[0]} is an excellent choice! Would you like me to add it to your cart? 😋`;
        }
        
        return `Oh, I have fantastic recommendations! Our customers absolutely love ${specials[0]} and ${specials[1]}! They're chef's specials! 🌟 Would you like to try one?`;
    },

    handleGeneral(input, entities) {
        if (entities.foods.length > 0) {
            return `I noticed you mentioned ${entities.foods.join(', ')}! That sounds delicious. Would you like me to find it for you? 🔍`;
        }
        
        const helpfulResponses = [
            "I'm here to help! What would you like to know more about? 😊",
            "Interesting! How can I assist you with that? 🤔",
            "I want to make sure I help you perfectly. Could you tell me a bit more? 💭"
        ];
        
        return helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)];
    }
};

// Expanded and enriched nearby restaurants
const nearbyRestaurants = [
    {
        name: 'Spice Garden',
        location: 'Nagaram-Dammiguda, Hyderabad',
        rating: 4.5,
        cuisine: ['North Indian', 'Chinese'],
        hours: '11:00 AM - 11:00 PM',
        contact: '+91 98765 43210',
        specials: ['Paneer Butter Masala', 'Chicken Biryani'],
        menu: {
            starters: [
                { name: 'Paneer Tikka', price: 160, description: 'Grilled cottage cheese cubes', icon: '🧀', image: '' },
                { name: 'Veg Manchurian', price: 140, description: 'Crispy veg balls in spicy sauce', icon: '🥦', image: '' }
            ],
            mainCourse: [
                { name: 'Paneer Butter Masala', price: 220, description: 'Creamy tomato paneer curry', icon: '🧀', image: '' },
                { name: 'Chicken Biryani', price: 250, description: 'Aromatic rice with chicken', icon: '🍗', image: '' }
            ],
            breads: [
                { name: 'Butter Naan', price: 40, description: 'Soft naan with butter', icon: '🥖', image: '' }
            ],
            desserts: [
                { name: 'Gulab Jamun', price: 80, description: 'Sweet syrupy balls', icon: '🍬', image: '' }
            ],
            drinks: [
                { name: 'Mango Lassi', price: 60, description: 'Sweet mango yogurt drink', icon: '🥭', image: '' }
            ]
        }
    },
    {
        name: 'Biryani House',
        location: 'Nagaram, Hyderabad',
        rating: 4.2,
        cuisine: ['Hyderabadi', 'Mughlai'],
        hours: '12:00 PM - 10:30 PM',
        contact: '+91 91234 56789',
        specials: ['Hyderabadi Biryani', 'Double Ka Meetha'],
        menu: {
            starters: [
                { name: 'Chicken 65', price: 180, description: 'Spicy fried chicken bites', icon: '🍗', image: '' },
                { name: 'Paneer Pakoda', price: 140, description: 'Crispy paneer fritters', icon: '🧀', image: '' }
            ],
            mainCourse: [
                { name: 'Hyderabadi Biryani', price: 260, description: 'Authentic dum biryani', icon: '🍚', image: '' },
                { name: 'Egg Curry', price: 160, description: 'Eggs in spicy gravy', icon: '🥚', image: '' }
            ],
            breads: [
                { name: 'Rumali Roti', price: 30, description: 'Thin soft roti', icon: '🥖', image: '' }
            ],
            desserts: [
                { name: 'Double Ka Meetha', price: 90, description: 'Hyderabadi bread pudding', icon: '🍞', image: '' }
            ],
            drinks: [
                { name: 'Sweet Lassi', price: 60, description: 'Chilled sweet yogurt drink', icon: '🥛', image: '' }
            ]
        }
    },
    {
        name: 'Tandoori Nights',
        location: 'Dammiguda, Hyderabad',
        rating: 4.3,
        cuisine: ['Punjabi', 'Tandoor'],
        hours: '1:00 PM - 11:00 PM',
        contact: '+91 99887 66554',
        specials: ['Tandoori Chicken', 'Kulfi'],
        menu: {
            starters: [
                { name: 'Tandoori Chicken', price: 220, description: 'Char-grilled chicken', icon: '🍗', image: '' },
                { name: 'Veg Seekh Kebab', price: 150, description: 'Spiced vegetable kebabs', icon: '🥕', image: '' }
            ],
            mainCourse: [
                { name: 'Butter Chicken', price: 250, description: 'Creamy tomato chicken curry', icon: '🍛', image: '' },
                { name: 'Dal Tadka', price: 130, description: 'Yellow dal with tadka', icon: '🥣', image: '' }
            ],
            breads: [
                { name: 'Tandoori Roti', price: 25, description: 'Clay oven baked roti', icon: '🥖', image: '' }
            ],
            desserts: [
                { name: 'Kulfi', price: 80, description: 'Traditional Indian ice cream', icon: '🍦', image: '' }
            ],
            drinks: [
                { name: 'Masala Chai', price: 40, description: 'Spiced tea', icon: '🍵', image: '' }
            ]
        }
    },
    {
        name: 'Urban Dosa',
        location: 'ECIL, Hyderabad',
        rating: 4.6,
        cuisine: ['South Indian'],
        hours: '7:00 AM - 10:00 PM',
        contact: '+91 90000 12345',
        specials: ['Masala Dosa', 'Filter Coffee'],
        menu: {
            starters: [
                { name: 'Idli', price: 40, description: 'Steamed rice cakes', icon: '🍥', image: '' },
                { name: 'Vada', price: 45, description: 'Crispy lentil doughnuts', icon: '🍩', image: '' }
            ],
            mainCourse: [
                { name: 'Masala Dosa', price: 70, description: 'Crispy dosa with potato filling', icon: '🌯', image: '' },
                { name: 'Pesarattu', price: 60, description: 'Green gram dosa', icon: '🥞', image: '' }
            ],
            breads: [
                { name: 'Plain Dosa', price: 50, description: 'Classic dosa', icon: '🌯', image: '' }
            ],
            desserts: [
                { name: 'Kesari Bath', price: 50, description: 'Sweet semolina dessert', icon: '🍮', image: '' }
            ],
            drinks: [
                { name: 'Filter Coffee', price: 30, description: 'Strong South Indian coffee', icon: '☕', image: '' }
            ]
        }
    },
    {
        name: 'Pizza Point',
        location: 'AS Rao Nagar, Hyderabad',
        rating: 4.1,
        cuisine: ['Italian', 'Fast Food'],
        hours: '11:00 AM - 11:30 PM',
        contact: '+91 91111 22222',
        specials: ['Margherita Pizza', 'Garlic Bread'],
        menu: {
            starters: [
                { name: 'Garlic Bread', price: 90, description: 'Toasted bread with garlic', icon: '🍞', image: '' },
                { name: 'Cheesy Sticks', price: 100, description: 'Bread sticks with cheese', icon: '🧀', image: '' }
            ],
            mainCourse: [
                { name: 'Margherita Pizza', price: 180, description: 'Classic cheese pizza', icon: '🍕', image: '' },
                { name: 'Farmhouse Pizza', price: 220, description: 'Veggie loaded pizza', icon: '🍕', image: '' }
            ],
            breads: [
                { name: 'Stuffed Crust', price: 60, description: 'Cheese filled crust', icon: '🧀', image: '' }
            ],
            desserts: [
                { name: 'Choco Lava Cake', price: 80, description: 'Warm chocolate cake', icon: '🍫', image: '' }
            ],
            drinks: [
                { name: 'Pepsi', price: 40, description: 'Chilled soft drink', icon: '🥤', image: '' }
            ]
        }
    }
];

let currentRestaurantIndex = 0; // Default to Spice Garden

// Enhanced initChatbot with personality
function initChatbot() {
    // Progressive welcome messages for more engaging experience
    setTimeout(() => {
        addBotMessage(`👋 Hello! I'm your AI food assistant at ${restaurantInfo.name}!`);
    }, 500);
    
    setTimeout(() => {
        addBotMessage(`🏠 We're located in ${state.location.address} and I'm here to make your dining experience amazing! ✨`);
    }, 1500);
    
    setTimeout(() => {
        const welcomeMsg = `I'm powered by advanced AI and can help you with:\n\n• 🍽️ Exploring our delicious menu\n• 🛒 Placing orders with smart recommendations\n• 💳 Secure payment processing\n• 🚚 Real-time order tracking\n• 📍 Finding nearby restaurants\n\nJust chat with me naturally - I understand what you're looking for! What sounds good today?`;
        addBotMessage(welcomeMsg);
    }, 2500);

    // Event Listeners with enhanced feedback
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUserInput();
        }
    });

    // Add typing feedback while user is typing
    let typingTimeout;
    userInput.addEventListener('input', () => {
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            // Could add "user is typing" indicators here
        }, 300);
    });

    // Global click event handler for menu item buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('menu-item-btn')) {
            const itemName = decodeURIComponent(e.target.getAttribute('data-item'));
            console.log('Menu item clicked:', itemName); // Debug log
            console.log('Current cart before click processing:', state.cart);
            // Simulate user typing the item name
            processUserInput(itemName);
        }
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        addBotMessage("Theme switched! 🎨 I can adapt to your preferences just like this!");
    });
}

// Message Handling
function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat with animation
    addUserMessage(message);
    userInput.value = '';

    // Show immediate typing acknowledgment
    showTypingIndicator();
    
    // Add a brief pause to simulate the bot "reading" the message
    setTimeout(() => {
        processUserInput(message);
    }, 500);
}

function processUserInput(input) {
    // Add to conversation memory
    conversationMemory.addMessage('user', input);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate realistic thinking time based on input complexity
    const complexity = input.split(' ').length;
    const thinkingTime = Math.min(800 + (complexity * 100), 2000);
    
    setTimeout(() => {
        // Convert input to lowercase for easier matching
        const userInput = input.toLowerCase().trim();

        // Handle special commands first
        if (userInput === 'place order' || userInput === 'place an order') {
            removeTypingIndicator();
            processOrder();
            return;
        }

        if (userInput === 'payment' || userInput === 'pay') {
            removeTypingIndicator();
            processPayment();
            return;
        }

        if (userInput === 'track' || userInput === 'track order') {
            removeTypingIndicator();
            trackOrder();
            return;
        }

        if (userInput === 'menu' || userInput === 'show menu') {
            removeTypingIndicator();
            showMenu();
            return;
        }

        if (userInput === 'cart' || userInput === 'show cart') {
            removeTypingIndicator();
            showCart();
            return;
        }

        if (userInput === 'nearby' || userInput === 'nearby restaurants' || userInput === 'restaurants nearby' || userInput === 'show nearby restaurants') {
            removeTypingIndicator();
            showNearbyRestaurants();
            return;
        }

        // Handle selecting a nearby restaurant by name or number
        for (let i = 0; i < nearbyRestaurants.length; i++) {
            if (userInput === nearbyRestaurants[i].name.toLowerCase() || userInput === String(i + 1)) {
                currentRestaurantIndex = i;
                removeTypingIndicator();
                addBotMessage(`You selected ${nearbyRestaurants[i].name}. Here is their menu:`);
                showMenu();
                return;
            }
        }

        // Handle payment method selection
        if (state.currentStep === 'payment') {
            if (userInput === 'cancel') {
                state.currentStep = 'order_confirmed';
                removeTypingIndicator();
                addBotMessage("Payment cancelled. You can try again later by typing 'payment'.");
                return;
            }

            const paymentMethod = userInput.toLowerCase();
            if (['upi', 'card', 'netbanking', 'cod'].includes(paymentMethod)) {
                removeTypingIndicator();
                addBotMessage("Processing payment...");
                setTimeout(() => {
                    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
                    order.paymentStatus = 'completed';
                    sessionStorage.setItem('currentOrder', JSON.stringify(order));
                    addBotMessage("✅ Payment successful! Your order will be prepared shortly.");
                    state.currentStep = 'order_confirmed';
                }, 2000);
                return;
            }
        }

        // Handle menu item selection
        const selectedItem = findMenuItem(userInput);
        if (selectedItem) {
            console.log('=== MENU ITEM SELECTION DEBUG ===');
            console.log('Selected item:', selectedItem);
            console.log('Current cart before adding:', state.cart);
            
            const quantity = conversationAnalysis.extractQuantity(input);
            console.log('Quantity to add:', quantity);
            
            // Add items to cart
            for (let i = 0; i < quantity; i++) {
                addToCart(selectedItem);
            }
            
            // Wait a moment for cart to update, then generate message
            setTimeout(() => {
                console.log('Cart after adding items:', state.cart);
                
                // Get updated cart info
                const cartItemCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                const cartTotal = calculateTotal();
                
                console.log('Final cart count:', cartItemCount);
                console.log('Final cart total:', cartTotal);
                
                // Generate confirmation message with updated cart info
                let message = `✅ Perfect choice! I've added ${selectedItem.name} to your cart.\n`;
                message += `Price: ₹${selectedItem.price.toFixed(2)}\n`;
                if (quantity > 1) {
                    message += `Quantity: ${quantity}\n`;
                    message += `Subtotal: ₹${(selectedItem.price * quantity).toFixed(2)}\n`;
                }
                
                message += `\nYour cart now has ${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}.\n`;
                message += `Total: ₹${cartTotal.toFixed(2)}\n\n`;
                
                message += `What else can I get for you? 😊\n`;
                message += `• Add more items by clicking or typing their names\n`;
                message += `• Type 'cart' to review your order\n`;
                message += `• Type 'place order' when you're ready`;
                
                removeTypingIndicator();
                addBotMessage(message);
                conversationMemory.addMessage('assistant', message);
                console.log('=== END MENU ITEM SELECTION DEBUG ===');
            }, 100); // Small delay to ensure cart is updated
            
            return;
        }

        // Check for common questions
        const qaMatch = checkCommonQuestions(input);
        if (qaMatch) {
            removeTypingIndicator();
            addBotMessage(qaMatch);
            conversationMemory.addMessage('assistant', qaMatch);
            return;
        }

        // Use intelligent response generation for everything else
        const response = intelligentResponses.generateResponse(input, conversationMemory.getRecentContext());
        removeTypingIndicator();
        addBotMessage(response);
        conversationMemory.addMessage('assistant', response);
        
        // Auto-suggest follow-up actions based on context
        setTimeout(() => {
            const followUp = generateFollowUpSuggestion(input);
            if (followUp) {
                addBotMessage(followUp);
                conversationMemory.addMessage('assistant', followUp);
            }
        }, 1500);
        
    }, thinkingTime);
}

// Generate contextual follow-up suggestions
function generateFollowUpSuggestion(input) {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('hungry') || inputLower.includes('food')) {
        return "Since you're hungry, would you like me to show you our quick bites or today's specials? 🍽️";
    }
    
    if (inputLower.includes('budget') || inputLower.includes('cheap') || inputLower.includes('affordable')) {
        return "I can help you find great value options! Would you like to see our budget-friendly dishes under ₹150? 💰";
    }
    
    if (inputLower.includes('spicy') || inputLower.includes('hot')) {
        return "Love spicy food? 🌶️ Our chef's special hot dishes are incredible! Want to see them?";
    }
    
    if (inputLower.includes('vegetarian') || inputLower.includes('veg')) {
        return "Great! We have amazing vegetarian options. Would you like to see our pure veg menu? 🥗";
    }
    
    return null;
}

// Enhanced message display with personality
function addBotMessage(message) {
    // Remove typing indicator first
    removeTypingIndicator();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    
    // Add message with enhanced formatting and emoji support
    messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    
    // Add fade-in animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    chatMessages.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 50);
    
    scrollToBottom();
}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.textContent = message;
    
    // Add slide-in animation from right
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateX(20px)';
    
    chatMessages.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 50);
    
    scrollToBottom();
}

function showTypingIndicator() {
    // Remove any existing typing indicator
    removeTypingIndicator();
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    
    // Add some personality to typing indicator
    const thinkingMessages = [
        '🤔 Thinking...',
        '💭 Processing...',
        '🧠 Analyzing...',
        '✨ Crafting response...'
    ];
    
    // Randomly show a thinking message sometimes
    if (Math.random() < 0.3) {
        indicator.innerHTML = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
    }
    
    chatMessages.appendChild(indicator);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicators = chatMessages.querySelectorAll('.typing-indicator');
    indicators.forEach(indicator => {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 200);
    });
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Conversation Handlers
function handleGreeting(message) {
    if (message.includes('menu')) {
        state.currentStep = 'menu';
        showMenu();
    } else if (message.includes('order')) {
        state.currentStep = 'order_type';
        addBotMessage("Would you like to dine-in or have it delivered? We deliver within 5km of our location.");
    } else if (message.includes('reservation')) {
        state.currentStep = 'reservation';
        addBotMessage("I'll help you make a reservation. How many people will be dining?");
    } else if (message.includes('track')) {
        addBotMessage("Your order #1234 is being prepared and will be ready in 15 minutes.");
    } else if (message.includes('location') || message.includes('address')) {
        addBotMessage(qaDatabase.location);
    } else if (message.includes('timing') || message.includes('open')) {
        addBotMessage(qaDatabase.timings);
    } else if (message.includes('special') || message.includes('best')) {
        addBotMessage(qaDatabase.specialties);
    } else {
        addBotMessage(`Welcome to ${restaurantInfo.name}! How can I help you today? You can:\n1. View our menu\n2. Place an order\n3. Make a reservation\n4. Track your order\n5. Ask about our location, timings, or specialties`);
    }
}

function showMenu() {
    const restaurant = nearbyRestaurants[currentRestaurantIndex];
    let menuMessage = `🍴 <b>${restaurant.name}</b> (${restaurant.location})<br>`;
    menuMessage += `⭐ Rating: ${restaurant.rating} | ${restaurant.cuisine.join(', ')}<br>`;
    menuMessage += `🕒 Hours: ${restaurant.hours} | 📞 ${restaurant.contact}<br>`;
    menuMessage += `<br><b>Today's Specials:</b> ${restaurant.specials.join(', ')}<br>`;
    menuMessage += "<br>🍽️ <b>Our Menu:</b><br>";
    const renderItems = (category, emoji, label) => {
        if (restaurant.menu[category] && Array.isArray(restaurant.menu[category]) && restaurant.menu[category].length) {
            menuMessage += `<br>${emoji} <b>${label}:</b><br>`;
            restaurant.menu[category].forEach(item => {
                menuMessage += `<button class='menu-item-btn' data-item='${encodeURIComponent(item.name)}' style='margin:2px;padding:4px 10px;border-radius:6px;border:none;background:#ffe5b4;cursor:pointer;'>${item.icon || ''} <b>${item.name}</b>: ₹${item.price} (${item.description})</button><br>`;
            });
        }
    };
    renderItems('starters', '🥘', 'Starters');
    renderItems('mainCourse', '🍖', 'Main Course');
    renderItems('breads', '🥖', 'Breads');
    renderItems('desserts', '🍰', 'Desserts');
    renderItems('drinks', '🥤', 'Drinks');
    menuMessage += "<br>Click an item to add to your cart, or type its name. You can also ask about our specialties or any specific dish!";
    removeTypingIndicator();
    addBotMessage(menuMessage);
}

function handleMenuSelection(message) {
    // Simple menu item selection logic
    const allItems = [...menu.starters, ...menu.mainCourse, ...menu.breads, ...menu.desserts, ...menu.drinks];
    const selectedItem = allItems.find(item => 
        message.toLowerCase().includes(item.name.toLowerCase())
    );

    if (selectedItem) {
        state.order.items.push(selectedItem);
        addBotMessage(`Added ${selectedItem.name} to your order. Would you like to add anything else?`);
    } else {
        addBotMessage("I couldn't find that item. Please check the menu and try again.");
    }
}

function handleOrderType(message) {
    if (message.includes('dine')) {
        state.order.type = 'dine-in';
        addBotMessage("Great! How many people will be dining?");
    } else if (message.includes('deliver')) {
        state.order.type = 'delivery';
        addBotMessage(`Please provide your delivery address. We deliver within 5km of our location (${state.location.address}). Minimum order for delivery is ₹${restaurantInfo.minimumOrder}.`);
    } else {
        addBotMessage("Please choose between dine-in or delivery.");
    }
}

function handleReservation(message) {
    if (!state.reservation.people) {
        const people = parseInt(message);
        if (isNaN(people) || people < 1) {
            addBotMessage("Please enter a valid number of people.");
            return;
        }
        state.reservation.people = people;
        addBotMessage("What date would you like to make the reservation for? (DD/MM/YYYY)");
    } else if (!state.reservation.date) {
        // Simple date validation
        if (!message.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            addBotMessage("Please enter the date in DD/MM/YYYY format.");
            return;
        }
        state.reservation.date = message;
        addBotMessage("What time would you like to make the reservation for? (HH:MM)");
    } else if (!state.reservation.time) {
        // Simple time validation
        if (!message.match(/^\d{2}:\d{2}$/)) {
            addBotMessage("Please enter the time in HH:MM format.");
            return;
        }
        state.reservation.time = message;
        addBotMessage("Please provide your name and phone number.");
    } else {
        // Assuming the last message contains name and phone
        state.reservation.name = message;
        addBotMessage(`Reservation confirmed!\nDate: ${state.reservation.date}\nTime: ${state.reservation.time}\nPeople: ${state.reservation.people}\nThank you for choosing us!`);
        state.currentStep = 'greeting';
    }
}

function handleDefaultResponse(message) {
    addBotMessage("I'm not sure I understand. You can:\n1. View our menu\n2. Place an order\n3. Make a reservation\n4. Track your order");
}

// Add these new functions after the existing functions but before the initChatbot function

function processOrder() {
    if (state.cart.length === 0) {
        addBotMessage("Your cart is empty. Please add some items before placing an order.");
        return;
    }

    const orderNumber = generateOrderNumber();
    const orderSummary = {
        orderNumber,
        items: state.cart,
        total: calculateTotal(),
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
    };

    // Store order in session storage
    sessionStorage.setItem('currentOrder', JSON.stringify(orderSummary));
    
    // Clear cart
    state.cart = [];
    updateCartUI();

    // Show order confirmation
    let message = `🎉 Order placed successfully!\n\n`;
    message += `Order #${orderNumber}\n\n`;
    message += `Items ordered:\n`;
    orderSummary.items.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nTotal: ₹${orderSummary.total.toFixed(2)}`;
    message += `\n\nEstimated delivery time: ${new Date(orderSummary.estimatedDelivery).toLocaleTimeString()}`;
    message += `\n\nProceeding to payment...`;

    addBotMessage(message);
    state.currentStep = 'order_confirmed';
    
    // Automatically proceed to payment after a short delay
    setTimeout(() => {
        processPayment();
    }, 2000);
}

function processPayment() {
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
    if (!order) {
        addBotMessage("No active order found. Please place an order first.");
        return;
    }

    if (order.paymentStatus === 'completed') {
        addBotMessage("This order has already been paid for.");
        return;
    }

    state.currentStep = 'payment';
    let message = "💳 Payment Options:\n\n";
    message += "1. UPI (Google Pay, PhonePe, Paytm)\n";
    message += "2. Credit/Debit Card\n";
    message += "3. Net Banking\n";
    message += "4. Cash on Delivery\n\n";
    message += "Please type your preferred payment method or 'cancel' to go back.";

    addBotMessage(message);
}

function trackOrder() {
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
    if (!order) {
        addBotMessage("No active order found. Please place an order first.");
        return;
    }

    const now = new Date();
    const deliveryTime = new Date(order.estimatedDelivery);
    const timeLeft = Math.max(0, Math.floor((deliveryTime - now) / 60000)); // minutes left

    let status = "🔄";
    if (timeLeft <= 0) {
        status = "✅";
    } else if (timeLeft <= 15) {
        status = "🚚";
    }

    let message = `${status} Order Tracking\n\n`;
    message += `Order #${order.orderNumber}\n\n`;
    message += `Status: ${order.status}\n`;
    message += `Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleTimeString()}\n`;
    
    if (timeLeft > 0) {
        message += `Time remaining: ${timeLeft} minutes\n`;
    } else {
        message += `Your order should be arriving any moment now!\n`;
    }

    if (order.paymentStatus === 'completed') {
        message += `\nPayment Status: ✅ Paid`;
    } else {
        message += `\nPayment Status: ⏳ Pending`;
        message += `\nType "payment" to complete the payment.`;
    }

    addBotMessage(message);
}

// Update findMenuItem to check for missing categories
function findMenuItem(input) {
    const searchInput = input.toLowerCase().trim();
    const restaurant = nearbyRestaurants[currentRestaurantIndex];
    if (!restaurant.menu) return null;
    for (const category of ['starters', 'mainCourse', 'breads', 'desserts', 'drinks']) {
        if (!restaurant.menu[category] || !Array.isArray(restaurant.menu[category])) continue;
        const items = restaurant.menu[category];
        for (const item of items) {
            if (item.name.toLowerCase().includes(searchInput) || item.description.toLowerCase().includes(searchInput)) {
                return item;
            }
        }
    }
    return null;
}

// Add a function to show nearby restaurants
function showNearbyRestaurants() {
    let message = "Here are some restaurants near you:\n";
    nearbyRestaurants.forEach((rest, idx) => {
        message += `${idx + 1}. ${rest.name} (${rest.location})\n`;
    });
    message += "\nType the restaurant name or number to see its menu.";
    removeTypingIndicator();
    addBotMessage(message);
}

// Fix cart management functions with proper state handling
function addToCart(item) {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('Item received:', item);
    console.log('Current state object:', state);
    console.log('Current cart before adding:', state.cart);
    
    if (!item) {
        console.error('No item provided to addToCart');
        return;
    }
    
    // Ensure state.cart exists and is an array
    if (!state.cart || !Array.isArray(state.cart)) {
        console.log('Initializing cart as empty array');
        state.cart = [];
    }
    
    // Find existing item in cart
    const existingItem = state.cart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        console.log('Updated existing item quantity:', existingItem.quantity);
    } else {
        const newItem = {
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: 1
        };
        state.cart.push(newItem);
        console.log('Added new item to cart:', newItem);
    }
    
    console.log('Cart after adding:', state.cart);
    console.log('Cart length:', state.cart.length);
    console.log('=== END ADD TO CART DEBUG ===');
    
    updateCartUI();
}

function calculateTotal() {
    console.log('=== CALCULATE TOTAL DEBUG ===');
    console.log('Cart for calculation:', state.cart);
    
    if (!state.cart || !Array.isArray(state.cart) || state.cart.length === 0) {
        console.log('Cart is empty or invalid, returning 0');
        return 0;
    }
    
    const total = state.cart.reduce((sum, item) => {
        const itemTotal = item.price * (item.quantity || 1);
        console.log(`Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}, Subtotal: ${itemTotal}`);
        return sum + itemTotal;
    }, 0);
    
    console.log('Total calculated:', total);
    console.log('=== END CALCULATE TOTAL DEBUG ===');
    return total;
}

function updateCartUI() {
    console.log('=== UPDATE CART UI DEBUG ===');
    console.log('Current cart for UI update:', state.cart);
    
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        console.log('Updated cart UI with total items:', totalItems);
    } else {
        console.log('Cart count element not found');
    }
    console.log('=== END UPDATE CART UI DEBUG ===');
}

function showCart() {
    if (!state.cart || state.cart.length === 0) {
        addBotMessage("Your cart is empty! 🛒\n\nWould you like to browse our menu to add some delicious items?");
        return;
    }
    
    let cartMessage = "🛒 Your Cart:\n\n";
    state.cart.forEach(item => {
        cartMessage += `• ${item.name} x${item.quantity || 1} - ₹${(item.price * (item.quantity || 1)).toFixed(2)}\n`;
    });
    
    const total = calculateTotal();
    cartMessage += `\n💰 Total: ₹${total.toFixed(2)}\n\n`;
    cartMessage += "Ready to order? Type 'place order' or add more items! 😊";
    
    addBotMessage(cartMessage);
}

function generateOrderNumber() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initChatbot); 