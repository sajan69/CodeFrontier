// Storage API Demo
function saveToStorage() {
    const input = document.getElementById('storageInput');
    const data = input.value;
    
    try {
        localStorage.setItem('savedData', data);
        showOutput('storageOutput', 'Data saved successfully!', 'success');
    } catch (error) {
        showOutput('storageOutput', `Error saving data: ${error.message}`, 'error');
    }
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem('savedData');
        showOutput('storageOutput', `Loaded data: ${data || 'No data found'}`, data ? 'success' : 'error');
    } catch (error) {
        showOutput('storageOutput', `Error loading data: ${error.message}`, 'error');
    }
}

// Geolocation API Demo
function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                showOutput('locationOutput', 
                    `Latitude: ${latitude}, Longitude: ${longitude}`, 
                    'success'
                );
            },
            error => {
                showOutput('locationOutput', 
                    `Error getting location: ${error.message}`, 
                    'error'
                );
            }
        );
    } else {
        showOutput('locationOutput', 'Geolocation is not supported', 'error');
    }
}

// WebSocket Demo
let ws;

function connectWebSocket() {
    ws = new WebSocket('wss://echo.websocket.org');
    
    ws.onopen = () => {
        showOutput('wsOutput', 'Connected to WebSocket', 'success');
    };
    
    ws.onmessage = (event) => {
        const message = document.createElement('div');
        message.className = 'websocket-message';
        message.textContent = `Received: ${event.data}`;
        document.getElementById('wsOutput').appendChild(message);
    };
    
    ws.onerror = (error) => {
        showOutput('wsOutput', `WebSocket error: ${error.message}`, 'error');
    };
}

function sendMessage() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(`Message sent at ${new Date().toLocaleTimeString()}`);
    } else {
        showOutput('wsOutput', 'WebSocket is not connected', 'error');
    }
}

// Performance Demo
function runPerformanceTest() {
    const container = document.getElementById('performanceTest');
    const fragment = document.createDocumentFragment();
    const startTime = Date.now();
    
    // Create 1000 elements
    for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.className = 'test-item';
        div.textContent = `Item ${i + 1}`;
        fragment.appendChild(div);
    }
    
    container.appendChild(fragment);
    const endTime = Date.now();
    
    showOutput('performanceTest', 
        `Created 1000 elements in ${(endTime - startTime)}ms`, 
        'success'
    );
}

function clearPerformanceTest() {
    const container = document.getElementById('performanceTest');
    container.innerHTML = '';
}

// Debug Demo
function debugDemo() {
    console.log('Starting debug demo...');
    
    // Intentional error for demonstration
    try {
        const obj = null;
        console.log(obj.property); // Will throw error
    } catch (error) {
        console.error('Caught error:', error);
        showOutput('debugOutput', 
            'Check console for debug information', 
            'error'
        );
    }
}

// Utility function for showing output
function showOutput(elementId, message, type = '') {
    const output = document.getElementById(elementId);
    output.innerHTML = `<div class="${type}">${message}</div>`;
}

// Initialize event delegation
document.addEventListener('DOMContentLoaded', () => {
    // Performance optimization with event delegation
    document.getElementById('performanceTest').addEventListener('click', (e) => {
        if (e.target.classList.contains('test-item')) {
            console.log('Clicked:', e.target.textContent);
        }
    });
}); 