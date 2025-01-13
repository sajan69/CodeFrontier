// Export all demo functions and attach them to window
export function initializeDemos() {
    document.getElementById('arrowBtn').addEventListener('click', arrowFunctionDemo);
    document.getElementById('destructuringBtn').addEventListener('click', destructuringDemo);
    document.getElementById('classBtn').addEventListener('click', classDemo);
    document.getElementById('syntaxBtn').addEventListener('click', modernSyntaxDemo);
    
    // Initialize module demo
    moduleDemo();
}

// Arrow Functions Demo
const arrowFunctionDemo = () => {
    const output = document.getElementById('arrowOutput');
    
    // Basic arrow function
    const add = (a, b) => a + b;
    
    // Arrow function with block
    const multiply = (a, b) => {
        const result = a * b;
        return result;
    };
    
    // Arrow function with this context
    const counter = {
        count: 0,
        increment: () => {
            this.count++;
            return this.count;
        }
    };
    
    output.innerHTML = `
        <p>Add: 5 + 3 = ${add(5, 3)}</p>
        <p>Multiply: 4 * 6 = ${multiply(4, 6)}</p>
    `;
};

// Destructuring Demo
const destructuringDemo = () => {
    const output = document.getElementById('destructuringOutput');
    
    // Object destructuring
    const user = {
        name: 'John Doe',
        age: 30,
        address: {
            city: 'New York',
            country: 'USA'
        }
    };
    
    const { name, age, address: { city } } = user;
    
    // Array destructuring
    const numbers = [1, 2, 3, 4, 5];
    const [first, second, ...rest] = numbers;
    
    // Parameter destructuring
    const printUserInfo = ({ name, age }) => `${name} is ${age} years old`;
    
    output.innerHTML = `
        <p>Name: ${name}</p>
        <p>Age: ${age}</p>
        <p>City: ${city}</p>
        <p>First number: ${first}</p>
        <p>Rest numbers: ${rest.join(', ')}</p>
        <p>User Info: ${printUserInfo(user)}</p>
    `;
};

// Class Demo
class Shape {
    constructor(color) {
        this.color = color;
    }
    
    getInfo() {
        return `A ${this.color} shape`;
    }
}

class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }
    
    getInfo() {
        return `${super.getInfo()} with radius ${this.radius}`;
    }
    
    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

const classDemo = () => {
    const output = document.getElementById('classOutput');
    
    const circle = new Circle('red', 5);
    
    output.innerHTML = `
        <p>Circle Info: ${circle.getInfo()}</p>
        <p>Circle Area: ${circle.getArea().toFixed(2)}</p>
    `;
};

// Modern Syntax Demo
const modernSyntaxDemo = () => {
    const output = document.getElementById('syntaxOutput');
    
    // Template literals
    const name = 'World';
    const greeting = `Hello, ${name}!`;
    
    // Optional chaining
    const user = {
        details: {
            address: null
        }
    };
    const city = user?.details?.address?.city ?? 'Unknown';
    
    // Spread operator
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const combined = [...arr1, ...arr2];
    
    // Nullish coalescing
    const value = null;
    const defaultValue = value ?? 'Default';
    
    output.innerHTML = `
        <p>Template Literal: ${greeting}</p>
        <p>Optional Chaining: ${city}</p>
        <p>Spread Operator: ${combined.join(', ')}</p>
        <p>Nullish Coalescing: ${defaultValue}</p>
    `;
};

// Module Demo
import { formatDate, calculateAge } from './utils.js';

const moduleDemo = () => {
    const output = document.getElementById('moduleOutput');
    const now = new Date();
    const birthDate = new Date('1990-01-01');
    
    output.innerHTML = `
        <p>Formatted Date: ${formatDate(now)}</p>
        <p>Age: ${calculateAge(birthDate)} years</p>
    `;
}; 