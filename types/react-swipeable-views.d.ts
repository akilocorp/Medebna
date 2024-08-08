declare module 'react-swipeable-views' {
    import * as React from 'react';
  
    export interface SwipeableViewsProps {
      index?: number;
      onChangeIndex?: (index: number, indexLatest: number, meta: { source: string }) => void;
      children?: React.ReactNode;
      axis?: 'x' | 'x-reverse' | 'y' | 'y-reverse';
      containerStyle?: React.CSSProperties;
      disableLazyLoading?: boolean;
      enableMouseEvents?: boolean;
      hysteresis?: number;
      ignoreNativeScroll?: boolean;
      onSwitching?: (index: number, type: 'move' | 'end') => void;
      resistance?: boolean;
      springConfig?: { duration: string; easeFunction: string; delay: string };
      slideStyle?: React.CSSProperties;
      springConfig?: { duration: string; easeFunction: string; delay: string };
      style?: React.CSSProperties;
    }
  
    const SwipeableViews: React.ComponentType<SwipeableViewsProps>;
  
    export default SwipeableViews;
  }
  