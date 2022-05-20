import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import TagManager, { TagManagerArgs } from 'react-gtm-module';
import { useEffect } from 'react';
import ThemeProvider from '../components/theme';
import APIProvider from '../components/api';
import { NextPageWithLayout } from '../types/layout';
import TopProgressBar from '../components/util/PageProgress';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const tagManagerArgs: TagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);
  return (
    <>
      <TopProgressBar />
      <Head>
        <title>Epicteller</title>
      </Head>
      <ThemeProvider>
        <SnackbarProvider maxSnack={5}>
          <APIProvider>
            {getLayout(<Component {...pageProps} />)}
          </APIProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
