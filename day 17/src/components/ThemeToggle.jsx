import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`theme-toggle ${theme}`}>
      <h2>Theme Toggle (useContext)</h2>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
      <p>Current theme: {theme}</p>
    </div>
  );
} 