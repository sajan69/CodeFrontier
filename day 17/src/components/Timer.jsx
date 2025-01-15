import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className={`timer ${theme}`}>
      <h2>Timer Demo (useEffect)</h2>
      <p>Seconds: {seconds}</p>
    </div>
  );
} 