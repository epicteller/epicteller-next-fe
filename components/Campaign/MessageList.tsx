import { Box, CircularProgress, List } from '@mui/material';
import useSWR from 'swr';
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, p: 3, height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ScrollBar style={{ display: 'flex', flexGrow: 1, flexShrink: 1 }}>
      <Box sx={{ flexGrow: 1, flexShrink: 1 }}>
        <List>
          {
            messages.map((message, index) => (
              <MessageItem
                index={index}
                key={message.id}
                campaign={campaign}
                message={message}
              />
            ))
          }
          <Box sx={{ height: 80 }} />
        </List>
      </Box>
    </ScrollBar>
  );
};
export default MessageList;
