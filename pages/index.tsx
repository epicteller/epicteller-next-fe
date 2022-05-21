import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useMe from '../hooks/me';
import BasicLayout from '../layouts';
import MyCampaignsList from '../components/Home/MyCampaignsList';
import Title from '../components/util/Title';

const Home: NextPage = () => {
  const router = useRouter();
  const { me } = useMe();
  useEffect(() => {
    if (!me) {
      router.push('/signin').then();
    }
  }, [me, router]);
  return (
    <BasicLayout>
      <>
        <Title title="首页" />
        <MyCampaignsList />
      </>
    </BasicLayout>
  );
};

export default Home;
