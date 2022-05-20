import {
  Avatar,
  Box, Button,
  Chip,
  IconButton, Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import stc from 'string-to-color';
import { DiceMessageContent, Message, MessageType, TextMessageContent } from '../../types/message';
import { Campaign } from '../../types/campaign';
import TimeChip from '../util/TimeChip';

export interface MessageItemProps {
  campaign: Campaign
  message: Message
  index: number
}

export interface MessageContentProps {
  message: Message
}

const MessageContent = ({ message }: MessageContentProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  switch (message.messageType) {
    case 'text': {
      const content = message.content as TextMessageContent;
      return (
        <Typography sx={{ whiteSpace: 'pre-line' }} variant="body2" color="textPrimary">
          {content.text}
        </Typography>
      );
    }
    case 'dice': {
      const content = message.content as DiceMessageContent;
      return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Tooltip title={expanded ? '收起算式' : '展开算式'}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link sx={{ pr: 0.5 }} component="button" onClick={toggleExpanded} underline="none">🎲</Link>
          </Tooltip>
          <Typography
            variant="body2"
            color="textPrimary"
            sx={{ mt: 0.2 }}
          >
            {' '}
            {expanded
              ? content.detail.toUpperCase()
              : content.expression.toUpperCase()}
            {' '}
            =
            {' '}
            {content.value}
          </Typography>
        </Box>
      );
    }
    case 'image': {
      // const content = message.content as ImageMessageContent;
      return (
        <Typography variant="body2">[图片]</Typography>
      );
    }
    default: {
      return (
        <Typography variant="body2">
          [未知内容]
        </Typography>
      );
    }
  }
};

const MessageItem = ({ campaign, message }: MessageItemProps) => {
  const isGM = message.isGm;
  let avatar = <Avatar>?</Avatar>;
  let name = '未知';
  if (message.character) {
    avatar = (
      <Avatar
        src={message.character?.avatar}
        sx={{ bgcolor: stc(message.character?.name) }}
      >
        {message.character?.name[0]}
      </Avatar>
    );
    name = message.character?.name;
  } else if (isGM) {
    avatar = (
      <Avatar
        src={campaign.owner.avatar}
        sx={{ bgcolor: stc(campaign.owner.name) }}
      >
        {campaign.owner.name[0]}
      </Avatar>
    );
    name = campaign.owner.name;
  }

  return (
    <ListItem
      alignItems="flex-start"
    >
      <ListItemAvatar>
        {avatar}
      </ListItemAvatar>
      <ListItemText
        primary={(
          <Typography
            display="inline"
            noWrap
            gutterBottom
            variant="body2"
            sx={{
              color: isGM ? 'warning.main' : 'text.primary',
              fontWeight: isGM ? 'bold' : 'normal',
            }}
          >
            {name}
            <Typography component="span" sx={{ pl: 1 }} gutterBottom variant="caption" color="textSecondary">
              <TimeChip timestamp={message.created} textType="time" />
            </Typography>
          </Typography>
        )}
        secondary={<MessageContent message={message} />}
      />
    </ListItem>
  );
};

export default MessageItem;
