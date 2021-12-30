import type { NextPage } from 'next';
import useMe from '../hooks/me';
import SignInPage from './signin';
import BasicLayout from '../layouts';
import MyCampaignsList from '../components/Home/MyCampaignsList';

const Home: NextPage = () => {
  const { me } = useMe();
  return (
    me
      ? (
        <BasicLayout>
          <MyCampaignsList />
        </BasicLayout>
      )
      : <SignInPage />
  );
};

export default Home;
