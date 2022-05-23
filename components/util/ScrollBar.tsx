import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React, { forwardRef } from 'react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react/dist/types/OverlayScrollbarsComponent';

const ScrollBar = forwardRef<OverlayScrollbarsComponent, OverlayScrollbarsComponentProps>((props, ref) => (
  <OverlayScrollbarsComponent
    ref={ref}
    className="os-theme-light"
    options={{
      scrollbars: {
        autoHide: 'leave',
      },
      updateOnLoad: null,
    }}
    {...props}
  >
    {props.children}
  </OverlayScrollbarsComponent>
));
ScrollBar.displayName = 'ScrollBar';

export default ScrollBar;
