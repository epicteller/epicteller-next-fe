import { Tooltip, Typography, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useInterval } from 'react-use';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';

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

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    chip: {
      margin: theme.spacing(0, 0.5),
    },
  };
});
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

const TimeChip = ({ timestamp, textType = 'relative' }: PropTypes) => {
  const datetime = DateTime.fromSeconds(timestamp).setLocale('zh-CN');
  const [timeOffset, setTimeOffset] = useState(datetime.toRelative());
  const classes = useStyles();
  const delta = Math.abs(DateTime.now().toSeconds() - timestamp);
  const sameYear = DateTime.now().year === datetime.year;

  useInterval(() => {
    setTimeOffset(datetime.toRelative());
  }, _.includes(['relative', 'relativeOrDate'], textType) ? getInterval(timestamp) : null);

  let timeText = '';
  switch (textType) {
    case 'relative': {
      timeText = timeOffset ?? '';
      break;
    }
    case 'datetime': {
      if (sameYear) {
        timeText = datetime.toFormat('MM/dd HH:mm');
      } else {
        timeText = datetime.toFormat('yyyy/MM/dd HH:mm');
      }
      break;
    }
    case 'date': {
      if (sameYear) {
        timeText = datetime.toFormat('MM/dd');
      } else {
        timeText = datetime.toFormat('yyyy/MM/dd');
      }
      break;
    }
    case 'time': {
      timeText = datetime.toFormat('HH:mm');
      break;
    }
    case 'timeWithSecond': {
      timeText = datetime.toFormat('HH:mm:ss');
      break;
    }
    case 'relativeOrDate': {
      if (delta < 7 * 86400) {
        timeText = timeOffset ?? '';
      } else if (sameYear) {
        timeText = datetime.toFormat('MM/dd');
      } else {
        timeText = datetime.toFormat('yyyy/MM/dd');
      }
      break;
    }
    default: {
      timeText = timeOffset ?? '';
    }
  }

  return (
    <Tooltip title={datetime.toFormat('yyyy/MM/dd HH:mm:ss')}>
      <Typography component="span" className={classes.chip} variant="inherit">
        {timeText}
      </Typography>
    </Tooltip>

  );
};
export default TimeChip;
