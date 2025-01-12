// Selectors Demo
function highlightItems() {
    // querySelector and querySelectorAll
    const items = document.querySelectorAll('.item');
    items.forEach(item => item.classList.add('highlight'));
}

function resetHighlight() {
    // getElementsByClassName
    const items = document.getElementsByClassName('item');
    Array.from(items).forEach(item => item.classList.remove('highlight'));
}

// Events Demo
document.addEventListener('DOMContentLoaded', () => {
    const eventDemo = document.getElementById('eventDemo');
    const eventOutput = document.getElementById('eventOutput');

    // Multiple event listeners
    eventDemo.addEventListener('click', (e) => {
        eventOutput.textContent = 'Clicked!';
    });

    eventDemo.addEventListener('dblclick', (e) => {
        eventOutput.textContent = 'Double clicked!';
    });

    eventDemo.addEventListener('mouseover', (e) => {
        eventOutput.textContent = 'Mouse over!';
    });

    eventDemo.addEventListener('mouseout', (e) => {
        eventOutput.textContent = 'Mouse out!';
    });

    // Event delegation
    document.getElementById('itemList').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            e.target.parentElement.remove();
        }
    });
});

// Element Creation Demo
function addNewItem() {
    const input = document.getElementById('newItemInput');
    const text = input.value.trim();
    
    if (text) {
        // createElement and appendChild
        const itemList = document.getElementById('itemList');
        const newItem = document.createElement('div');
        newItem.className = 'item';
        
        const itemText = document.createElement('span');
        itemText.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn danger';
        
        newItem.appendChild(itemText);
        newItem.appendChild(deleteBtn);
        itemList.appendChild(newItem);
        
        input.value = '';
    }
}

// Attributes Demo
function toggleAttribute() {
    const target = document.getElementById('attributeTarget');
    const valueDisplay = document.getElementById('attributeValue');
    
    if (target.hasAttribute('data-info')) {
        target.removeAttribute('data-info');
        valueDisplay.textContent = 'No attribute';
    } else {
        target.setAttribute('data-info', 'New Info');
        valueDisplay.textContent = target.getAttribute('data-info');
    }
}

// Styles Demo
let isLarge = false;

function changeColor() {
    const target = document.getElementById('styleTarget');
    const select = document.getElementById('colorSelect');
    target.style.color = select.value;
}

function toggleSize() {
    const target = document.getElementById('styleTarget');
    isLarge = !isLarge;
    
    target.style.fontSize = isLarge ? '24px' : '16px';
    target.style.fontWeight = isLarge ? 'bold' : 'normal';
}

// Initialize attribute value display
document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('attributeTarget');
    const valueDisplay = document.getElementById('attributeValue');
    valueDisplay.textContent = target.getAttribute('data-info');
}); 