import { KeyedMutator } from 'swr';
import { useState } from 'react';
import { AxiosError } from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddCombatTokenResponse, Combat, CombatState } from '../../../types/combat';
import epAPI from '../../../lib/api';
import { EpictellerError } from '../../../types/errors/validation';
import useNotifier from '../../../hooks/notifier';

export interface AddTokenButtonProps {
  combat?: Combat;
  mutate?: KeyedMutator<Combat>;
}

const dialogTextConfig: { [key in CombatState]: string } = {
  initiating: '战斗正在先攻阶段，新增顺位会按照先攻值的大小排序。',
  running: '战斗正在行动阶段，新增顺位会直接进入顺位的末尾。',
  ended: '',
};

const AddTokenButton = ({ combat, mutate }: AddTokenButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [initiative, setInitiative] = useState(0);
  const { notifyError } = useNotifier();

  if (!combat || combat.state === 'ended') {
    return null;
  }

  const isDuplicateToken = (name: string): boolean => {
    const a = combat?.order.order.map((i) => i.name);
    return !!a?.includes(name);
  };

  const cancel = () => setDialogOpen(false);

  const confirm = async () => {
    if (isDuplicateToken(tokenName)) {
      return;
    }
    if (mutate && combat) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.post<AddCombatTokenResponse>(`/combats/${combat.id}/tokens`, {
            name: tokenName,
            initiative,
          });
          return response.data?.combat;
        } catch (error) {
          notifyError((error as AxiosError<EpictellerError>).response?.data?.message);
          throw error;
        }
      }, {
        optimisticData: {
          ...combat,
          tokens: { ...combat.tokens, [tokenName]: { name: tokenName, initiative } },
        },
        revalidate: false,
      }).catch();
    }
    setDialogOpen(false);
    setTokenName('');
    setInitiative(0);
  };

  return (
    <>
      <Tooltip title="追加先攻">
        <Button
          color="primary"
          size="small"
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </Button>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={cancel}>
        <DialogTitle>追加先攻</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogTextConfig[combat.state]}</DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', '& .MuiTextField-root': { m: 1 } }}>
            <TextField
              autoFocus
              required
              error={isDuplicateToken(tokenName)}
              value={tokenName}
              onChange={(e) => setTokenName(e.currentTarget.value)}
              margin="dense"
              label="名称"
              helperText={isDuplicateToken(tokenName) && '名称重复'}
              fullWidth
            />
            {combat?.state === 'initiating' && (
              <TextField
                required
                value={initiative}
                onChange={(e) => setInitiative(parseFloat(e.currentTarget.value) || 0)}
                margin="dense"
                inputProps={{ inputMode: 'text', pattern: '[+-]?([0-9]*[.])?[0-9]+' }}
                label="先攻值"
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} variant="text">取消</Button>
          <Button
            onClick={confirm}
            variant="contained"
            color="primary"
            disabled={!tokenName || isDuplicateToken(tokenName)}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTokenButton;
