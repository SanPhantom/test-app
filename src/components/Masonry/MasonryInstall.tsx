import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material";
import {
  PropsWithChildren,
  ReactElement,
  cloneElement,
  useCallback,
} from "react";
import { WindowScroller, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";

export interface ChildrenProps {
  height?: number;
  width?: number;
  scrollTop?: number;
}

interface PageContainerProps {
  onScrollBottom?: () => void;
  children: (prop: ChildrenProps) => React.ReactNode;
}

const PageContainer = (props: PageContainerProps) => {
  const { onScrollBottom, children } = props;

  const handleScroll = useCallback((params: { scrollTop: any }) => {
    const { scrollTop } = params;
    const clientHeight = window.screen.height;
    const scrollHeight = document.querySelector("body")?.scrollHeight ?? 0;

    if (scrollTop + clientHeight >= scrollHeight) {
      onScrollBottom?.();
    }
  }, []);

  return (
    <WindowScroller onScroll={handleScroll}>
      {({ height, scrollTop }) => (
        <AutoSizer
          disableHeight
          height={height}
          overscanByPixels={0}
          scrollTop={scrollTop}
        >
          {({ width }) => children({ width, height, scrollTop })}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export default PageContainer;
