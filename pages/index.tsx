import type { NextPage } from 'next';
import useMe from '../hooks/me';
import SignInPage from './signin';

const Home: NextPage = () => {
  const { me } = useMe();
  return (
    me ? <h1>{`Hello! ${me.name}`}</h1> : <SignInPage />
  );
};

export default Home;
