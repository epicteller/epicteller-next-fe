import { Box, CircularProgress, Divider, Drawer, List, ListSubheader, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Campaign } from '../../../types/campaign';
import { Episode } from '../../../types/episode';
import EpisodeItem from './EpisodeItem';
import CharacterItem from './CharacterItem';
import ScrollBar from '../../util/ScrollBar';
import CombatItem from './CombatItem';

export interface episodeSideBarProps {
  isLoading: boolean
  campaign: Campaign | undefined
  episodes: Episode[]
  selectedEpisodeID?: string
  selectEpisode: (episodeID: string) => void
  width: number
  mutate: () => void
}

const SideBarInner = ({
  isLoading,
  campaign,
  episodes,
  selectedEpisodeID,
  selectEpisode,
  mutate,
}: episodeSideBarProps) => {
  if (isLoading || !campaign) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, p: 3, height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <Toolbar>
        <Typography
          sx={{ fontWeight: 'bold' }}
          noWrap
          variant="h6"
        >
          {campaign.name}
        </Typography>
      </Toolbar>
      <Divider />
      <ScrollBar
        style={{ height: '100%', overflowX: 'hidden' }}
        options={{
          overflowBehavior: { x: 'hidden' },
        }}
      >
        <List
          dense
          disablePadding
          subheader={(
            <ListSubheader>
              章节
            </ListSubheader>
          )}
        >
          {episodes.map((episode) => {
            const isSelected = episode.id === selectedEpisodeID;
            return (
              <EpisodeItem
                key={episode.id}
                campaign={campaign}
                episode={episode}
                selected={isSelected}
                selectEpisode={selectEpisode}
                mutate={mutate}
              />
            );
          })}
        </List>
        <List
          dense
          disablePadding
          subheader={(
            <ListSubheader>角色</ListSubheader>
          )}
        >
          {campaign?.characters?.map((character, index) => (
            <CharacterItem
              key={character.id}
              index={index}
              campaign={campaign}
              character={character}
            />
          ))}
        </List>
        {campaign?.runningCombat && (
          <List
            dense
            disablePadding
            subheader={<ListSubheader>战斗</ListSubheader>}
          >
            <CombatItem combat={campaign.runningCombat} />
          </List>
        )}
        <Box height={80} />
      </ScrollBar>
    </>
  );
};

const SideBar = ({
  width,
  isLoading,
  campaign,
  episodes,
  selectedEpisodeID,
  selectEpisode,
  mutate,
}: episodeSideBarProps) => (

  <Drawer
    variant="permanent"
    sx={{
      zIndex: (theme) => theme.zIndex.appBar - 1,
      width,
      height: '100vh',
      flexShrink: 0,
      display: { xs: 'none', sm: 'block' },
      '& .MuiDrawer-paper': { width, boxSizing: 'border-box' },
      overflowX: 'hidden',
    }}
    open
  >
    <SideBarInner
      width={width}
      isLoading={isLoading}
      campaign={campaign}
      episodes={episodes}
      selectedEpisodeID={selectedEpisodeID}
      selectEpisode={selectEpisode}
      mutate={mutate}
    />
  </Drawer>
);
export default SideBar;
