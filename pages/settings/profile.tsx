import { Button, Container, Divider, Grid, Paper, TextField, Typography, useTheme } from '@mui/material';
import { AxiosError } from 'axios';
import React, { ReactElement, ReactNode, useState } from 'react';
import { makeStyles } from '@mui/styles';
import epAPI from '../../lib/api';
import AvatarUploader from '../../components/Settings/AvatarUploader';
import useNotifier from '../../hooks/notifier';
import useMe from '../../hooks/me';
import { NextPageWithLayout } from '../../types/layout';
import SettingsLayout from '../../layouts/Settings';
import Title from '../../components/util/Title';

interface uploadResponse {
  token: string
  url: string
}

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    paper: {
      padding: theme.spacing(2, 3, 2, 3),
    },
    profileForm: {
      padding: theme.spacing(2, 1),
    },
    profileInput: {
      margin: theme.spacing(0.5, 0, 2, 0),
    },
    profileSubmitButton: {
      marginTop: theme.spacing(2),
    },
  };
});

const MyProfileSettingsPage: NextPageWithLayout = () => {
  const classes = useStyles();
  const { me, mutate } = useMe();
  const { notifySuccess, notifyError } = useNotifier();

  const [name, setName] = useState(me?.name!);
  const [headline, setHeadline] = useState(me?.headline);
  const [avatarURL, setAvatarURL] = useState(me?.avatarOriginal);

  const onProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await epAPI.put('/me', { name, headline });
      await mutate();
      notifySuccess('修改成功');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('出错了，请稍后再试');
      }
    }
  };

  const onAvatarUpload = async (dataURL: string) => {
    const data = dataURL.replace(/^data:image\/\w+;base64,/, '');
    try {
      const response = await epAPI.post('/image-upload', { data });
      const avatarInfo = response.data as uploadResponse;
      await epAPI.put('/me', { avatar: avatarInfo.token });
      setAvatarURL(dataURL);
      await mutate();
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('出错了，请稍后再试');
      }
    }
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>个人资料</Typography>
      <Divider />
      <Grid className={classes.profileForm} container spacing={4}>
        <Grid item xs sm={12} md={8}>
          <form onSubmit={onProfileSubmit}>
            <Typography variant="subtitle2">邮箱地址</Typography>
            <TextField
              className={classes.profileInput}
              variant="outlined"
              value={me?.email}
              fullWidth
              disabled
            />
            <Typography variant="subtitle2">用户名</Typography>
            <TextField
              className={classes.profileInput}
              margin="normal"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Typography variant="subtitle2">一句话介绍</Typography>
            <TextField
              className={classes.profileInput}
              margin="normal"
              variant="outlined"
              multiline
              maxRows={3}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              fullWidth
            />
            <Button
              className={classes.profileSubmitButton}
              variant="contained"
              color="primary"
              type="submit"
            >
              修改个人资料
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Container>
            <Typography variant="subtitle2" gutterBottom>头像</Typography>
            <AvatarUploader
              onUpload={onAvatarUpload}
              alt={me?.name}
              src={avatarURL}
              maxSizeBytes={10 * 1024 * 1024}
            />
          </Container>

        </Grid>
      </Grid>
    </Paper>
  );
};

MyProfileSettingsPage.getLayout = (page: ReactElement): ReactNode => (
  <SettingsLayout>{page}</SettingsLayout>
);

export default MyProfileSettingsPage;
