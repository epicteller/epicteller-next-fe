import { Container } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { ReactElement } from 'react';
import { LayoutProps } from '../../types/layout';
import NavBar from '../NavBar';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    container: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
  };
});

const SimpleLayout = ({ children }: LayoutProps): ReactElement => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <Container className={classes.container} maxWidth="lg">
        {children}
      </Container>
    </>
  );
};

export default SimpleLayout;
