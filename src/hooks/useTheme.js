import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../store/uiSlice';

export function useTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (newTheme) => dispatch(setTheme(newTheme)),
  };
}
