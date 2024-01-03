import { Stack } from "@mui/material";
import { useCreation } from "ahooks";
import React, { useRef } from "react";

import {
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  CellMeasurer,
} from "react-virtualized";
import { ChildrenProps } from "../PageContainer";

interface SelfMasonryProps extends ChildrenProps {
  list: any[];
  col: number;
  itemRender: (item: any, idx: number) => React.ReactNode;
}

const SelfMasonry = (props: SelfMasonryProps) => {
  const { width = 0, height = 0, list, col, itemRender, scrollTop = 0 } = props;

  const masonryRef = useRef(null);

  const colWidth = useCreation(
    () => ((width ?? 0) - 16 * (col - 1)) / col,
    [width]
  );

  // Default sizes help Masonry decide how many images to batch-measure
  const cache = useCreation(
    () =>
      new CellMeasurerCache({
        defaultHeight: 250,
        defaultWidth: colWidth,
        fixedWidth: true,
      }),
    []
  );

  const cellPositioner = useCreation(
    () =>
      createMasonryCellPositioner({
        cellMeasurerCache: cache,
        columnCount: col,
        columnWidth: colWidth,
        spacer: 16,
      }),
    [colWidth, cache, col]
  );

  if (width === 0) {
    return null;
  }

  return (
    <Masonry
      cellCount={list.length}
      width={width}
      height={height}
      scrollTop={scrollTop}
      ref={masonryRef}
      overscanByPixels={0}
      autoHeight
      cellPositioner={cellPositioner}
      cellMeasurerCache={cache}
      cellRenderer={({ index, key, parent, style }) => {
        const item = list[index];
        return (
          <CellMeasurer
            cache={cache}
            index={index}
            key={item.id}
            parent={parent}
          >
            <Stack key={key} style={{ ...style, width: colWidth }}>
              {itemRender(item, index)}
            </Stack>
          </CellMeasurer>
        );
      }}
    />
  );
};

export default SelfMasonry;
