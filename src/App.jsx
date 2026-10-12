import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './routes';
import { useLenis } from './hooks/useLenis';
import { initGlobalSoundListeners } from './lib/sfx';
import { resetCursorState } from './store/uiSlice';

function MainApp() {
  useLenis();
  const location = useLocation();
  const dispatch = useDispatch();

  // Reset cursor on route changes
  useEffect(() => {
    dispatch(resetCursorState());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const cleanup = initGlobalSoundListeners();
    return cleanup;
  }, []);

  return <AppRoutes />;
}

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </Provider>
  );
}

export default App;