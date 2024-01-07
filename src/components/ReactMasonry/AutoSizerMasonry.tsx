import { Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import { AutoSizer } from "react-virtualized";
import CommonMasonry, { CommonMasonryProps, MasonryRef } from "./CommonMasonry";

interface AutoSizerMasonryProps<T extends Record<string, any>>
  extends Omit<CommonMasonryProps<T>, "width" | "height"> {
  targetTop: number;
  height: number;
}

const AutoSizerMasonry = <T extends Record<string, any>>(
  props: AutoSizerMasonryProps<T>,
) => {
  const { targetTop, height = 0, ...masonryProps } = props;

  const masonryRef = useRef<MasonryRef>(null);

  useEffect(() => {
    console.log({ height });
  }, [height]);

  return (
    <AutoSizer
      scrollTop={masonryProps.scrollTop}
      onResize={() => {
        masonryRef.current?.rerender();
      }}
      disableHeight
      height={height}
      overscanByPixels={1200}
    >
      {({ width }) => {
        return (
          <CommonMasonry
            ref={masonryRef}
            height={height * 2}
            width={width}
            {...masonryProps}
          />
        );
      }}
    </AutoSizer>
  );
};

export default AutoSizerMasonry;
