import { makeStyles } from '@mui/styles';
import { Grid, Paper, useTheme } from '@mui/material';
import { ReactElement } from 'react';
import { LayoutProps } from '../types/layout';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    root: {
      height: '100vh',
      backgroundImage: 'url(/background.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      height: '100vh',
      padding: theme.spacing(0, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      backdropFilter: 'blur(10px) brightness(0.5)',
      backgroundImage: 'unset',
    },
  };
});

const SignInLayout = ({ children }: LayoutProps): ReactElement => {
  const classes = useStyles();
  return (
    <Grid
      container
      component="main"
      direction="row-reverse"
      justifyContent="space-between"
      alignItems="center"
      className={classes.root}
    >
      <Grid className={classes.paper} item xs={12} md={5} lg={4} xl={3} component={Paper} elevation={12} square>
        {children}
      </Grid>
    </Grid>
  );
};

export default SignInLayout;
