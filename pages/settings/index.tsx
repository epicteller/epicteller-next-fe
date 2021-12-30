import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SettingsPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (router) {
      router.push('/settings/profile').then();
    }
  }, [router]);
  return <div />;
};

export default SettingsPage;
