// Cart Management
const cart = {
    items: [],
    total: 0,
    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.updateTotal();
        this.updateCartUI();
    },
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            if (this.items[index].quantity > 1) {
                this.items[index].quantity--;
            } else {
                this.items.splice(index, 1);
            }
            this.updateTotal();
            this.updateCartUI();
        }
    },
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    },
    clear() {
        this.items = [];
        this.total = 0;
        this.updateCartUI();
    },
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
        }
    }
};

// Menu Display Functions
function createMenuCard(item) {
    return `
        <div class="menu-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div class="relative">
                <img src="assets/${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-sm">
                    ₹${item.price}
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${item.name}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">${item.description}</p>
                <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center space-x-2">
                        <button onclick="decreaseQuantity(${item.id})" 
                                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
                            <i class="fas fa-minus text-sm"></i>
                        </button>
                        <span id="quantity-${item.id}" class="text-gray-800 dark:text-white">0</span>
                        <button onclick="increaseQuantity(${item.id})" 
                                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
                            <i class="fas fa-plus text-sm"></i>
                        </button>
                    </div>
                    <button onclick="addToCart(${item.id})" 
                            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                        Add to Order
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayMenuSection(category, items) {
    const section = document.createElement('div');
    section.className = 'mb-8';
    section.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">${category}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${items.map(item => createMenuCard(item)).join('')}
        </div>
    `;
    return section;
}

// Cart Functions
function addToCart(itemId) {
    const allItems = [...menu.starters, ...menu.mainCourse, ...menu.breads, ...menu.desserts, ...menu.drinks];
    const item = allItems.find(item => item.id === itemId);
    if (item) {
        cart.addItem(item);
        updateQuantityDisplay(itemId);
        showNotification(`${item.name} added to cart!`);
    }
}

function removeFromCart(itemId) {
    cart.removeItem(itemId);
    updateQuantityDisplay(itemId);
    showNotification('Item removed from cart');
}

function increaseQuantity(itemId) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    if (quantityElement) {
        const currentQuantity = parseInt(quantityElement.textContent) || 0;
        quantityElement.textContent = currentQuantity + 1;
    }
}

function decreaseQuantity(itemId) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    if (quantityElement) {
        const currentQuantity = parseInt(quantityElement.textContent) || 0;
        if (currentQuantity > 0) {
            quantityElement.textContent = currentQuantity - 1;
        }
    }
}

function updateQuantityDisplay(itemId) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    if (quantityElement) {
        const cartItem = cart.items.find(item => item.id === itemId);
        quantityElement.textContent = cartItem ? cartItem.quantity : 0;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-full';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(full)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Order Processing
function processOrder() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const orderSummary = {
        items: cart.items,
        total: cart.total,
        orderNumber: generateOrderNumber(),
        timestamp: new Date().toISOString(),
        deliveryFee: restaurantInfo.deliveryFee,
        minimumOrder: restaurantInfo.minimumOrder
    };

    // Check minimum order for delivery
    if (state.order.type === 'delivery' && orderSummary.total < restaurantInfo.minimumOrder) {
        showNotification(`Minimum order for delivery is ₹${restaurantInfo.minimumOrder}`, 'error');
        return;
    }

    // Store order in session storage
    sessionStorage.setItem('currentOrder', JSON.stringify(orderSummary));

    // Show order confirmation
    showOrderConfirmation(orderSummary);
}

function generateOrderNumber() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showOrderConfirmation(order) {
    const confirmation = document.createElement('div');
    confirmation.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    confirmation.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Order Confirmation</h2>
            <div class="space-y-4">
                <p class="text-gray-600 dark:text-gray-300">Order #: ${order.orderNumber}</p>
                <div class="border-t border-b py-4">
                    ${order.items.map(item => `
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-800 dark:text-white">
                                ${item.name} x${item.quantity}
                            </span>
                            <span class="text-gray-600 dark:text-gray-300">
                                ₹${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    `).join('')}
                </div>
                ${state.order.type === 'delivery' ? `
                    <div class="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Delivery Fee:</span>
                        <span>₹${order.deliveryFee.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between font-bold">
                    <span class="text-gray-800 dark:text-white">Total:</span>
                    <span class="text-primary">₹${(order.total + (state.order.type === 'delivery' ? order.deliveryFee : 0)).toFixed(2)}</span>
                </div>
                <button onclick="proceedToPayment()" 
                        class="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors mt-4">
                    Proceed to Payment
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmation);
}

function proceedToPayment() {
    window.location.href = '#payment';
}

// Export functions for use in other files
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.processOrder = processOrder;
window.proceedToPayment = proceedToPayment;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity; 