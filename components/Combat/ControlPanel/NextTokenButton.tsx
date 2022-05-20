import { KeyedMutator } from 'swr';
import { AxiosError } from 'axios';
import { Button, Tooltip } from '@mui/material';
import RedoIcon from '@mui/icons-material/Redo';
import { AddCombatTokenResponse, Combat } from '../../../types/combat';
import epAPI from '../../../lib/api';
import { EpictellerError } from '../../../types/errors/validation';
import useNotifier from '../../../hooks/notifier';

export interface NextTokenButtonProps {
  combat?: Combat;
  mutate?: KeyedMutator<Combat>;
}

const NextTokenButton = ({ combat, mutate }: NextTokenButtonProps) => {
  const { notifyError } = useNotifier();

  if (!combat || combat.state !== 'running') {
    return null;
  }

  const confirm = async () => {
    if (mutate && combat) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.put<Combat>(`/combats/${combat.id}`, {
            action: 'next',
          });
          return response.data;
        } catch (error) {
          notifyError((error as AxiosError<EpictellerError>).response?.data?.message);
          throw error;
        }
      }).catch();
    }
  };

  return (
    <Tooltip title="下一个行动者" placement="bottom-start">
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={confirm}
      >
        <RedoIcon />
      </Button>
    </Tooltip>
  );
};

export default NextTokenButton;
