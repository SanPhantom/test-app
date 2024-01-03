import { Stack } from "@mui/material";
import { isUndefined } from "lodash";
import { anyPass, isEmpty, isNil } from "ramda";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  Masonry,
  MasonryCellProps,
  MasonryState,
  createMasonryCellPositioner,
} from "react-virtualized";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export interface MasonryRef {
  rerender: () => void;
}

export interface MasonryItemProps<T extends Record<string, any>> {
  item: T;
  index: number;
  colWidth: number;
}

export interface CommonMasonryProps<T extends Record<string, any>> {
  col?: number;
  space?: number;
  scrollTop: number;
  width: number;
  height: number;
  list: T[];
  itemRender: (props: MasonryItemProps<T>) => React.ReactNode;
}

export const isEmptyOrNil: (param?: any) => typeof param = anyPass([
  isEmpty,
  isNil,
  isUndefined,
]);

const CommonMasonry = <T extends Record<string, any>>(
  props: CommonMasonryProps<T>,
  ref: ForwardedRef<MasonryRef>
) => {
  const {
    col = 2,
    space = 16,
    width,
    height = 0,
    list,
    scrollTop,
    itemRender,
  } = props;
  const masonryRef = useRef<Masonry>(null);

  const colWidth = useMemo(() => {
    return Math.floor((width - space * (col - 1)) / col);
  }, [width, space, col]);

  const masonryCache = useMemo(() => {
    return new CellMeasurerCache({
      defaultWidth: width,
      defaultHeight: height,
      fixedWidth: true,
    });
  }, [width, height]);

  const masonryCellPosition = useMemo(() => {
    return createMasonryCellPositioner({
      cellMeasurerCache: masonryCache,
      columnCount: col,
      columnWidth: colWidth,
      spacer: space,
    });
  }, [masonryCache, colWidth, space, col]);

  const [masonryState, setMasonryState] = useState<MasonryState>({
    isScrolling: true,
    scrollTop: -1,
  });

  const MasonryItemRender = useCallback(
    ({ index, key, parent, style }: MasonryCellProps) => {
      const masonryItem = list[index];

      return (
        <CellMeasurer
          cache={masonryCache}
          index={index}
          key={key}
          parent={parent}
        >
          <Stack
            style={{
              ...style,
              width: colWidth,
              transition: "top 2s, left 2s",
            }}
          >
            {isEmptyOrNil(masonryItem)
              ? null
              : itemRender({ item: masonryItem, index, colWidth })}
          </Stack>
        </CellMeasurer>
      );
    },
    [masonryCache, colWidth, itemRender, list]
  );

  useEffect(() => {
    setMasonryState((prevState) => ({
      ...prevState,
      scrollTop: scrollTop,
    }));
  }, [scrollTop]);

  const rerenderMasonry = useCallback(() => {
    console.log("render");
    masonryCache.clearAll();
    masonryCellPosition.reset({
      columnCount: col,
      columnWidth: colWidth,
      spacer: space,
    });
    masonryRef.current?.clearCellPositions();
  }, [masonryCache, masonryCellPosition]);

  useImperativeHandle(ref, () => ({
    rerender: () => {
      rerenderMasonry();
    },
  }));

  useEffect(() => {
    rerenderMasonry();
  }, [list]);

  return (
    <Masonry
      autoHeight
      cellMeasurerCache={masonryCache}
      cellPositioner={masonryCellPosition}
      height={height}
      width={width}
      ref={masonryRef}
      scrollTop={masonryState.scrollTop}
      cellCount={list.length}
      cellRenderer={MasonryItemRender}
      overscanByPixels={1500}
    />
  );
};

export default forwardRef(CommonMasonry);
