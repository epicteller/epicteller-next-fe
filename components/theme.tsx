import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import React, { useMemo } from 'react';

export interface ProviderProps {
  children?: React.ReactNode
}

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
