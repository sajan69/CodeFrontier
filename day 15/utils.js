// Utility functions for the application

// Math operations for testing
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage wrapper with error handling
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }
};

// Performance monitoring utility
const performance = {
    start(label) {
        console.time(label);
    },
    
    end(label) {
        console.timeEnd(label);
    },
    
    measure(label, callback) {
        this.start(label);
        callback();
        this.end(label);
    }
};

// Error tracking utility
const errorTracker = {
    errors: [],
    
    log(error, context = {}) {
        const errorLog = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date()
        };
        
        this.errors.push(errorLog);
        console.error('Tracked Error:', errorLog);
        
        // Could send to error tracking service here
    },
    
    getErrors() {
        return this.errors;
    },
    
    clearErrors() {
        this.errors = [];
    }
}; 