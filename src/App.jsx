import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './routes';
import { useLenis } from './hooks/useLenis';

function MainApp() {
  useLenis();

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