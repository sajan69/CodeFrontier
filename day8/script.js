// Theme Switcher Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Set default theme
    document.body.setAttribute('data-theme', 'light');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            
            // Update active button state
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}); 