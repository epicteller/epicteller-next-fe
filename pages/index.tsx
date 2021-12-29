import type { NextPage } from 'next';
import useMe from '../hooks/me';
import SignInPage from './signin';
import SimpleLayout from '../layouts/Simple';
import MyCampaignsList from '../components/Home/MyCampaignsList';

const Home: NextPage = () => {
  const { me } = useMe();
  return (
    me
      ? (
        <SimpleLayout>
          <MyCampaignsList />
        </SimpleLayout>
      )
      : <SignInPage />
  );
};

export default Home;
