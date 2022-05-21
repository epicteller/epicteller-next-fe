import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { NextPageWithLayout } from '../../types/layout';
import { Combat } from '../../types/combat';

const CombatPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useSWR<Combat>(router.isReady ? `/combats/${router.query.combatID}` : null);

  useEffect(() => {
    if (router.isReady && data && data.campaignId) {
      router.push({
        pathname: `/campaign/${data.campaignId}`,
        query: { combat: data.id, campaignID: data.campaignId },
      }).then();
    }
  }, [data, router]);

  return (
    <Box />
  );
};

export default CombatPage;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}
