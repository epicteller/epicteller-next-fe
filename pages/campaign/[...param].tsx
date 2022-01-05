import { useRouter } from 'next/router';
import { ReactElement, ReactNode } from 'react';
import { NextPageWithLayout } from '../../types/layout';
import CampaignLayout from '../../layouts/Campaign';

const CampaignPage: NextPageWithLayout = () => {
  const router = useRouter();
};

CampaignPage.getLayout = (page: ReactElement): ReactNode => (
  <CampaignLayout>{page}</CampaignLayout>
);

export default CampaignPage;
