import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React, { useMemo } from 'react';
import { ProviderProps } from '../types/provider';

const ThemeProvider: React.FunctionComponent = ({ children }: ProviderProps) => {
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: 'dark',
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
