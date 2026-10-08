import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
  }
  return 'dark';
};

const getInitialProjectMode = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('project_view_mode');
    if (saved) return saved;
  }
  return 'stack';
};

const initialState = {
  theme: getInitialTheme(),
  menuOpen: false,
  preloaderDone: false,
  cursorMode: 'default',
  cursorText: '',
  projectViewMode: getInitialProjectMode(),
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
    toggleMenu: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    setMenuOpen: (state, action) => {
      state.menuOpen = action.payload;
    },
    setPreloaderDone: (state, action) => {
      state.preloaderDone = action.payload;
    },
    setCursorState: (state, action) => {
      state.cursorMode = action.payload.mode || 'default';
      state.cursorText = action.payload.text || '';
    },
    resetCursorState: (state) => {
      state.cursorMode = 'default';
      state.cursorText = '';
    },
    setProjectViewMode: (state, action) => {
      state.projectViewMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('project_view_mode', action.payload);
      }
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMenu,
  setMenuOpen,
  setPreloaderDone,
  setCursorState,
  resetCursorState,
  setProjectViewMode,
} = uiSlice.actions;

export default uiSlice.reducer;
