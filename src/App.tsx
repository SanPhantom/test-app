import "./App.css";

import { useBoolean, useLockFn } from "ahooks";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-virtualized/styles.css";
import PageContainer from "./components/PageContainer";
import TestList from "./pages/TestList";
import { ItemType, createNewList, generateList } from "./utils/item";
import { Stack, Typography } from "@mui/material";
import { AutoSizer, List } from "react-virtualized";

function App() {
  const [list, setList] = useState<ItemType[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);

  const [loading, { setTrue: startLoading, setFalse: closeLoading }] =
    useBoolean(false);

  useEffect(() => {
    const currentList = createNewList(20);
    setList(currentList);
  }, []);

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", () => {
      const cScrollTop = scrollRef.current?.scrollTop ?? 0;
      const cOffsetHeight = containerRef.current?.offsetTop ?? 0;

      setScrollTop(cScrollTop - cOffsetHeight);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      console.log({ scrollHeight: scrollRef.current?.clientHeight });
      console.log({ containerHeight: containerRef.current?.clientHeight });
    }, 1000);
  }, []);

  return (
    <PageContainer ref={scrollRef}>
      <Stack sx={{ height: "100%", width: "100%" }}>
        <Stack
          sx={{ height: 128, alignItems: "center", justifyContent: "center" }}
        >
          <Typography>Masonry List</Typography>
        </Stack>
        <Stack ref={containerRef} sx={{ flex: 1, minHeight: 0 }}>
          <Typography>456</Typography>
          <AutoSizer>
            {({ width, height }) => {
              return (
                <Stack>
                  <List
                    autoHeight
                    width={width}
                    height={height + (containerRef.current?.offsetTop ?? 0)}
                    rowCount={list.length}
                    rowHeight={56}
                    scrollTop={scrollTop}
                    rowRenderer={({
                      index,
                      columnIndex,
                      style,
                      key,
                      isVisible,
                      isScrolling,
                    }) => {
                      const item = list[index];
                      return (
                        <Stack style={{ ...style }} key={key} border={1} mt={1}>
                          <Typography>{index}</Typography>
                          <Typography>{item.title}</Typography>
                        </Stack>
                      );
                    }}
                  />
                </Stack>
              );
            }}
          </AutoSizer>
        </Stack>
      </Stack>
    </PageContainer>
  );
}

export default App;
