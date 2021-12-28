import { makeStyles } from '@mui/styles';
import {
  AppBar,
  Avatar,
  Button,
  ButtonBase,
  ClickAwayListener,
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
    appBarSpacer: {
      ...theme.mixins.toolbar,
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = !!anchorEl;

  const handleMenuOpen = () => {
    setAnchorEl(chipRef.current);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    await epAPI.post('/logout');
    await mutate();
    await router.push({ pathname: '/' });
  };

  return (
    <>
      <AppBar className={classes.appBar} position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton edge="start" color="inherit" component={NextLink} href="/">
              <DoubleArrowIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6">{title}</Typography>
            {me ? (
              <ButtonBase
                ref={chipRef}
                className={classes.memberChip}
                onClick={handleMenuOpen}
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
              >
                <Avatar className={classes.avatar} src={me?.avatar}>{me?.name[0]}</Avatar>
                <Typography variant="subtitle1">{me?.name}</Typography>
              </ButtonBase>
            ) : (
              <Button component={NextLink} href="/">登录</Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Popper
        onMouseEnter={handleMenuOpen}
        onMouseLeave={handleMenuClose}
        className={classes.popper}
        open={open}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper className={classes.menu} elevation={6}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList>
                  <MenuItem component={NextLink} href="/settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    设置
                  </MenuItem>
                  <MenuItem component={ButtonBase} onClick={logout}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    退出登录
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}

      </Popper>

      <div className={classes.appBarSpacer} />
    </>
  );
};

export default NavBar;
