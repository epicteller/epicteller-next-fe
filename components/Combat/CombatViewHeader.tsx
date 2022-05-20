import { GiCrossedSwords, GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { Avatar, Box, Typography } from '@mui/material';
import { FaCross } from 'react-icons/fa';
import { Combat, CombatState } from '../../types/combat';

export interface combatViewHeaderProp {
  combat: Combat;
}

interface stateViewConfig {
  icon: JSX.Element;
  iconSize?: number;
  iconColor?: string;
  iconBGColor?: string;
  title: string;
  headline?: string;

}

const stateConfigMap: { [k in CombatState]: stateViewConfig } = {
  initiating: {
    icon: <GiDiceTwentyFacesTwenty />,
    iconBGColor: 'warning.dark',
    title: '先攻阶段',
    headline: '决定行动顺序',
  },
  running: {
    icon: <GiCrossedSwords />,
    iconBGColor: 'error.dark',
    iconSize: 24,
    title: '行动阶段',
  },
  ended: {
    icon: <FaCross />,
    iconBGColor: 'success.dark',
    title: '战斗结束',
    headline: '胜利了吗？',
  },
};

const CombatViewHeader = ({ combat }: combatViewHeaderProp) => {
  const { icon, iconSize, iconColor, iconBGColor, title, headline } = stateConfigMap[combat.state];
  const { roundCount } = combat.order;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
      <Avatar sx={{ fontSize: iconSize ?? 28, bgcolor: iconBGColor, color: iconColor }}>
        {icon}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', pl: 2 }}>
        <Typography variant="body1">{title}</Typography>
        <Typography variant="subtitle2">
          {combat.state === 'running' ? `第 ${roundCount} 轮` : headline}
        </Typography>
      </Box>
    </Box>
  );
};

export default CombatViewHeader;
