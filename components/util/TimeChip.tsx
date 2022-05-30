import { Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';

export type TextType = 'relative' |
  'relativeOrDate' |
  'datetime' |
  'date' |
  'time' |
  'timeWithSecond';

export interface PropTypes {
  timestamp: number
  textType?: TextType
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getInterval = (timestamp: number): number | null => {
  const now = Date.now() / 1000;
  const offset = Math.abs(now - timestamp);
  if (offset < 60) {
    return 1000;
  }
  if (offset < 86400) {
    return 60 * 1000;
  }
  return null;
};

const getTimeText = (datetime: DateTime, textType: TextType): string => {
  const timeOffset = datetime.toRelative();
  const delta = Math.abs(DateTime.now().toSeconds() - datetime.toSeconds());
  const sameYear = DateTime.now().year === datetime.year;
  switch (textType) {
    case 'relative': {
      return timeOffset ?? '';
    }
    case 'datetime': {
      if (sameYear) {
        return datetime.toFormat('MM/dd HH:mm');
      }
      return datetime.toFormat('yyyy/MM/dd HH:mm');
    }
    case 'date': {
      if (sameYear) {
        return datetime.toFormat('MM/dd');
      }
      return datetime.toFormat('yyyy/MM/dd');
    }
    case 'time': {
      return datetime.toFormat('HH:mm');
    }
    case 'timeWithSecond': {
      return datetime.toFormat('HH:mm:ss');
    }
    case 'relativeOrDate': {
      if (delta < 7 * 86400) {
        return timeOffset ?? '';
      }
      if (sameYear) {
        return datetime.toFormat('MM/dd');
      }
      return datetime.toFormat('yyyy/MM/dd');
    }
    default: {
      return timeOffset ?? '';
    }
  }
};

const TimeChip = ({ timestamp, textType = 'relative' }: PropTypes) => {
  const datetime = useMemo(() => DateTime.fromSeconds(timestamp).setLocale('zh-CN'), [timestamp]);
  const timeText = useMemo(() => getTimeText(datetime, textType), [datetime, textType]);

  return (
    <Tooltip title={datetime.toFormat('yyyy/MM/dd HH:mm:ss')}>
      <Typography component="span" sx={{ px: 0.5 }} variant="inherit">
        {timeText}
      </Typography>
    </Tooltip>

  );
};
export default TimeChip;
