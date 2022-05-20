import { Container, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactElement } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { LayoutProps } from '../types/layout';
import NavBar from '../components/NavBar';
import 'overlayscrollbars/css/OverlayScrollbars.css';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    container: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
  };
});

const BasicLayout = ({ children }: LayoutProps): ReactElement => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <OverlayScrollbarsComponent
        className="os-theme-light"
        options={{
          updateOnLoad: null,
        }}
      >
        <Container className={classes.container} maxWidth="lg">
          {children}
        </Container>
      </OverlayScrollbarsComponent>
    </>
  );
};

export default BasicLayout;
