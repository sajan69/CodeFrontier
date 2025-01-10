document.addEventListener('DOMContentLoaded', () => {
    // Theme Switching Functionality
    const themeButtons = document.querySelectorAll('.theme-btn');
    const root = document.documentElement;

    const themes = {
        light: {
            '--background-color': '#ffffff',
            '--text-color': '#333333',
            '--primary-color': '#4a90e2',
            '--secondary-color': '#2ecc71'
        },
        dark: {
            '--background-color': '#1a1a1a',
            '--text-color': '#ffffff',
            '--primary-color': '#64b5f6',
            '--secondary-color': '#81c784'
        }
    };

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            
            // Check if browser supports view transitions
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    applyTheme(theme);
                });
            } else {
                applyTheme(theme);
            }
        });
    });

    function applyTheme(theme) {
        const themeColors = themes[theme];
        for (const [property, value] of Object.entries(themeColors)) {
            root.style.setProperty(property, value);
        }
    }

    // Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Performance Monitoring
    function logAnimationPerformance() {
        const perfData = window.performance.getEntriesByType('animation');
        console.log('Animation Performance:', perfData);
    }

    // Optional: Monitor performance after all animations are loaded
    window.addEventListener('load', () => {
        setTimeout(logAnimationPerformance, 3000);
    });
}); 