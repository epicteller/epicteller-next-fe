import { Paper, Typography, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { ReactElement, ReactNode } from 'react';
import useMe from '../../hooks/me';
import SettingsLayout from '../../layouts/Settings';
import { NextPageWithLayout } from '../../types/layout';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    paper: {
      padding: theme.spacing(2, 3, 4, 3),
    },
  };
});

const SecuritySettingsPage: NextPageWithLayout = () => {
  const classes = useStyles();
  const { me } = useMe();
  return (
    <Paper className={classes.paper}>
      <Typography variant="h5">帐号与安全</Typography>
      <Typography>{me?.name}</Typography>
    </Paper>
  );
};

SecuritySettingsPage.getLayout = (page: ReactElement): ReactNode => (
  <SettingsLayout>{page}</SettingsLayout>
);

export default SecuritySettingsPage;
