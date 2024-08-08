import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/stores/store';

const store = configureStore({
  reducer: rootReducer,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
