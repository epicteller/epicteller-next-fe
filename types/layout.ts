import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

export interface LayoutProps {
  children: ReactElement;
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}
