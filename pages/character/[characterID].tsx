import { ReactElement, ReactNode } from 'react';
import { Button, Container, Divider, Grid, Paper, Typography } from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import { AxiosError } from 'axios';
import BasicLayout from '../../layouts';
import Title from '../../components/util/Title';
import { NextPageWithLayout } from '../../types/layout';
import { Character } from '../../types/character';
import LoadingBox from '../../components/util/LoadingBox';
import AvatarUploader from '../../components/Settings/AvatarUploader';
import epAPI from '../../lib/api';
import { UploadResponse } from '../../types/upload';
import useNotifier from '../../hooks/notifier';

const CharacterPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { notifyError, notifySuccess, notifyInfo } = useNotifier();
  const { characterID } = router.query;
  const { data: character, error, mutate } = useSWR<Character>(router.isReady ? `/characters/${characterID}` : null);
  const isLoading = !character && !error;
  const isOwner = !!character?.relationship?.isOwner;

  const onAvatarUpload = async (dataURL: string) => {
    const data = dataURL.replace(/^data:image\/\w+;base64,/, '');
    try {
      const response = await epAPI.post('/image-upload', { data });
      const avatarInfo = response.data as UploadResponse;
      await epAPI.put(`/characters/${character?.id}`, { avatar: avatarInfo.token });
      notifySuccess('修改成功');
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
    <Paper sx={{ py: 2, px: 3, pb: 4 }}>
      <Title title={character?.name ?? '角色'} />
      <LoadingBox isLoading={isLoading} isError={!!error} retryFunc={mutate}>
        <Grid container direction="column">
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{character?.name}</Typography>
            {isOwner && (
              <Button variant="contained" color="primary" onClick={() => notifyInfo('咕咕咕.jpg')}>
                <EditIcon />
                修改角色
              </Button>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container sx={{ pt: 2 }} spacing={4}>
          <Grid item xs sm={12} md={9}>
            <Typography variant="body1">{character?.description || '无描述'}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Container>
              <AvatarUploader
                readOnly={!isOwner}
                onUpload={onAvatarUpload}
                src={character?.avatar}
              />
            </Container>
          </Grid>
        </Grid>
      </LoadingBox>
    </Paper>
  );
};

CharacterPage.getLayout = (page: ReactElement): ReactNode => (
  <BasicLayout>
    {page}
  </BasicLayout>
);

export default CharacterPage;
