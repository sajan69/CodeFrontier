import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { themeReducer, initialThemeState } from '../reducers/themeReducer';
import { localStore } from '../storage/localStore';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialThemeState);

  useEffect(() => {
    const savedTheme = localStore.get('theme');
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  useEffect(() => {
    localStore.set('theme', state);
  }, [state]);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <ThemeContext.Provider value={{ ...state, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
} 