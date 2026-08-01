import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/reducers/store';
import { setColorScheme } from './store/reducers/theme';
import App from './App.tsx'

// Detect browser/OS dark mode
const media = window.matchMedia('(prefers-color-scheme: dark)');
store.dispatch(setColorScheme(media.matches ? 'dark' : 'light'));

media.addEventListener('change', (event) => {
  store.dispatch(setColorScheme(event.matches ? 'dark' : 'light'));
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)

console.log("Running in mode:", import.meta.env.MODE);
console.log("Auth server:", import.meta.env.VITE_AUTH_SERVER_URL);

