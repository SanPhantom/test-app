import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import { PropsWithChildren, Ref, forwardRef, useEffect, useRef } from "react";
import "react-virtualized/styles.css";
import VConsole from "vconsole";

export interface ChildrenProps {
  height?: number;
  width?: number;
  scrollTop?: number;
}

interface PageContainerProps extends PropsWithChildren {}

const PageContainer = (props: PageContainerProps, ref: Ref<HTMLDivElement>) => {
  const { children } = props;
  // or init with options
  const vConsole = new VConsole({ theme: "dark" });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // const topRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log({ bodyHeight: document.body.clientHeight });
  //     console.log({ height: pageRef.current?.clientHeight });
  //   }, 1000);
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      console.log({
        rootHeight: document.getElementById("root")?.clientHeight,
      });
      console.log({ bodyHeight: document.body.clientHeight });
      console.log({ wrapperHeight: wrapperRef.current?.clientHeight });
      console.log({ topHeight: topRef.current?.clientHeight });
    }, 1000);
  }, []);

  return (
    <Stack
      ref={wrapperRef}
      sx={{
        height: "100%",
        width: "100%",
        gap: 1,
        pb: 8,
      }}
    >
      <Stack
        sx={{
          height: 64,
          width: "100vw",
          zIndex: 99,
          background: "cyan",
          position: "fixed",
          bottom: 0,
          left: 0,
        }}
      />
      <Box ref={topRef} className="page-container">
        <Stack
          ref={ref}
          sx={{ height: "100%", overflow: "auto", position: "relative" }}
        >
          <AppBar>
            <Toolbar>
              <Typography>MMMMMMMM</Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Stack sx={{ flex: "1 1 auto", minHeight: 0, width: "100vw" }}>
            {children}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default forwardRef(PageContainer);
