import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userPreferencesReducer, initialState } from '../reducers/userPreferencesReducer';
import { localStore } from '../storage/localStore';

const UserPreferencesContext = createContext();

export function UserPreferencesProvider({ children }) {
  const [state, dispatch] = useReducer(userPreferencesReducer, initialState);

  useEffect(() => {
    const savedPreferences = localStore.get('userPreferences');
    if (savedPreferences) {
      dispatch({ type: 'SET_PREFERENCES', payload: savedPreferences });
    }
  }, []);

  useEffect(() => {
    localStore.set('userPreferences', state);
  }, [state]);

  const updatePreference = (key, value) => {
    dispatch({ type: 'UPDATE_PREFERENCE', payload: { [key]: value } });
  };

  const resetPreferences = () => {
    dispatch({ type: 'RESET_PREFERENCES' });
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        ...state,
        updatePreference,
        resetPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

UserPreferencesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
} 