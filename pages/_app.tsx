import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '../components/theme';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider>
    <SnackbarProvider maxSnack={5}>
      <Component {...pageProps} />
    </SnackbarProvider>
  </ThemeProvider>
);

export default MyApp;
