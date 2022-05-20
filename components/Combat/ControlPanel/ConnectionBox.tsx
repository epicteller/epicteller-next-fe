import { ReadyState } from 'react-use-websocket';
import { Box, Tooltip } from '@mui/material';
import SignalWifiBadIcon from '@mui/icons-material/SignalWifiBad';
import NetworkWifi1BarIcon from '@mui/icons-material/NetworkWifi1Bar';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';

export interface ConnectionBoxProps {
  state: ReadyState
}

const stateStyleConfigMap: { [key in ReadyState]: JSX.Element | null } = {
  [ReadyState.UNINSTANTIATED]: null,
  [ReadyState.CLOSED]: (
    <Tooltip title="未连接">
      <SignalWifiBadIcon sx={{ color: 'error.main' }} />
    </Tooltip>
  ),
  [ReadyState.CONNECTING]: (
    <Tooltip title="连接中">
      <NetworkWifi1BarIcon sx={{ color: 'warning.main' }} />
    </Tooltip>
  ),
  [ReadyState.OPEN]: (
    <Tooltip title="已连接">
      <NetworkWifiIcon sx={{ color: 'success.main' }} />
    </Tooltip>
  ),
  [ReadyState.CLOSING]: (
    <Tooltip title="关闭连接中">
      <NetworkWifi1BarIcon sx={{ color: 'warning.main' }} />
    </Tooltip>
  ),
};

const ConnectionBox = ({ state }: ConnectionBoxProps) => (
  <Box component="span" sx={{ pt: 1, px: 1 }}>
    {stateStyleConfigMap[state]}
  </Box>
);

export default ConnectionBox;
