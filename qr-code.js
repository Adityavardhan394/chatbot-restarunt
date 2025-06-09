// ===== QR CODE RESTAURANT ORDERING SYSTEM =====

class QRCodeSystem {
    constructor() {
        this.isQRMode = false;
        this.currentTable = null;
        this.currentRestaurant = null;
        this.qrCanvas = null;
        this.generatedQRData = null;
        this.init();
    }

    init() {
        this.checkQRAccess();
        this.bindQREvents();
        this.populateRestaurantDropdown();
    }

    // Check if app was accessed via QR code
    checkQRAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('restaurant');
        const tableNumber = urlParams.get('table');
        const section = urlParams.get('section');

        if (restaurantId && tableNumber) {
            this.handleQRAccess(restaurantId, tableNumber, section);
        }
    }

    // Handle QR code access
    handleQRAccess(restaurantId, tableNumber, section) {
        const restaurant = this.findRestaurantById(parseInt(restaurantId));
        
        if (restaurant) {
            this.isQRMode = true;
            this.currentRestaurant = restaurant;
            this.currentTable = {
                number: tableNumber,
                section: section || null
            };

            // Show table confirmation modal
            this.showTableConfirmation();
        } else {
            this.showError("Restaurant not found. Please scan a valid QR code.");
        }
    }

    showTableConfirmation() {
        const modal = document.getElementById('tableNumberModal');
        const restaurantName = document.getElementById('restaurantNameModal');
        const tableDisplay = document.getElementById('tableNumberDisplay');
        
        restaurantName.textContent = this.currentRestaurant.name;
        tableDisplay.textContent = this.currentTable.number;
        
        modal.classList.remove('hidden');
    }

    activateTableMode() {
        // Update UI for table mode
        this.switchToTableMode();
        
        // Close table confirmation modal
        document.getElementById('tableNumberModal').classList.add('hidden');
        
        // Set selected restaurant in AI
        if (window.chatbotAI) {
            window.chatbotAI.setSelectedRestaurant(this.currentRestaurant.id);
            window.chatbotAI.orderMode = 'dine-in';
            window.chatbotAI.tableInfo = this.currentTable;
        }
        
        // Show welcome message for table ordering
        this.showTableWelcomeMessage();
    }

    switchToTableMode() {
        // Hide location info, show table info
        document.getElementById('locationInfo').classList.add('hidden');
        document.getElementById('tableInfo').classList.remove('hidden');
        
        // Update table display
        document.getElementById('tableNumber').textContent = this.currentTable.number;
        document.getElementById('restaurantNameHeader').textContent = this.currentRestaurant.name;
        
        // Update order mode text
        document.getElementById('orderMode').textContent = 'Table Ordering System';
        
        // Update chat description
        document.getElementById('chatDescription').textContent = `Welcome to ${this.currentRestaurant.name}! Order from your table`;
        
        // Show call waiter button
        document.getElementById('callWaiter').classList.remove('hidden');
        
        // Update footer
        document.getElementById('footerLocation').textContent = `Table ${this.currentTable.number}`;
        
        // Hide QR generator (customers don't need this)
        document.getElementById('qrGeneratorBtn').classList.add('hidden');
        
        // Update quick actions for table ordering
        this.updateQuickActionsForTable();
    }

    updateQuickActionsForTable() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `
                <div class="welcome-animation">
                    <div class="restaurant-icon">${this.currentRestaurant.image}</div>
                    <h2>Welcome to ${this.currentRestaurant.name}!</h2>
                    <p>You're seated at Table ${this.currentTable.number}. Order directly from your phone:</p>
                    <div class="feature-grid">
                        <div class="feature-item">
                            <i class="fas fa-utensils"></i>
                            <span>Browse Our Menu</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Order to Your Table</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-credit-card"></i>
                            <span>Pay from Your Phone</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-bell"></i>
                            <span>Call Waiter Service</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-clock"></i>
                            <span>Track Order Status</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-star"></i>
                            <span>Rate Your Experience</span>
                        </div>
                    </div>
                    <div class="quick-actions">
                        <button class="quick-btn" data-message="Show me the menu">📋 View Menu</button>
                        <button class="quick-btn" data-message="What are today's specials?">⭐ Today's Specials</button>
                        <button class="quick-btn" data-message="Show me vegetarian options">🥗 Vegetarian</button>
                        <button class="quick-btn" data-message="What's popular here?">🔥 Popular Items</button>
                        <button class="quick-btn" data-message="I need help">🙋‍♂️ Call Waiter</button>
                        <button class="quick-btn" data-message="Show me beverages">🥤 Beverages</button>
                    </div>
                </div>
            `;
            
            // Re-bind quick button events
            document.querySelectorAll('.quick-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const message = e.target.dataset.message;
                    if (window.foodieBotApp) {
                        window.foodieBotApp.sendMessage(message);
                    }
                });
            });
        }
    }

    showTableWelcomeMessage() {
        if (window.foodieBotApp) {
            const welcomeMsg = `Welcome to ${this.currentRestaurant.name}! 🍽️\n\nYou're seated at Table ${this.currentTable.number}. I'm here to help you order delicious food directly to your table. No need to wait for a waiter - just browse our menu and place your order!\n\nWhat would you like to start with?`;
            window.foodieBotApp.addMessage(welcomeMsg, 'bot');
        }
    }

    bindQREvents() {
        // QR Generator button
        document.getElementById('qrGeneratorBtn')?.addEventListener('click', () => {
            this.showQRGenerator();
        });

        // Table confirmation events
        document.getElementById('confirmTable')?.addEventListener('click', () => {
            this.activateTableMode();
        });

        document.getElementById('wrongTable')?.addEventListener('click', () => {
            document.getElementById('tableNumberModal').classList.add('hidden');
            this.showError("Please scan the QR code at your correct table.");
        });

        // QR Generator form events
        document.getElementById('restaurantSelect')?.addEventListener('change', () => {
            this.updateQRPreview();
        });

        document.getElementById('tableNumberInput')?.addEventListener('input', () => {
            this.updateQRPreview();
        });

        document.getElementById('sectionName')?.addEventListener('input', () => {
            this.updateQRPreview();
        });

        document.getElementById('generateQrBtn')?.addEventListener('click', () => {
            this.generateQRCode();
        });

        document.getElementById('downloadQrBtn')?.addEventListener('click', () => {
            this.downloadQRCode();
        });

        document.getElementById('printQrBtn')?.addEventListener('click', () => {
            this.printQRCode();
        });

        // Call waiter functionality
        document.getElementById('callWaiter')?.addEventListener('click', () => {
            this.callWaiter();
        });

        // Handle order type changes for QR mode
        document.querySelectorAll('input[name="orderType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleOrderTypeChange(e.target.value);
            });
        });
    }

    showQRGenerator() {
        const modal = document.getElementById('qrGeneratorModal');
        modal.classList.remove('hidden');
        this.resetQRGenerator();
    }

    resetQRGenerator() {
        document.getElementById('restaurantSelect').value = '';
        document.getElementById('tableNumberInput').value = '';
        document.getElementById('sectionName').value = '';
        document.getElementById('generateQrBtn').disabled = true;
        document.getElementById('downloadQrBtn').classList.add('hidden');
        document.getElementById('printQrBtn').classList.add('hidden');
        document.getElementById('qrInfo').classList.add('hidden');
        
        // Show placeholder, hide canvas
        const canvas = document.getElementById('qrCodeCanvas');
        const placeholder = document.querySelector('.qr-placeholder');
        if (canvas) canvas.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
    }

    populateRestaurantDropdown() {
        const select = document.getElementById('restaurantSelect');
        if (select && window.chatbotAI) {
            window.chatbotAI.nearbyRestaurants.forEach(restaurant => {
                const option = document.createElement('option');
                option.value = restaurant.id;
                option.textContent = `${restaurant.name} (${restaurant.location})`;
                select.appendChild(option);
            });
        }
    }

    updateQRPreview() {
        const restaurantId = document.getElementById('restaurantSelect').value;
        const tableNumber = document.getElementById('tableNumberInput').value.trim();
        
        const generateBtn = document.getElementById('generateQrBtn');
        
        if (restaurantId && tableNumber) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    generateQRCode() {
        const restaurantId = document.getElementById('restaurantSelect').value;
        const tableNumber = document.getElementById('tableNumberInput').value.trim();
        const section = document.getElementById('sectionName').value.trim();
        
        if (!restaurantId || !tableNumber) {
            this.showError('Please select a restaurant and enter a table number.');
            return;
        }

        // Create QR code URL
        const baseUrl = window.location.origin + window.location.pathname;
        let qrUrl = `${baseUrl}?restaurant=${restaurantId}&table=${encodeURIComponent(tableNumber)}`;
        
        if (section) {
            qrUrl += `&section=${encodeURIComponent(section)}`;
        }

        // Generate QR code
        const canvas = document.getElementById('qrCodeCanvas');
        const placeholder = document.querySelector('.qr-placeholder');
        
        if (typeof QRCode !== 'undefined') {
            QRCode.toCanvas(canvas, qrUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#2d3748',
                    light: '#ffffff'
                }
            }, (error) => {
                if (error) {
                    this.showError('Failed to generate QR code: ' + error.message);
                    return;
                }
                
                // Show canvas, hide placeholder
                canvas.style.display = 'block';
                placeholder.style.display = 'none';
                
                // Show QR info and action buttons
                document.getElementById('qrInfo').classList.remove('hidden');
                document.getElementById('qrUrl').textContent = qrUrl;
                document.getElementById('downloadQrBtn').classList.remove('hidden');
                document.getElementById('printQrBtn').classList.remove('hidden');
                
                // Store generated data
                this.generatedQRData = {
                    url: qrUrl,
                    restaurantId: restaurantId,
                    tableNumber: tableNumber,
                    section: section
                };
                
                this.showSuccess('QR code generated successfully!');
            });
        } else {
            this.showError('QR Code library not loaded. Please refresh the page.');
        }
    }

    downloadQRCode() {
        if (!this.generatedQRData) return;
        
        const canvas = document.getElementById('qrCodeCanvas');
        const restaurant = this.findRestaurantById(parseInt(this.generatedQRData.restaurantId));
        
        // Create download link
        const link = document.createElement('a');
        link.download = `${restaurant.name}_Table_${this.generatedQRData.tableNumber}_QR.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        this.showSuccess('QR code downloaded!');
    }

    printQRCode() {
        if (!this.generatedQRData) return;
        
        const restaurant = this.findRestaurantById(parseInt(this.generatedQRData.restaurantId));
        const canvas = document.getElementById('qrCodeCanvas');
        const dataUrl = canvas.toDataURL();
        
        // Create print content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>QR Code - ${restaurant.name} Table ${this.generatedQRData.tableNumber}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 20px;
                            margin: 0;
                        }
                        .qr-print-container {
                            border: 2px solid #333;
                            padding: 20px;
                            max-width: 400px;
                            margin: 0 auto;
                            border-radius: 10px;
                        }
                        .restaurant-name {
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: #ff6b35;
                        }
                        .table-info {
                            font-size: 18px;
                            margin-bottom: 20px;
                            color: #2d3748;
                        }
                        .qr-image {
                            margin: 20px 0;
                        }
                        .instructions {
                            font-size: 14px;
                            color: #666;
                            margin-top: 15px;
                            line-height: 1.4;
                        }
                        .powered-by {
                            font-size: 12px;
                            color: #999;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-print-container">
                        <div class="restaurant-name">${restaurant.name}</div>
                        <div class="table-info">Table ${this.generatedQRData.tableNumber}
                            ${this.generatedQRData.section ? ` - ${this.generatedQRData.section}` : ''}
                        </div>
                        <div class="qr-image">
                            <img src="${dataUrl}" alt="QR Code" style="max-width: 100%;">
                        </div>
                        <div class="instructions">
                            <strong>How to Order:</strong><br>
                            1. Scan this QR code with your phone camera<br>
                            2. Browse our menu and add items to cart<br>
                            3. Pay securely from your phone<br>
                            4. Food will be served to your table
                        </div>
                        <div class="powered-by">Powered by FoodieBot AI</div>
                    </div>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        
        this.showSuccess('Print dialog opened!');
    }

    callWaiter() {
        if (!this.isQRMode) return;
        
        // Simulate waiter call
        this.showSuccess('🔔 Waiter has been notified! Someone will be with you shortly.');
        
        // Add message to chat
        if (window.foodieBotApp) {
            window.foodieBotApp.addMessage('🔔 You called for assistance. A waiter will be with you shortly!', 'bot');
        }
        
        // In a real app, this would send a notification to restaurant staff
        console.log('Waiter called for table:', this.currentTable.number, 'at restaurant:', this.currentRestaurant.name);
    }

    handleOrderTypeChange(orderType) {
        const deliverySection = document.getElementById('deliverySection');
        const deliveryFeeRow = document.getElementById('deliveryFeeRow');
        const codLabel = document.getElementById('codLabel');
        
        if (orderType === 'dine-in') {
            // Hide delivery section for dine-in orders
            if (deliverySection) deliverySection.classList.add('hidden');
            if (deliveryFeeRow) deliveryFeeRow.classList.add('hidden');
            if (codLabel) codLabel.textContent = 'Pay at Table';
            
            // Update payment service for dine-in
            if (window.paymentService) {
                window.paymentService.orderType = 'dine-in';
            }
        } else {
            // Show delivery section for delivery orders
            if (deliverySection) deliverySection.classList.remove('hidden');
            if (deliveryFeeRow) deliveryFeeRow.classList.remove('hidden');
            if (codLabel) codLabel.textContent = 'Cash on Delivery';
            
            // Update payment service for delivery
            if (window.paymentService) {
                window.paymentService.orderType = 'delivery';
            }
        }
    }

    findRestaurantById(id) {
        if (window.chatbotAI) {
            return window.chatbotAI.nearbyRestaurants.find(r => r.id === id);
        }
        return null;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };
        return colors[type] || colors.info;
    }

    // Public methods
    isInQRMode() {
        return this.isQRMode;
    }

    getCurrentTable() {
        return this.currentTable;
    }

    getCurrentRestaurant() {
        return this.currentRestaurant;
    }

    getQRModeInfo() {
        return {
            isQRMode: this.isQRMode,
            table: this.currentTable,
            restaurant: this.currentRestaurant
        };
    }
}

// Initialize QR Code system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.qrCodeSystem = new QRCodeSystem();
    
    // Override checkout behavior for QR mode
    if (window.qrCodeSystem.isInQRMode()) {
        // Set default order type to dine-in for QR access
        setTimeout(() => {
            const dineInRadio = document.querySelector('input[name="orderType"][value="dine-in"]');
            if (dineInRadio) {
                dineInRadio.checked = true;
                window.qrCodeSystem.handleOrderTypeChange('dine-in');
            }
        }, 1000);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRCodeSystem;
}
