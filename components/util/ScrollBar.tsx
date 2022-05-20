import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React from 'react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react/dist/types/OverlayScrollbarsComponent';

const ScrollBar = ({ children, ...props }: OverlayScrollbarsComponentProps) => (
  <OverlayScrollbarsComponent
    className="os-theme-light"
    options={{
      scrollbars: {
        autoHide: 'leave',
      },
      updateOnLoad: null,
    }}
    {...props}
  >
    {children}
  </OverlayScrollbarsComponent>
);
export default ScrollBar;
