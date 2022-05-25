import { makeStyles } from '@mui/styles';
import {
  AppBar,
  Avatar,
  Button,
  ButtonBase,
  Container,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import {
  DoubleArrow as DoubleArrowIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';
import Popper from '@mui/material/Popper';
import { useMount } from 'react-use';
import useMe from '../hooks/me';
import epAPI from '../lib/api';

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    appBar: {
      paddingTop: 'env(safe-area-inset-top)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    },
    memberChip: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
    menu: {
      marginTop: theme.spacing(3),
    },
    popper: {
      zIndex: 1300,
    },
  };
});

export interface NavBarProps {
  title?: string;
}

const NavBar = ({ title = 'Epicteller' }: NavBarProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { me, mutate } = useMe();
  const chipRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useMount(() => setMounted(true));

  const handleMenuOpen = () => {
    setOpen(true);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  const logout = async () => {
    try {
      await epAPI.post('/logout');
    } catch (e) {
      // ignore
    } finally {
      await mutate();
      await router.push({ pathname: '/' });
    }
  };

  return (
    <>
      <AppBar className={classes.appBar} position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <NextLink href="/">
              <IconButton edge="start" color="inherit">
                <DoubleArrowIcon />
              </IconButton>
            </NextLink>
            <Typography className={classes.title} variant="h6">{title}</Typography>
            {mounted && me ? (
              <ButtonBase
                ref={chipRef}
                color="inherit"
                className={classes.memberChip}
                onClick={handleMenuOpen}
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
              >
                <Avatar className={classes.avatar} src={me?.avatar}>{me?.name[0]}</Avatar>
                <Typography variant="subtitle1">{me?.name}</Typography>
              </ButtonBase>
            ) : (
              <NextLink href="/signin"><Button>登录</Button></NextLink>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Popper
        onMouseEnter={handleMenuOpen}
        onMouseLeave={handleMenuClose}
        className={classes.popper}
        open={open}
        anchorEl={chipRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
          >
            <Paper className={classes.menu} elevation={6}>
              <MenuList>
                <NextLink href="/settings/profile">
                  <MenuItem>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    设置
                  </MenuItem>
                </NextLink>
                <MenuItem component={ButtonBase} onClick={logout}>
                  <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                  退出登录
                </MenuItem>
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Toolbar />
    </>
  );
};

export default NavBar;
