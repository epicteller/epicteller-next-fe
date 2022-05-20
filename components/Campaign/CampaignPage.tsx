import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Box } from '@mui/material';
import { useLocalStorage } from 'react-use';
import { NextPageWithLayout } from '../../types/layout';
import { Campaign } from '../../types/campaign';
import { Episode } from '../../types/episode';
import Title from '../util/Title';
import SideBar from './SideBar';
import MessageList from './MessageList';
import CampaignLayout from '../../layouts/Campaign';
import CombatView from '../Combat/CombatView';
import { PagingResponse } from '../../types';

const minSideBarWidth = 240;

const isEpisodeExisted = (episodes: Episode[], episodeID: string | string[] | undefined): boolean => (
  !!episodeID && episodes.some((episode) => episode.id === episodeID)
);

const CampaignPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [sideBarWidth] = useState(minSideBarWidth);
  const { campaignID, combat: combatID }: { campaignID?: string, combat?: string } = router.query;
  const selectedEpisodeID = router.query.episodeID as string | undefined;
  const [storageEpisodeID, setStorageEpisodeID] = useLocalStorage<string | undefined>(
    `/campaign/${campaignID}/selectedEpisodeID`,
    undefined,
  );
  const { data: campaign, error: campaignError } = useSWR<Campaign>(router.isReady ? `/campaigns/${campaignID}` : null);
  const campaignIsLoading = !campaign && !campaignError;

  const selectEpisode = useCallback((episodeID: string) => {
    setStorageEpisodeID(episodeID);
    router.push({
      pathname: '/campaign/[campaignID]/episode/[episodeID]',
      query: { ...router.query, campaignID, episodeID },
    }).then();
  }, [campaignID, router, setStorageEpisodeID]);

  const {
    data: episodesData,
    error: episodesError,
    mutate: episodesMutate,
  } = useSWR<PagingResponse<Episode>>(router.isReady ? `/campaigns/${campaignID}/episodes` : null, null, {
    onSuccess: (data) => {
      if (selectedEpisodeID) {
        return;
      }
      if (router.isReady && isEpisodeExisted(data.data, selectedEpisodeID)) {
        selectEpisode(selectedEpisodeID as string);
        return;
      }
      if (storageEpisodeID && isEpisodeExisted(data.data, storageEpisodeID)) {
        selectEpisode(storageEpisodeID);
        return;
      }
      if (!data.data.length) {
        return;
      }
      selectEpisode(data.data[data.data.length - 1]?.id);
    },
  });
  const episodesIsLoading = !episodesData && !episodesError;

  const episodes = useMemo(() => episodesData?.data ?? [], [episodesData]);
  const selectedEpisode = useMemo(
    () => episodes.find((episode) => episode.id === selectedEpisodeID),
    [episodes, selectedEpisodeID],
  );

  const sideBarIsLoading = campaignIsLoading || episodesIsLoading;

  if (router.isReady && storageEpisodeID && selectedEpisodeID !== storageEpisodeID) {
    setStorageEpisodeID(selectedEpisodeID);
  }

  return (
    <>
      <Title title={campaign?.name ?? '战役'} />
      <Box sx={{ display: 'flex' }}>
        <SideBar
          width={sideBarWidth}
          isLoading={sideBarIsLoading}
          campaign={campaign}
          episodes={episodes}
          selectedEpisodeID={selectedEpisodeID}
          selectEpisode={selectEpisode}
          mutate={episodesMutate}
        />
        <MessageList campaign={campaign!!} episode={selectedEpisode!!} />
        <CombatView combatID={combatID} />
      </Box>
    </>
  );
};

CampaignPage.getLayout = (page: ReactElement): ReactNode => (
  <CampaignLayout>{page}</CampaignLayout>
);

export default CampaignPage;
