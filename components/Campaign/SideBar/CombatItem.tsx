import { ListItemButton, ListItemText } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useRouter } from 'next/router';
import { Combat } from '../../../types/combat';

export interface CombatItemProps {
  combat: Combat
}

const CombatItem = ({ combat }: CombatItemProps) => {
  const router = useRouter();
  const currentCombatID = router.query?.combatID as string | undefined;

  const switchCombat = async () => {
    if (combat.id === currentCombatID) {
      return;
    }
    await router.push({ query: { ...router.query, combat: combat.id } });
  };

  return (
    <ListItemButton
      sx={{ pl: 4 }}
      selected={combat.id === currentCombatID}
      onClick={switchCombat}
    >
      <DoubleArrowIcon sx={{ mr: 1 }} />
      <ListItemText
        primaryTypographyProps={{
          noWrap: true,
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        primary="进行中"
      />
    </ListItemButton>
  );
};

export default CombatItem;
