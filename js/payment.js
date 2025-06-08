// Payment Processing
const payment = {
    methods: {
        card: {
            name: 'Credit/Debit Card',
            icon: 'fa-credit-card',
            fields: ['cardNumber', 'cardName', 'expiry', 'cvv']
        },
        upi: {
            name: 'UPI',
            icon: 'fa-mobile-alt',
            fields: ['upiId'],
            providers: ['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay']
        },
        netbanking: {
            name: 'Net Banking',
            icon: 'fa-university',
            fields: ['bankName', 'accountNumber'],
            banks: [
                'State Bank of India',
                'HDFC Bank',
                'ICICI Bank',
                'Axis Bank',
                'Punjab National Bank',
                'Bank of Baroda',
                'Canara Bank',
                'Kotak Mahindra Bank'
            ]
        },
        cod: {
            name: 'Cash on Delivery',
            icon: 'fa-money-bill-wave',
            fields: []
        }
    },

    processPayment(method, details) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({
                        success: true,
                        transactionId: generateTransactionId(),
                        timestamp: new Date().toISOString(),
                        method: method
                    });
                } else {
                    reject(new Error('Payment failed. Please try again.'));
                }
            }, 2000);
        });
    }
};

// Payment Form Handling
function initPaymentForm() {
    const form = document.getElementById('paymentForm');
    if (!form) return;

    const methodSelect = form.querySelector('[name="paymentMethod"]');
    if (methodSelect) {
        methodSelect.addEventListener('change', () => updatePaymentFields(methodSelect.value));
    }

    form.addEventListener('submit', handlePaymentSubmit);
}

function updatePaymentFields(method) {
    const fieldsContainer = document.getElementById('paymentFields');
    if (!fieldsContainer) return;

    const methodConfig = payment.methods[method];
    if (!methodConfig) return;

    fieldsContainer.innerHTML = methodConfig.fields.map(field => {
        switch (field) {
            case 'cardNumber':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                        <input type="text" name="cardNumber" 
                               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               placeholder="1234 5678 9012 3456"
                               maxlength="19"
                               oninput="formatCardNumber(this)">
                    </div>
                `;
            case 'cardName':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Name on Card</label>
                        <input type="text" name="cardName" 
                               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               placeholder="John Doe">
                    </div>
                `;
            case 'expiry':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                        <input type="text" name="expiry" 
                               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               placeholder="MM/YY"
                               maxlength="5"
                               oninput="formatExpiry(this)">
                    </div>
                `;
            case 'cvv':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                        <input type="password" name="cvv" 
                               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               placeholder="123"
                               maxlength="3">
                    </div>
                `;
            case 'upiId':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">UPI ID</label>
                        <input type="text" name="upiId" 
                               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               placeholder="username@upi">
                        <div class="mt-2 flex flex-wrap gap-2">
                            ${payment.methods.upi.providers.map(provider => `
                                <button type="button" 
                                        onclick="fillUpiId('${provider.toLowerCase()}')"
                                        class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                    ${provider}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            case 'bankName':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Bank Name</label>
                        <select name="bankName" 
                                class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Select Bank</option>
                            ${payment.methods.netbanking.banks.map(bank => `
                                <option value="${bank.toLowerCase().replace(/\s+/g, '-')}">${bank}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
            case 'accountNumber':
                return `
                    <div class="mb-4">
                        <label class="block text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
                        <input type="text" name="accountNumber" 
                               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               placeholder="Enter account number">
                    </div>
                `;
        }
    }).join('');

    // Add payment summary
    const orderSummary = JSON.parse(sessionStorage.getItem('currentOrder'));
    if (orderSummary) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
        summaryDiv.innerHTML = `
            <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Order Summary</h3>
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span class="text-gray-800 dark:text-white">₹${orderSummary.total.toFixed(2)}</span>
                </div>
                ${orderSummary.deliveryFee ? `
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-300">Delivery Fee:</span>
                        <span class="text-gray-800 dark:text-white">₹${orderSummary.deliveryFee.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between font-semibold pt-2 border-t">
                    <span class="text-gray-800 dark:text-white">Total:</span>
                    <span class="text-primary">₹${(orderSummary.total + (orderSummary.deliveryFee || 0)).toFixed(2)}</span>
                </div>
            </div>
        `;
        fieldsContainer.appendChild(summaryDiv);
    }
}

function fillUpiId(provider) {
    const upiInput = document.querySelector('input[name="upiId"]');
    if (upiInput) {
        upiInput.value = `username@${provider}`;
    }
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    input.value = value;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;
}

async function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const method = formData.get('paymentMethod');
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;

    try {
        const details = {};
        for (const [key, value] of formData.entries()) {
            if (key !== 'paymentMethod') {
                details[key] = value;
            }
        }

        const result = await payment.processPayment(method, details);
        showPaymentSuccess(result);
        form.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function showPaymentSuccess(result) {
    const confirmation = document.createElement('div');
    confirmation.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    confirmation.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div class="text-center mb-6">
                <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Payment Successful!</h2>
            </div>
            <div class="space-y-4">
                <p class="text-gray-600 dark:text-gray-300">Transaction ID: ${result.transactionId}</p>
                <p class="text-gray-600 dark:text-gray-300">Payment Method: ${payment.methods[result.method].name}</p>
                <p class="text-gray-600 dark:text-gray-300">Time: ${new Date(result.timestamp).toLocaleString()}</p>
                <div class="border-t border-b py-4">
                    <p class="text-center text-gray-800 dark:text-white">
                        Thank you for your order! You will receive a confirmation message shortly.
                    </p>
                </div>
                <button onclick="window.location.href = '/'" 
                        class="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors mt-4">
                    Return to Home
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmation);
}

function generateTransactionId() {
    return 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-full ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
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

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initPaymentForm); 