// Utility Functions
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<div class="loading"></div>';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="error">${message}</div>`;
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="success">${message}</div>`;
}

// Promise Demo
function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

async function runPromiseDemo() {
    const output = document.getElementById('promiseOutput');
    showLoading('promiseOutput');

    try {
        const result = await Promise.resolve('Step 1')
            .then(result => {
                return delay(1000, result + ' → Step 2');
            })
            .then(result => {
                return delay(1000, result + ' → Step 3');
            })
            .then(result => {
                return delay(1000, result + ' → Complete!');
            });

        showSuccess('promiseOutput', result);
    } catch (error) {
        showError('promiseOutput', error.message);
    }
}

// Async/Await Demo
async function simulateAsyncOperation() {
    await delay(2000);
    if (Math.random() > 0.5) {
        throw new Error('Random operation failed');
    }
    return 'Operation successful!';
}

async function runAsyncDemo() {
    const output = document.getElementById('asyncOutput');
    showLoading('asyncOutput');

    try {
        const result = await simulateAsyncOperation();
        showSuccess('asyncOutput', result);
    } catch (error) {
        showError('asyncOutput', error.message);
    }
}

// Fetch API Demo
async function fetchUsers() {
    const userList = document.getElementById('userList');
    showLoading('userList');

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        userList.innerHTML = users.map(user => `
            <div class="card">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
                <p>${user.company.name}</p>
            </div>
        `).join('');
    } catch (error) {
        showError('userList', error.message);
    }
}

// Error Handling Demo
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
    }
}

async function simulateError() {
    const output = document.getElementById('errorOutput');
    showLoading('errorOutput');

    try {
        await delay(1000);
        throw new CustomError('This is a custom error!');
    } catch (error) {
        if (error instanceof CustomError) {
            showError('errorOutput', `Custom Error: ${error.message}`);
        } else {
            showError('errorOutput', `Unexpected Error: ${error.message}`);
        }
    }
}

async function simulateRecovery() {
    const output = document.getElementById('errorOutput');
    showLoading('errorOutput');

    try {
        await delay(1000);
        throw new Error('Initial error');
    } catch (error) {
        try {
            await delay(1000);
            showSuccess('errorOutput', 'Recovered from error successfully!');
        } catch (recoveryError) {
            showError('errorOutput', 'Recovery failed: ' + recoveryError.message);
        }
    }
}

// Parallel Execution Demo
async function runParallelTasks() {
    const output = document.getElementById('parallelOutput');
    showLoading('parallelOutput');

    try {
        const tasks = [
            delay(2000, { title: 'Task 1', result: 'Complete' }),
            delay(1500, { title: 'Task 2', result: 'Complete' }),
            delay(1000, { title: 'Task 3', result: 'Complete' })
        ];

        const results = await Promise.all(tasks);
        output.innerHTML = results.map(result => `
            <div class="card">
                <h3>${result.title}</h3>
                <p>Status: ${result.result}</p>
            </div>
        `).join('');
    } catch (error) {
        showError('parallelOutput', error.message);
    }
} 