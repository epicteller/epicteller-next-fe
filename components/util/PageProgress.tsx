import 'nprogress/nprogress.css';
import nProgress from 'nprogress';
import Router from 'next/router';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

export default function () {
  return;
};
