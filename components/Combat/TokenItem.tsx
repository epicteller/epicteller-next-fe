import { KeyedMutator } from 'swr';
import { Avatar, Box, Grow, IconButton, ListItemButton, Menu, MenuItem, Typography } from '@mui/material';
import stc from 'string-to-color';
import { Draggable } from 'react-beautiful-dnd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import React, { forwardRef, useState } from 'react';
import { AxiosError } from 'axios';
import useNotifier from '../../hooks/notifier';
import { Combat, CombatToken } from '../../types/combat';
import epAPI from '../../lib/api';
import { EpictellerError } from '../../types/errors/validation';

export interface TokenItemProps {
  combat?: Combat
  mutate?: KeyedMutator<Combat>
  token: CombatToken
  index: number
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {}),
});

// eslint-disable-next-line react/display-name,@typescript-eslint/no-unused-vars
const DraggableComponent = (id: string, index: number, isDraggable: boolean) => forwardRef((props: any, ref: any) => (
  <Draggable draggableId={id} index={index} isDragDisabled={!isDraggable}>
    {(provided, snapshot) => (
      <ListItemButton
        ref={provided.innerRef}
        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.draggableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...provided.dragHandleProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.children}
      </ListItemButton>
    )}
  </Draggable>
));

const initialMousePos: { mouseX?: number, mouseY?: number } = {};

const TokenItem = ({ combat, mutate, token, index }: TokenItemProps) => {
  const { notifyError } = useNotifier();
  const [mousePos, setMousePos] = useState(initialMousePos);

  if (!combat) {
    return null;
  }

  const { name } = token;
  const selected = combat?.order.currentToken?.name === name;

  const clickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMousePos({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const closeMenu = () => {
    setMousePos({});
  };

  const removeToken = () => {
    const newOrder = combat.order.order.filter((item) => token !== item);
    if (mutate) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.delete<Combat>(`/combats/${combat.id}/tokens/${token.name}`);
          return response.data;
        } catch (e) {
          notifyError((e as AxiosError<EpictellerError>).response?.data?.message);
          throw e;
        }
      }, {
        optimisticData: {
          ...combat,
          order: {
            ...combat.order,
            order: newOrder,
          },
        },
        revalidate: false,
      }).catch();
    }
    closeMenu();
  };

  const setCurrentToken = () => {
    if (mutate) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.put<Combat>(`/combats/${combat.id}`, {
            action: 'set_current',
            currentToken: token.name,
          });
          return response.data;
        } catch (e) {
          notifyError((e as AxiosError<EpictellerError>).response?.data?.message);
          throw e;
        }
      }, {
        optimisticData: {
          ...combat,
          order: {
            ...combat.order,
            currentToken: token,
          },
        },
        revalidate: false,
      }).catch();
    }
    closeMenu();
  };

  return (
    <ListItemButton
      disableRipple
      disableTouchRipple
      sx={{
        display: 'flex',
        flex: 'auto',
        '& > *:nth-of-type(1)': {
          mr: 2,
        },
        '& > *:nth-of-type(2)': {
          flex: 'auto',
        },
      }}
      alignItems="center"
      selected={selected}
      component={DraggableComponent(name, index, combat.state === 'running')}
    >
      <Avatar
        sx={{
          bgcolor: stc(name),
          mr: 2,
          display: 'flex',
        }}
        src={token.character?.avatar}
      >
        {name[0]}
      </Avatar>
      <Box sx={{ pt: 0.2 }}>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {`先攻值: ${token.initiative}`}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {(!selected && combat.state !== 'ended') && (
          <IconButton onClick={clickMenu}><MoreVertIcon fontSize="small" /></IconButton>
        )}
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={
            (mousePos.mouseY && mousePos.mouseX)
              ? { top: mousePos.mouseY, left: mousePos.mouseX }
              : undefined
          }
          keepMounted
          open={!!mousePos.mouseY}
          onClose={closeMenu}
          TransitionComponent={Grow}
        >
          <MenuItem dense onClick={removeToken}>
            <DeleteIcon fontSize="small" />
            移除
          </MenuItem>
          {combat.state === 'running' && (
            <MenuItem dense onClick={setCurrentToken}>
              <DoubleArrowIcon fontSize="small" />
              设为行动者
            </MenuItem>
          )}
        </Menu>
      </Box>
    </ListItemButton>
  );
};

export default TokenItem;
