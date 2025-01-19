const STORAGE_PREFIX = 'devhive_';

export const localStore = {
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get(key, defaultValue = null) {
    try {
      const serializedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return serializedValue ? JSON.parse(serializedValue) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}; 