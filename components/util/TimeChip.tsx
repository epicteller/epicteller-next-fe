import { Tooltip, Typography, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useInterval } from 'react-use';
import { makeStyles } from '@mui/styles';

export interface PropTypes {
  timestamp: number
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
  if (offset < 30 * 86400) {
    return 3600 * 1000;
  }
  return null;
};

const TimeChip = ({ timestamp }: PropTypes) => {
  const datetime = DateTime.fromSeconds(timestamp).setLocale('zh-CN');
  const [timeOffset, setTimeOffset] = useState(datetime.toRelative());
  const classes = useStyles();

  useInterval(() => {
    setTimeOffset(datetime.toRelative());
  }, getInterval(timestamp));

  return (
    <Tooltip arrow title={datetime.toLocaleString({ ...DateTime.DATETIME_MED, hour12: false })}>
      <Typography className={classes.chip} variant="inherit">
        {timeOffset}
      </Typography>
    </Tooltip>

  );
};

export default TimeChip;
