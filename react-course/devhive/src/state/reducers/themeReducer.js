export const initialThemeState = {
  mode: 'dark',
  primaryColor: '#646cff',
  secondaryColor: '#bd34fe',
};

export function themeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        mode: state.mode === 'dark' ? 'light' : 'dark',
      };
    case 'SET_THEME':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_PRIMARY_COLOR':
      return {
        ...state,
        primaryColor: action.payload,
      };
    case 'SET_SECONDARY_COLOR':
      return {
        ...state,
        secondaryColor: action.payload,
      };
    default:
      return state;
  }
} 