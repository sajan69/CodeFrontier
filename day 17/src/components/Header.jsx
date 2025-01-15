import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const { theme } = useTheme();
  const { user } = useUser();

  return (
    <header className={`header ${theme}`}>
      <h1>React Hooks Demo</h1>
      <p>Welcome, {user.name}!</p>
    </header>
  );
} 