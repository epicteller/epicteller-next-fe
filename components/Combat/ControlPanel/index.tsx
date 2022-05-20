import { KeyedMutator } from 'swr';
import { ButtonGroup } from '@mui/material';
import { Combat } from '../../../types/combat';
import RunCombatButton from './RunCombatButton';
import AddTokenButton from './AddTokenButton';
import NextTokenButton from './NextTokenButton';
import StopCombatButton from './StopCombatButton';

export interface CombatControlPanelProps {
  combat?: Combat;
  mutate?: KeyedMutator<Combat>;
}

const CombatControlPanel = ({ combat, mutate }: CombatControlPanelProps) => (
  <ButtonGroup>
    <RunCombatButton combat={combat} mutate={mutate} />
    <StopCombatButton combat={combat} mutate={mutate} />
    <AddTokenButton combat={combat} mutate={mutate} />
    <NextTokenButton combat={combat} mutate={mutate} />
  </ButtonGroup>
);

export default CombatControlPanel;
