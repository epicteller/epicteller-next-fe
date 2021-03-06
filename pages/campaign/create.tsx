import React, { ReactElement, ReactNode, useState } from 'react';
import useSWR from 'swr';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { LoadingButton } from '@mui/lab';
import { NextPageWithLayout } from '../../types/layout';
import BasicLayout from '../../layouts';
import { Room } from '../../types/room';
import { PagingResponse } from '../../types';
import Title from '../../components/util/Title';
import epAPI from '../../lib/api';
import { Campaign } from '../../types/campaign';
import { ValidationErrorResponse } from '../../types/errors/validation';
import useNotifier from '../../hooks/notifier';
import { extractValidationError } from '../../lib/error';

const CreateCampaignPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { notifyError } = useNotifier();
  const { data } = useSWR<PagingResponse<Room>>('/me/rooms');
  const rooms = data?.data;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');
  const [prepareRoomId, setPrepareRoomId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<ValidationErrorResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await epAPI.post<Campaign>('/campaigns', {
        name,
        description,
        roomId,
      });
      await router.push('/');
    } catch (e) {
      const err = e as AxiosError;
      if (err.response?.data.name === 'ValidationError') {
        setValidationError(err.response.data);
      } else if (err.response?.data?.message) {
        notifyError(err.response?.data?.message);
      } else {
        notifyError('???????????????????????????');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectRoom = (e: SelectChangeEvent) => {
    const selectedRoomId = e.target.value as string;
    const room = rooms?.find((r) => r.id === selectedRoomId);
    if (!room) {
      return;
    }
    if (!room.hasRunningCampaign) {
      setRoomId(selectedRoomId);
      return;
    }
    setPrepareRoomId(selectedRoomId);
    setDialogOpen(true);
  };

  const cancel = () => setDialogOpen(false);
  const confirm = () => {
    setRoomId(prepareRoomId);
    setPrepareRoomId('');
    setDialogOpen(false);
  };

  return (
    <Paper sx={{ py: 2, px: 3, pb: 4 }}>
      <Title title="???????????????" />
      <Typography variant="h6">???????????????</Typography>
      <Divider sx={{ my: 2 }} />
      <form onSubmit={submit}>
        <Typography variant="subtitle2">????????????</Typography>
        <TextField
          sx={{ pt: 0.5, pb: 2 }}
          variant="outlined"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          fullWidth
          error={!!extractValidationError(validationError?.detail, 'name')}
          helperText={extractValidationError(validationError?.detail, 'name')?.msg}
        />
        <Typography variant="subtitle2">??????</Typography>
        <TextField
          sx={{ pt: 0.5, pb: 2 }}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          error={!!extractValidationError(validationError?.detail, 'description')}
          helperText={extractValidationError(validationError?.detail, 'description')?.msg}
        />
        <Typography variant="subtitle2">????????????</Typography>
        <Select
          value={roomId}
          onChange={selectRoom}
          required
          fullWidth
        >
          {rooms?.map((room) => (
            <MenuItem value={room.id} key={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </Select>
        <Dialog open={dialogOpen}>
          <Dialog open={dialogOpen} onClose={cancel}>
            <DialogTitle>??????????????????</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ??????????????????????????????????????????????????????????????????????????????
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancel} variant="text">??????</Button>
              <Button onClick={confirm} variant="contained" color="primary">??????</Button>
            </DialogActions>
          </Dialog>
        </Dialog>
        <LoadingButton
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          color="primary"
          loading={submitting}
        >
          ??????
        </LoadingButton>
      </form>
    </Paper>
  );
};

CreateCampaignPage.getLayout = (page: ReactElement): ReactNode => (
  <BasicLayout>
    {page}
  </BasicLayout>
);

export default CreateCampaignPage;
