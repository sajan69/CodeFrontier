// Task Management System

// Variables and Data Types
let tasks = [];
const PRIORITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

const DEFAULT_STATUS = 'pending';

// Task Class
class Task {
    constructor(title, description, priority = PRIORITY_LEVELS.MEDIUM) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = DEFAULT_STATUS;
        this.createdAt = new Date();
        this.completedAt = null;
    }

    complete() {
        this.status = 'completed';
        this.completedAt = new Date();
    }

    updatePriority(newPriority) {
        if (Object.values(PRIORITY_LEVELS).includes(newPriority)) {
            this.priority = newPriority;
        } else {
            throw new Error('Invalid priority level');
        }
    }
}

// Task Management Functions
const taskManager = {
    addTask(title, description, priority) {
        const task = new Task(title, description, priority);
        tasks.push(task);
        return task;
    },

    removeTask(taskId) {
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            return tasks.splice(index, 1)[0];
        }
        return null;
    },

    getTaskById(taskId) {
        return tasks.find(task => task.id === taskId);
    },

    updateTask(taskId, updates) {
        const task = this.getTaskById(taskId);
        if (task) {
            Object.assign(task, updates);
            return task;
        }
        return null;
    },

    filterTasks(criteria) {
        return tasks.filter(task => {
            return Object.entries(criteria).every(([key, value]) => task[key] === value);
        });
    },

    sortTasks(key = 'createdAt', ascending = true) {
        return [...tasks].sort((a, b) => {
            const compareValue = ascending ? 1 : -1;
            return a[key] > b[key] ? compareValue : -compareValue;
        });
    }
};

// Example Usage
try {
    // Adding tasks
    const task1 = taskManager.addTask(
        'Learn JavaScript',
        'Study fundamental concepts of JS',
        PRIORITY_LEVELS.HIGH
    );

    const task2 = taskManager.addTask(
        'Practice Coding',
        'Complete daily coding challenges',
        PRIORITY_LEVELS.MEDIUM
    );

    // Updating task
    taskManager.updateTask(task1.id, { description: 'Master JavaScript fundamentals' });

    // Completing task
    task1.complete();

    // Filtering tasks
    const highPriorityTasks = taskManager.filterTasks({ priority: PRIORITY_LEVELS.HIGH });
    const completedTasks = taskManager.filterTasks({ status: 'completed' });

    // Sorting tasks
    const sortedByDate = taskManager.sortTasks('createdAt', false);

    // Destructuring example
    const { title, priority, status } = task1;
    console.log(`Task: ${title}, Priority: ${priority}, Status: ${status}`);

    // Array methods example
    const taskTitles = tasks.map(task => task.title);
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const hasHighPriority = tasks.some(task => task.priority === PRIORITY_LEVELS.HIGH);

} catch (error) {
    console.error('Error:', error.message);
} 