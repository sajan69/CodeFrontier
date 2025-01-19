export const initialState = {
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  emailNotifications: true,
  collaborationPreferences: {
    autoJoin: false,
    showOnline: true,
    shareActivity: true,
  },
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    reduceMotion: false,
  },
};

export function userPreferencesReducer(state, action) {
  switch (action.type) {
    case 'SET_PREFERENCES':
      return {
        ...state,
        ...action.payload,
      };

    case 'UPDATE_PREFERENCE':
      return {
        ...state,
        ...action.payload,
      };

    case 'UPDATE_COLLABORATION_PREFERENCES':
      return {
        ...state,
        collaborationPreferences: {
          ...state.collaborationPreferences,
          ...action.payload,
        },
      };

    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        accessibility: {
          ...state.accessibility,
          ...action.payload,
        },
      };

    case 'RESET_PREFERENCES':
      return initialState;

    default:
      return state;
  }
} 