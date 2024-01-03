import { Grid, Box, Stack } from "@mui/material";
import { clone, any, isNil } from "ramda";
import {
  PropsWithChildren,
  createRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

interface WaterfallProps<T = unknown> {
  list: T[];
  cols?: number;
  spacing?: number;
  itemRender: (idx: number, record: T) => React.ReactNode;
}

const WaterfallItem = forwardRef<number, PropsWithChildren & { width: number }>(
  ({ children, width }, ref) => {
    const itemRef = useRef<HTMLDivElement>(null);

    const [height, setHeight] = useState(0);

    useImperativeHandle(
      ref,
      () => {
        return height;
      },
      [height]
    );

    useEffect(() => {
      const size = itemRef.current?.getBoundingClientRect();
      setHeight(size?.height ?? 0);
    }, []);

    return (
      <Box ref={itemRef} sx={{ mt: 1, width: width }}>
        {children}
      </Box>
    );
  }
);

const Waterfall = memo(
  <T extends Record<string, any>>(props: WaterfallProps<T>) => {
    const { list, cols = 3, spacing = 2, itemRender } = props;

    const waterfallRef = useRef<HTMLDivElement>(null);

    const [gridData, setGridData] = useState<JSX.Element[][]>([]);

    const heightsRef = new Array(list.length)
      .fill(0)
      .map(() => createRef<number>());

    const colWidth = useMemo(() => {
      const size = waterfallRef.current?.getBoundingClientRect();
      const width = ((size?.width ?? 0) - cols * (spacing * 8)) / cols;
      return width;
    }, [cols, spacing]);

    const itemDrivers = useMemo(
      () =>
        list.map((item, index) => {
          return (
            <WaterfallItem
              key={`key_item_${index}`}
              ref={heightsRef[index]}
              width={colWidth}
            >
              {itemRender(index, item)}
            </WaterfallItem>
          );
        }),
      [list]
    );

    const initGridItems = useCallback(() => {
      const gridData: JSX.Element[][] = new Array(cols).fill(0).map(() => []);
      const heights: number[] = new Array(cols).fill(0);

      itemDrivers.map((item, idx) => {
        const currentHeight = heightsRef[idx].current ?? 0;

        console.log({ currentHeight, heightsRef });

        const minHeightLine = heights.findIndex(
          (x) => x === Math.min(...heights)
        );

        gridData[minHeightLine].push(item);
        heights[minHeightLine] += currentHeight;
      });

      return gridData;
    }, [list, cols]);

    useEffect(() => {
      const timer = setInterval(() => {
        if (any((x) => !isNil(x.current) && x.current !== 0, heightsRef)) {
          setGridData(initGridItems());
          clearInterval(timer);
        }
      }, 20);
    }, [itemDrivers]);

    return (
      <Stack sx={{ width: "100%" }}>
        <div style={{ height: 0, overflow: "hidden" }}>{itemDrivers}</div>
        <Grid
          className="waterfall-container"
          container
          ref={waterfallRef}
          spacing={spacing}
        >
          {gridData.map((colItem, colIdx) => (
            <Grid
              item
              key={`flow_${clone(colIdx)}`}
              sx={{ width: colWidth }}
              xs={12 / cols}
            >
              {colItem?.map((item: JSX.Element, idx: number) => {
                return item;
              })}
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }
);

Waterfall.displayName = "Waterfall";

export default Waterfall;
