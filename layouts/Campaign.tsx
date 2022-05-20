import { ReactElement } from 'react';
import { LayoutProps } from '../types/layout';
import NavBar from '../components/NavBar';

const CampaignLayout = ({ children }: LayoutProps): ReactElement => (
  <>
    {children}
  </>
);

export default CampaignLayout;
