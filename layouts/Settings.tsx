import { ReactElement } from 'react';
import { Grid, Typography } from '@mui/material';
import { LayoutProps } from '../types/layout';
import BasicLayout from './Basic';
import MySettingsList from '../components/Settings/MySettingsList';

const SettingsLayout = ({ children }: LayoutProps): ReactElement => (
  <BasicLayout>
    <>
      <Typography variant="h4" gutterBottom>设置</Typography>
      <Grid item xs={12} sm={12} md={3}>
        <MySettingsList />
      </Grid>
      <Grid item xs={12} sm={12} md={9}>{children}</Grid>
    </>
  </BasicLayout>
);

export default SettingsLayout;
