import { List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import { Link as LinkIcon, Person as PersonIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export interface menuItemProps {
  to: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const MenuItem = ({ children, to, style }: menuItemProps) => {
  const router = useRouter();
  return (
    <NextLink href={to}>
      <ListItem
        button
        selected={router.pathname === to}
        style={style}
      >
        {children}
      </ListItem>
    </NextLink>
  );
};

const MySettingsList = () => {
  useEffect(() => {
  });
  return (
    <Paper>
      <List>
        <MenuItem to="/settings/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>
            个人资料
          </ListItemText>
        </MenuItem>
        <MenuItem to="/settings/security" style={{ display: 'none' }}>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText>
            帐号与安全
          </ListItemText>
        </MenuItem>
        <MenuItem to="/settings/external">
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText>
            外部帐号
          </ListItemText>
        </MenuItem>
      </List>
    </Paper>
  );
};

export default MySettingsList;
