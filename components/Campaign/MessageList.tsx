import { Box, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { useCallback, useRef } from 'react';
import { useVirtual } from 'react-virtual';
import { MessagesResponse } from '../../types/message';
import MessageItem from './MessageItem';
import { Campaign } from '../../types/campaign';
import { Episode } from '../../types/episode';
import ScrollBar from '../util/ScrollBar';

export interface messageListProps {
  campaign: Campaign;
  episode: Episode;
}

const MessageList = ({ campaign, episode }: messageListProps) => {
  const {
    data: messageData,
    error: messageError,
  } = useSWR<MessagesResponse>(episode && `/episodes/${episode.id}/messages?limit=-1`);
  const isLoading = !messageData && !messageError;
  const messages = messageData?.data ?? [];

  const parentRef = useRef<HTMLElement | null>(null);
  const rowVirtualizer = useVirtual({
    size: messages.length,
    parentRef,
    estimateSize: useCallback(() => 71, []),
    overscan: 10,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, p: 3, height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ScrollBar
      ref={(ref) => {
        parentRef.current = ref?.osInstance()?.getElements().viewport ?? null;
      }}
      style={{
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
      }}
    >
      <Box sx={{ flexGrow: 1, flexShrink: 1, height: rowVirtualizer.totalSize }}>
        {rowVirtualizer.virtualItems.map((vRow) => (
          <MessageItem
            ref={vRow.measureRef}
            campaign={campaign}
            message={messages[vRow.index]}
            index={vRow.index}
            key={vRow.index}
            startY={vRow.start}
          />
        ))}
        <Box sx={{ height: 80 }} />
      </Box>
    </ScrollBar>
  );
};
export default MessageList;
