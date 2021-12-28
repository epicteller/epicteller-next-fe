import type { NextPage } from 'next';
import useMe from '../hooks/me';
import SignInPage from './signin';
import SimpleLayout from '../components/layout/Simple';

const Home: NextPage = () => {
  const { me } = useMe();
  return (
    me
      ? (
        <SimpleLayout>
          <h1>{`Hello! ${me.name}`}</h1>
        </SimpleLayout>
      )
      : <SignInPage />
  );
};

export default Home;
