
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import MainApp from './components/MainApp';

const App = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <Provider store={store}>
          <MainApp />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
              success: {
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid hsl(var(--primary))',
                },
              },
              error: {
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid hsl(var(--destructive))',
                },
              },
            }}
          />
        </Provider>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
