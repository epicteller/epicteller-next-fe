import type { NextPage } from 'next';
import useMe from '../hooks/me';
import SignInPage from './signin';
import BasicLayout from '../layouts';
import MyCampaignsList from '../components/Home/MyCampaignsList';
import Title from '../components/util/Title';

const Home: NextPage = () => {
  const { me } = useMe();
  return (
    me
      ? (
        <BasicLayout>
          <>
            <Title title="首页" />
            <MyCampaignsList />
          </>
        </BasicLayout>
      )
      : <SignInPage />
  );
};

export default Home;
