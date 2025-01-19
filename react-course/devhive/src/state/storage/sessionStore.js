const SESSION_PREFIX = 'devhive_session_';

// Broadcast channel for cross-tab communication
const broadcastChannel = new BroadcastChannel('devhive_state_sync');

export const sessionStore = {
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(`${SESSION_PREFIX}${key}`, serializedValue);
      // Broadcast change to other tabs
      broadcastChannel.postMessage({
        type: 'STATE_UPDATE',
        key,
        value,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  get(key, defaultValue = null) {
    try {
      const serializedValue = sessionStorage.getItem(`${SESSION_PREFIX}${key}`);
      return serializedValue ? JSON.parse(serializedValue) : defaultValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  },

  remove(key) {
    sessionStorage.removeItem(`${SESSION_PREFIX}${key}`);
    broadcastChannel.postMessage({
      type: 'STATE_REMOVE',
      key,
      timestamp: Date.now(),
    });
  },

  clear() {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(SESSION_PREFIX))
      .forEach(key => sessionStorage.removeItem(key));
    broadcastChannel.postMessage({
      type: 'STATE_CLEAR',
      timestamp: Date.now(),
    });
  },

  // Subscribe to changes from other tabs
  subscribe(callback) {
    const handler = (event) => callback(event.data);
    broadcastChannel.addEventListener('message', handler);
    return () => broadcastChannel.removeEventListener('message', handler);
  },
}; 