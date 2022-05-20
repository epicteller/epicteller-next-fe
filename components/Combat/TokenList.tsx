import { Box, List, Typography } from '@mui/material';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import HistoryIcon from '@mui/icons-material/History';
import { KeyedMutator } from 'swr';
import _ from 'lodash';
import { AxiosError } from 'axios';
import TokenItem from './TokenItem';
import { Combat } from '../../types/combat';
import epAPI from '../../lib/api';
import { EpictellerError } from '../../types/errors/validation';
import useNotifier from '../../hooks/notifier';

export interface TokenListProps {
  combat?: Combat
  mutate?: KeyedMutator<Combat>
}

const DroppableComponent = (
  onDragEnd: (result: any, provided: any) => void,
  // eslint-disable-next-line react/display-name
) => (props: any) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="1" direction="vertical">
      {(provided) => (
        <List ref={provided.innerRef} {...provided.droppableProps} {...props}>
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {props.children}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </DragDropContext>
);

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const TokenList = ({ combat, mutate }: TokenListProps) => {
  const { notifyError } = useNotifier();

  if (!combat) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newOrder = reorder(combat.order.order, result.source.index, result.destination.index);

    const currentOrderNames = combat.order.order.map((item) => item.name);
    const newOrderNames = newOrder.map((item) => item.name);

    if (_.isEqual(currentOrderNames, newOrderNames)) {
      return;
    }

    if (mutate) {
      mutate(async (): Promise<Combat> => {
        try {
          const response = await epAPI.put<Combat>(`/combats/${combat.id}`, {
            action: 'reorder',
            tokens: newOrderNames,
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
            order: newOrder,
          },
        },
        revalidate: false,
      }).catch();
    }
  };

  if (combat.order.order.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
      }}
      >
        <HistoryIcon fontSize="large" />
        <Typography>等待先攻中</Typography>
      </Box>
    );
  }

  return (
    <List component={DroppableComponent(onDragEnd)}>
      {combat.order.order.map((token, index) => (
        <TokenItem key={token.name} combat={combat} mutate={mutate} token={token} index={index} />
      ))}
    </List>
  );
};

export default TokenList;
