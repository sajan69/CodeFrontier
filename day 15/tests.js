// Simple test framework
class TestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0
        };
    }

    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async runTests() {
        const output = document.getElementById('testOutput');
        output.innerHTML = '';

        for (const test of this.tests) {
            try {
                await test.testFn();
                this.results.passed++;
                this.logResult(test.name, true);
            } catch (error) {
                this.results.failed++;
                this.logResult(test.name, false, error.message);
            }
        }

        this.showSummary();
    }

    logResult(testName, passed, error = '') {
        const output = document.getElementById('testOutput');
        const result = document.createElement('div');
        result.className = passed ? 'success' : 'error';
        result.textContent = `${testName}: ${passed ? 'PASSED' : 'FAILED'}`;
        if (error) {
            result.textContent += ` - ${error}`;
        }
        output.appendChild(result);
    }

    showSummary() {
        const output = document.getElementById('testOutput');
        const summary = document.createElement('div');
        summary.textContent = `Total: ${this.tests.length}, Passed: ${this.results.passed}, Failed: ${this.results.failed}`;
        output.appendChild(summary);
    }
}

// Create test suite
const testSuite = new TestSuite();

// Add tests
testSuite.addTest('Storage API Test', async () => {
    localStorage.setItem('test', 'value');
    const value = localStorage.getItem('test');
    if (value !== 'value') throw new Error('Storage test failed');
});

testSuite.addTest('Async Operation Test', async () => {
    const result = await new Promise(resolve => setTimeout(() => resolve(true), 1000));
    if (!result) throw new Error('Async test failed');
});

testSuite.addTest('Math Operation Test', () => {
    if (add(2, 2) !== 4) throw new Error('Math test failed');
});

// Function to run tests
function runTests() {
    testSuite.runTests();
} 