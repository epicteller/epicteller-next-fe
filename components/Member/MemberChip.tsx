import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

export interface Human {
  name: string
  avatar?: string
}

export interface PropTypes {
  human: Human
}

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      margin: theme.spacing(0, 0.5),
    },
    avatar: {
      width: theme.spacing(2),
      height: theme.spacing(2),
      marginRight: theme.spacing(0.5),
    },
  };
});

const MemberChip = ({ human }: PropTypes) => {
  const classes = useStyles();
  return (
    <Box className={classes.chip} component="span">
      <Avatar className={classes.avatar} component="span" src={human.avatar}>
        <Typography variant="body2" color="textSecondary">
          {human.name[0]}
        </Typography>
      </Avatar>
      <Typography variant="inherit">{human.name}</Typography>
    </Box>
  );
};

export default MemberChip;
