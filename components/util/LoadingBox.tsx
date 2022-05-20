import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';

export interface loadingBoxProps {
  isLoading?: boolean
  isError?: boolean
  retryFunc?: () => void
  children: any
}

const BoxLoading = (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, p: 3, height: '100%' }}>
    <CircularProgress />
  </Box>
);

const BoxFailed = ({ retryFunc }: { retryFunc: () => void }) => (
  <Grid
    sx={{ mt: 2 }}
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={1}
  >
    <Grid item>
      <Typography variant="h2">😰</Typography>
    </Grid>
    <Grid item>
      <Typography variant="h6">
        加载失败
      </Typography>
    </Grid>
    <Grid item>
      <Button variant="contained" size="small" onClick={retryFunc}>重试</Button>
    </Grid>
  </Grid>
);

const LoadingBox = ({
  isLoading,
  isError,
  retryFunc = () => undefined,
  children,
}: loadingBoxProps): ReactElement => {
  if (isLoading) {
    return BoxLoading;
  }
  if (isError) {
    return <BoxFailed retryFunc={retryFunc} />;
  }
  return children;
};

export default LoadingBox;
