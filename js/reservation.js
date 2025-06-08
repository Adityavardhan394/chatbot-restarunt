// Reservation Management
const reservations = {
    bookings: [],
    addBooking(booking) {
        this.bookings.push(booking);
        this.saveToStorage();
    },
    removeBooking(bookingId) {
        this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
        this.saveToStorage();
    },
    saveToStorage() {
        localStorage.setItem('reservations', JSON.stringify(this.bookings));
    },
    loadFromStorage() {
        const stored = localStorage.getItem('reservations');
        if (stored) {
            this.bookings = JSON.parse(stored);
        }
    }
};

// Form Validation
const validators = {
    name: (value) => value.length >= 2,
    phone: (value) => /^\+?[\d\s-]{10,}$/.test(value),
    date: (value) => {
        const date = new Date(value);
        const today = new Date();
        return date >= today;
    },
    time: (value) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
    people: (value) => {
        const num = parseInt(value);
        return num >= 1 && num <= 20;
    }
};

// Reservation Form Handling
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    form.addEventListener('submit', handleReservationSubmit);
    
    // Add input validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => validateInput(input));
    });
}

function validateInput(input) {
    const validator = validators[input.name];
    if (!validator) return true;

    const isValid = validator(input.value);
    const errorElement = input.nextElementSibling;
    
    if (!isValid) {
        input.classList.add('border-red-500');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = getErrorMessage(input.name);
        } else {
            const error = document.createElement('p');
            error.className = 'error-message text-red-500 text-sm mt-1';
            error.textContent = getErrorMessage(input.name);
            input.parentNode.insertBefore(error, input.nextSibling);
        }
    } else {
        input.classList.remove('border-red-500');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }

    return isValid;
}

function getErrorMessage(field) {
    const messages = {
        name: 'Please enter a valid name (minimum 2 characters)',
        phone: 'Please enter a valid phone number',
        date: 'Please select a future date',
        time: 'Please enter a valid time (HH:MM)',
        people: 'Please enter a number between 1 and 20'
    };
    return messages[field] || 'Invalid input';
}

function handleReservationSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const booking = {
        id: generateBookingId(),
        name: formData.get('name'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        people: parseInt(formData.get('people')),
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Validate all fields
    let isValid = true;
    for (const [key, value] of formData.entries()) {
        if (!validateInput(form.elements[key])) {
            isValid = false;
        }
    }

    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }

    // Check for availability
    if (isTimeSlotAvailable(booking)) {
        reservations.addBooking(booking);
        showReservationConfirmation(booking);
        form.reset();
    } else {
        showNotification('Sorry, this time slot is not available', 'error');
    }
}

function isTimeSlotAvailable(booking) {
    const bookingTime = new Date(`${booking.date}T${booking.time}`);
    return !reservations.bookings.some(existing => {
        const existingTime = new Date(`${existing.date}T${existing.time}`);
        return Math.abs(existingTime - bookingTime) < 7200000; // 2 hours in milliseconds
    });
}

function generateBookingId() {
    return 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showReservationConfirmation(booking) {
    const confirmation = document.createElement('div');
    confirmation.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    confirmation.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div class="text-center mb-6">
                <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Reservation Confirmed!</h2>
            </div>
            <div class="space-y-4">
                <p class="text-gray-600 dark:text-gray-300">Booking #: ${booking.id}</p>
                <div class="border-t border-b py-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-800 dark:text-white">Name:</span>
                        <span class="text-gray-600 dark:text-gray-300">${booking.name}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-800 dark:text-white">Date:</span>
                        <span class="text-gray-600 dark:text-gray-300">${formatDate(booking.date)}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-800 dark:text-white">Time:</span>
                        <span class="text-gray-600 dark:text-gray-300">${booking.time}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-800 dark:text-white">Guests:</span>
                        <span class="text-gray-600 dark:text-gray-300">${booking.people}</span>
                    </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    A confirmation message has been sent to your phone number.
                </p>
                <button onclick="this.closest('.fixed').remove()" 
                        class="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors mt-4">
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmation);
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
document.addEventListener('DOMContentLoaded', () => {
    reservations.loadFromStorage();
    initReservationForm();
}); 