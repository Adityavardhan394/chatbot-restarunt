# 🍽️ RestaurantBot AI - Advanced Culinary Assistant

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Preview-orange?style=for-the-badge)](https://adityavardhan394.github.io/chatbot-restarunt/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, intelligent restaurant chatbot with ChatGPT-like conversational abilities, stunning animations, and comprehensive restaurant management features. Built with pure HTML5, CSS3, and JavaScript.

## 🌟 Key Features

### 🤖 Advanced AI Capabilities
- **ChatGPT-style Conversations**: Natural language processing for human-like interactions
- **Context Awareness**: Remembers conversation history and user preferences
- **Intent Recognition**: Accurately understands user requests (menu, orders, reservations, etc.)
- **Multi-turn Conversations**: Maintains context across multiple exchanges
- **Personalized Responses**: Adapts responses based on user interaction patterns

### 🎨 Modern Design & Animations
- **Stunning Visual Design**: Modern gradients, shadows, and color schemes
- **Logo Animations**: Pulsing, rotating, and shimmer effects
- **Smooth Transitions**: CSS3 animations with cubic-bezier timing
- **Particle System**: Floating food emojis background animation
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes with smooth transitions

### 🍴 Restaurant Features
- **Complete Menu System**: Appetizers, mains, desserts, and beverages
- **Order Management**: Add items to cart, view order summary
- **Dietary Filters**: Vegetarian, vegan, gluten-free options
- **Reservation Booking**: Intelligent reservation assistance
- **Popular Recommendations**: AI-powered dish suggestions
- **Special Offers**: Happy hour, daily specials, tasting menus

### 💬 Interactive Chat Interface
- **Typing Indicators**: Realistic bot typing animation
- **Message Timestamps**: Clear conversation timeline
- **Quick Action Buttons**: One-click access to common requests
- **Auto-expanding Input**: Text area grows with content
- **Character Counter**: Real-time input feedback
- **Voice Input Ready**: Microphone icon for future voice integration

### 🚀 Performance & UX
- **Smooth Animations**: 60fps animations with hardware acceleration
- **Intersection Observer**: Efficient scroll-based animations
- **Lazy Loading**: Optimized resource loading
- **Accessibility**: ARIA labels and keyboard navigation
- **Progressive Enhancement**: Works without JavaScript
- **SEO Optimized**: Semantic HTML structure

## 🎯 Demo Features

Try these interactions with the chatbot:

```
🗣️ "Show me today's menu"
🗣️ "I want to make a reservation for 4 people"
🗣️ "What are your popular dishes?"
🗣️ "Do you have vegetarian options?"
🗣️ "I'd like to order the Grilled Salmon"
🗣️ "What are your hours?"
🗣️ "Where are you located?"
```

## 🛠️ Installation & Setup

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/Adityavardhan394/chatbot-restarunt.git
   ```

2. Navigate to the project directory:
   ```bash
   cd chatbot-restarunt
   ```

3. Open `index.html` in your browser or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```

4. Visit `http://localhost:8000` in your browser

### File Structure
```
chatbot-restarunt/
├── index.html              # Main HTML file
├── styles/
│   └── style.css           # Modern CSS with animations
├── js/
│   ├── main.js            # Core functionality
│   ├── chatbot.js         # AI engine
│   └── animations.js      # Advanced animations
└── README.md              # This file
```

## 🧠 AI Engine Architecture

### Intent Recognition System
The chatbot uses a sophisticated intent detection system:

```javascript
// Example intent detection
{
  greeting: "Hello! Welcome to Culinary Haven! 👋",
  menu_inquiry: "Here's our appetizers selection...",
  order_item: "Excellent choice! Would you like to add this?",
  dietary_restrictions: "We have many vegetarian options...",
  reservation: "I'd be happy to help with your reservation..."
}
```

### Menu Database
Comprehensive menu with structured data:
- **25+ Menu Items** across 4 categories
- **Dietary Information** (vegetarian, vegan, gluten-free)
- **Dynamic Pricing** and descriptions
- **Popularity Tracking** for recommendations

### Conversation Memory
- Maintains conversation history
- Tracks user preferences
- Context-aware responses
- Order session management

## 🎨 Design System

### Color Palette
```css
Primary: #ff6b35 (Orange)
Secondary: #4ecdc4 (Teal)
Accent: #ffd700 (Gold)
Background: Linear gradients
Text: Modern typography hierarchy
```

### Animation Library
- **Logo Animations**: Pulse, shimmer, hover effects
- **Message Transitions**: Slide-in animations
- **Button Effects**: Ripple and wave animations
- **Particle System**: Floating food emojis
- **Theme Transitions**: Smooth dark/light mode

### Responsive Breakpoints
- **Desktop**: 1200px+ (Full features)
- **Tablet**: 768px-1199px (Optimized layout)
- **Mobile**: <768px (Touch-friendly interface)

## 🔧 Customization

### Adding New Menu Items
```javascript
// In js/chatbot.js - restaurantData.menu
appetizers: [
  {
    id: 19,
    name: "Your New Dish",
    price: 12.99,
    description: "Delicious description",
    dietary: ["vegetarian", "gluten-free"]
  }
]
```

### Customizing Responses
```javascript
// In js/chatbot.js - generateGreeting()
const greetings = [
  "Your custom greeting message...",
  "Another variation...",
];
```

### Modifying Animations
```css
/* In styles/style.css */
.logo-icon {
  animation: yourCustomAnimation 2s ease-in-out infinite;
}

@keyframes yourCustomAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1); }
}
```

## 📱 Mobile Optimization

- **Touch-friendly Interface**: Large buttons and tap targets
- **Gesture Support**: Swipe and touch interactions
- **Performance Optimized**: Reduced animations on mobile
- **Viewport Optimized**: Perfect scaling on all devices
- **Loading Optimization**: Efficient resource loading

## 🔮 Future Enhancements

### Planned Features
- [ ] **Voice Recognition**: Speech-to-text input
- [ ] **Real-time Updates**: WebSocket connections
- [ ] **Payment Integration**: Stripe/PayPal checkout
- [ ] **Multi-language Support**: i18n implementation
- [ ] **Analytics Dashboard**: Usage tracking
- [ ] **Admin Panel**: Menu management interface
- [ ] **Push Notifications**: Order status updates
- [ ] **Social Integration**: Share orders and reviews

### API Integration Ready
The chatbot is designed to easily integrate with:
- **OpenAI GPT API**: For enhanced conversational AI
- **Restaurant POS Systems**: For real-time orders
- **Reservation Systems**: For table booking
- **Payment Processors**: For order checkout
- **Analytics Platforms**: For usage insights

## 🎯 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full Support |
| Firefox | 55+     | ✅ Full Support |
| Safari  | 12+     | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex functions
- Test on multiple browsers
- Optimize for performance
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Font Awesome** for beautiful icons
- **Google Fonts** for Poppins typography
- **Modern CSS** techniques and best practices
- **JavaScript ES6+** features and APIs
- **Community feedback** and suggestions

## 📧 Contact

**Aditya Vardhan** - [GitHub Profile](https://github.com/Adityavardhan394)

Project Link: [https://github.com/Adityavardhan394/chatbot-restarunt](https://github.com/Adityavardhan394/chatbot-restarunt)

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ for the restaurant industry

</div> 