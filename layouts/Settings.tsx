import { ReactElement } from 'react';
import { Grid, Typography } from '@mui/material';
import { LayoutProps } from '../types/layout';
import BasicLayout from './Basic';
import MySettingsList from '../components/Settings/MySettingsList';
import Title from '../components/util/Title';

const SettingsLayout = ({ children }: LayoutProps): ReactElement => (
  <BasicLayout>
    <>
      <Title title="设置" />
      <Typography variant="h4" gutterBottom>设置</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={3}>
          <MySettingsList />
        </Grid>
        <Grid item xs={12} sm={12} md={9}>{children}</Grid>
      </Grid>
    </>
  </BasicLayout>
);

export default SettingsLayout;
