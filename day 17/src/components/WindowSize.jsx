import useWindowSize from '../hooks/useWindowSize';
import { useTheme } from '../contexts/ThemeContext';

export default function WindowSize() {
  const { width, height } = useWindowSize();
  const { theme } = useTheme();

  return (
    <div className={`window-size ${theme}`}>
      <h2>Window Size Demo (Custom Hook)</h2>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
} 