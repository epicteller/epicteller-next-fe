import { ReactElement } from 'react';
import { LayoutProps } from '../types/layout';
import NavBar from '../components/NavBar';

const CampaignLayout = ({ children }: LayoutProps): ReactElement => (
  <>
    <NavBar />
    {children}
  </>
);

export default CampaignLayout;
