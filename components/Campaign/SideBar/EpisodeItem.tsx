import React, { useState } from 'react';
import { AxiosError } from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';
import { useHover } from 'react-use';
import useMe from '../../../hooks/me';
import epAPI from '../../../lib/api';
import useNotifier from '../../../hooks/notifier';
import { Episode } from '../../../types/episode';
import { Campaign } from '../../../types/campaign';

interface episodeItemProps {
  campaign: Campaign | undefined
  episode: Episode
  selected: boolean
  selectEpisode: (episodeID: string) => void
  mutate: () => void
}

interface editEpisodeTitleProps {
  episode: Episode
  onFinish: (title?: string) => void
  open: boolean
}

const EditEpisodeTitleDialog = ({ episode, onFinish, open }: editEpisodeTitleProps) => {
  const [title, setTitle] = useState(episode.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyError, notifySuccess } = useNotifier();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };
  const isValidTitle = () => title.length > 0 && title.length <= 20 && title !== episode.title;
  const submit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      await epAPI.put(`/episodes/${episode.id}`, { title });
      notifySuccess('修改成功');
      onFinish(title);
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data?.message) {
        notifyError(err.response.data.message);
      } else {
        notifyError('出错了，请稍后再试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onFinish()}
    >
      <DialogTitle>修改章节标题</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          variant="outlined"
          margin="dense"
          label="章节标题"
          value={title}
          onChange={changeTitle}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onFinish()}>取消</Button>
        <LoadingButton onClick={submit} disabled={!isValidTitle()} loading={isSubmitting}>确定</LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const EpisodeItem = ({ campaign, episode, selected, selectEpisode, mutate }: episodeItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { me } = useMe();
  const isOwner = me && campaign?.owner?.id === me.id;

  const onFinish = (title?: string) => {
    setDialogOpen(false);
    if (title) {
      mutate();
    }
  };

  const element = (hovered: boolean) => (
    <ListItem
      secondaryAction={hovered && !dialogOpen && isOwner && (
        <IconButton edge="end" size="small" onClick={() => setDialogOpen(true)}>
          <EditIcon />
        </IconButton>
      )}
      disablePadding
    >
      <ListItemButton
        sx={{ pl: 4 }}
        selected={selected}
        onClick={() => !selected && selectEpisode(episode.id)}
      >
        <ArticleIcon sx={{ mr: 1 }} />
        <ListItemText
          primaryTypographyProps={{
            noWrap: true,
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
          primary={episode.title}
        />
      </ListItemButton>
      <EditEpisodeTitleDialog episode={episode} onFinish={onFinish} open={dialogOpen} />
    </ListItem>

  );
  const [hoverable] = useHover(element);
  return hoverable;
};

export default EpisodeItem;
