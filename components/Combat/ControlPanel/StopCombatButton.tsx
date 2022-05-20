import { KeyedMutator } from 'swr';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { Combat } from '../../../types/combat';
import epAPI from '../../../lib/api';
import { EpictellerError } from '../../../types/errors/validation';
import useNotifier from '../../../hooks/notifier';

export interface StopCombatButtonProps {
  combat?: Combat;
  mutate?: KeyedMutator<Combat>;
}

const StopCombatButton = ({ combat, mutate }: StopCombatButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { notifyError } = useNotifier();

  const cancel = () => setDialogOpen(false);
  const confirm = async () => {
    if (mutate && combat) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.put<Combat>(`/combats/${combat.id}`, { action: 'end' });
          return response.data;
        } catch (error) {
          notifyError((error as AxiosError<EpictellerError>).response?.data?.message);
          throw error;
        }
      }, {
        optimisticData: {
          ...combat,
          state: 'ended',
        },
        rollbackOnError: true,
      }).then();
    }
    setDialogOpen(false);
  };

  if (combat?.state !== 'running') {
    return null;
  }

  return (
    <>
      <Tooltip title="结束战斗">
        <Button
          color="error"
          size="small"
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          <StopIcon />
        </Button>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={cancel}>
        <DialogTitle>结束战斗</DialogTitle>
        <DialogContent>
          <DialogContentText>
            该操作不可撤销，是否确定结束战斗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm} variant="contained" color="error">结束战斗</Button>
          <Button onClick={cancel} variant="text">取消</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StopCombatButton;
