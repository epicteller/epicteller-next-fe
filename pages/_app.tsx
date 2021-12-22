import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from '../components/theme';
import APIProvider from '../components/api';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Epicteller (Alpha)</title>
    </Head>
    <ThemeProvider>
      <SnackbarProvider maxSnack={5}>
        <APIProvider>
          <Component {...pageProps} />
        </APIProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </>
);

export default MyApp;
