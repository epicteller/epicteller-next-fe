import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { ProviderProps } from '../types/provider';

const ThemeProvider: React.FunctionComponent = ({ children }: ProviderProps) => {
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: 'dark',
      },
      typography: {
        fontFamily: [
          'Helvetica',
          'Tahoma',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Heiti SC',
          'Microsoft YaHei',
          'WenQuanYi Micro Hei',
        ].join(','),
      },
    }),
    [],
  );
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
