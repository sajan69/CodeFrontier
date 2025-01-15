import { useState } from 'react';
import ThemeProvider from './contexts/ThemeContext';
import UserProvider from './contexts/UserContext';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import ThemeToggle from './components/ThemeToggle';
import Counter from './components/Counter';
import Timer from './components/Timer';
import WindowSize from './components/WindowSize';
import './App.css';

function App() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <ThemeProvider>
      <UserProvider>
        <div className="app">
          <Header />
          <main>
            <UserProfile />
            <ThemeToggle />
            <Counter />
            <button onClick={() => setShowTimer(!showTimer)}>
              {showTimer ? 'Hide' : 'Show'} Timer
            </button>
            {showTimer && <Timer />}
            <WindowSize />
          </main>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;