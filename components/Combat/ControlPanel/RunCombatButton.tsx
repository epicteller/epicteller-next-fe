import { KeyedMutator } from 'swr';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { GiBroadsword } from 'react-icons/gi';
import { Combat } from '../../../types/combat';
import epAPI from '../../../lib/api';
import { EpictellerError } from '../../../types/errors/validation';
import useNotifier from '../../../hooks/notifier';

export interface RunCombatButtonProps {
  combat?: Combat;
  mutate?: KeyedMutator<Combat>;
}

const RunCombatButton = ({ combat, mutate }: RunCombatButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { notifyError } = useNotifier();

  const cancel = () => setDialogOpen(false);
  const confirm = async () => {
    if (mutate && combat) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.put<Combat>(`/combats/${combat.id}`, { action: 'run' });
          return response.data;
        } catch (error) {
          notifyError((error as AxiosError<EpictellerError>).response?.data?.message);
          throw error;
        }
      }, {
        optimisticData: {
          ...combat,
          state: 'running',
          order: { ...combat.order, roundCount: 1 },
        },
        rollbackOnError: true,
      }).catch();
    }
    setDialogOpen(false);
  };

  if (combat?.state !== 'initiating') {
    return null;
  }

  return (
    <>
      <Tooltip title="进入行动阶段">
        <Button
          color="success"
          size="small"
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          <GiBroadsword size="1.5em" />
        </Button>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={cancel}>
        <DialogTitle>进入行动阶段</DialogTitle>
        <DialogContent>
          <DialogContentText>
            该操作不可撤销，是否正式进入行动阶段？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} variant="text">取消</Button>
          <Button onClick={confirm} variant="contained" color="success">确定</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RunCombatButton;
