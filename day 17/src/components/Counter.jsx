import { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const { theme } = useTheme();

  const increment = () => {
    setCount(prev => prev + 1);
    countRef.current += 1;
  };

  return (
    <div className={`counter ${theme}`}>
      <h2>Counter Demo (useState & useRef)</h2>
      <p>State Count: {count}</p>
      <p>Ref Count: {countRef.current}</p>
      <button onClick={increment}>Increment Both</button>
    </div>
  );
} 