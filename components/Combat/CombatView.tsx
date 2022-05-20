import { Box, Divider, Drawer, Toolbar, Typography } from '@mui/material';
import useSWR from 'swr';
import useWebSocket from 'react-use-websocket';
import { useEffect } from 'react';
import camelcaseKeys from 'camelcase-keys';
import { Combat, isCombatMsg } from '../../types/combat';
import ScrollBar from '../util/ScrollBar';
import CombatViewHeader from './CombatViewHeader';
import CombatControlPanel from './ControlPanel';
import TokenList from './TokenList';
import ConnectionBox from './ControlPanel/ConnectionBox';

export interface CombatViewProps {
  combatID?: string;
}

const minWidth = 400;

const CombatView = ({ combatID }: CombatViewProps) => {
  const { data: combat, mutate, error } = useSWR<Combat>(combatID ? `/combats/${combatID}` : null, {
    revalidateOnFocus: false,
  });
  const {
    lastJsonMessage,
    readyState,
  } = useWebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/combats/${combat?.id}`, {
    shouldReconnect: () => !!(combat && combat?.state !== 'ended'),
    reconnectInterval: 1000,
    reconnectAttempts: 10,
  }, !!(combat && combat?.state !== 'ended'));

  useEffect(() => {
    const msg = camelcaseKeys(lastJsonMessage, { deep: true });
    if (isCombatMsg(msg)) {
      mutate(msg.combat, {
        revalidate: false,
      }).catch();
    }
  }, [lastJsonMessage, mutate]);

  if (!combat || error) {
    return null;
  }

  return (
    <Drawer
      sx={{
        width: minWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: minWidth,
          boxSizing: 'border-box',
        },
        overflow: 'hidden',
      }}
      variant="permanent"
      anchor="right"
    >
      <Toolbar>
        <CombatViewHeader combat={combat} />
      </Toolbar>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6">
            行动列表
          </Typography>
          {combat.state !== 'ended' && (
            <ConnectionBox state={readyState} />
          )}
        </Box>
        <CombatControlPanel combat={combat} mutate={mutate} />
      </Box>
      <ScrollBar style={{ height: '100%' }}>
        <TokenList combat={combat} mutate={mutate} />
      </ScrollBar>
    </Drawer>
  );
};
export default CombatView;
