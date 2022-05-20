import { Avatar, Chip, Link, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import stc from 'string-to-color';
import { Campaign } from '../../../types/campaign';
import { Character } from '../../../types/character';

export interface characterItemProps {
  campaign: Campaign
  character: Character
  index: number
}

const avatarSize = 24;

const CharacterItem = ({ character }: characterItemProps) => (
  <ListItem disablePadding>
    <ListItemButton
      sx={{ pl: 4 }}
      component={Link}
      href={`/character/${character.id}`}
      target="_blank"
    >
      <ListItemAvatar sx={{ minWidth: avatarSize, mr: 1.5 }}>
        <Avatar
          sx={{
            width: avatarSize,
            height: avatarSize,
            fontSize: avatarSize * 0.6,
            bgcolor: stc(character.name),
          }}
          src={character.avatar}
        >
          {character.name[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={character.name} />
      {character.relationship?.isOwner && (
        <Chip color="primary" label="我" size="small" />
      )}
    </ListItemButton>
  </ListItem>
);

export default CharacterItem;
