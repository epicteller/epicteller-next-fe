import { Avatar, Box, Link, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from '@mui/material';
import { forwardRef, RefAttributes, useMemo, useState } from 'react';
import stc from 'string-to-color';
import { DiceMessageContent, Message, TextMessageContent } from '../../types/message';
import { Campaign } from '../../types/campaign';
import TimeChip from '../util/TimeChip';

export interface MessageItemProps {
  campaign: Campaign
  message: Message
  index: number
  startY: number
}

export interface MessageContentProps {
  message: Message
}

export interface MessageAvatarProps {
  campaign: Campaign
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

const MessageAvatar = ({ campaign, message }: MessageAvatarProps) => {
  if (message.character) {
    return (
      <Avatar
        src={message.character?.avatar}
        sx={{
          bgcolor: stc(message.character?.name),
          height: 40,
          width: 40,
        }}
      >
        {message.character?.name[0]}
      </Avatar>
    );
  }
  if (message.isGm) {
    return (
      <Avatar
        src={campaign.owner.avatar}
        sx={{
          bgcolor: stc(campaign.owner.name),
          height: 40,
          width: 40,
        }}
      >
        {campaign.owner.name[0]}
      </Avatar>
    );
  }
  return <Avatar>?</Avatar>;
};

const messageName = ({ campaign, message }: MessageAvatarProps): string => {
  if (message.character) {
    return message.character.name;
  }
  if (message.isGm) {
    return campaign.owner.name;
  }
  return '未知';
};

const MessageInner = ({ campaign, message }: MessageAvatarProps) => {
  const isGM = message.isGm;
  const avatar = useMemo(() => <MessageAvatar campaign={campaign} message={message} />, [campaign, message]);
  const content = useMemo(() => <MessageContent message={message} />, [message]);
  const time = useMemo(() => <TimeChip timestamp={message.created} textType="time" />, [message]);
  const name = useMemo(() => messageName({ campaign, message }), [campaign, message]);

  return (
    <>
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
              {time}
            </Typography>
          </Typography>
        )}
        secondary={content}
      />
    </>
  );
};

const MessageItem = forwardRef<HTMLLIElement, MessageItemProps>(({ campaign, message, startY }, ref) => {
  const inner = useMemo(() => <MessageInner campaign={campaign} message={message} />, [campaign, message]);

  return (
    <ListItem
      ref={ref}
      alignItems="flex-start"
      sx={{
        position: 'absolute',
        top: startY,
        left: 0,
        width: '100%',
      }}
    >
      {inner}
    </ListItem>
  );
});
MessageItem.displayName = 'MessageItem';

export default MessageItem;
