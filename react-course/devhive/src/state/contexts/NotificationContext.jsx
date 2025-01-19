import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { notificationReducer, initialState } from '../reducers/notificationReducer';
import { localStore } from '../storage/localStore';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load saved notifications on mount
  useEffect(() => {
    const savedNotifications = localStore.get('notifications');
    if (savedNotifications) {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: savedNotifications });
    }
  }, []);

  // Save notifications when they change
  useEffect(() => {
    localStore.set('notifications', state.notifications);
  }, [state.notifications]);

  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
      },
    });
  };

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        addNotification,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
} 