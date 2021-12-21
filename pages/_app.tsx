import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '../components/theme';
import APIProvider from '../components/api';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider>
    <SnackbarProvider maxSnack={5}>
      <APIProvider>
        <Component {...pageProps} />
      </APIProvider>
    </SnackbarProvider>
  </ThemeProvider>
);

export default MyApp;
