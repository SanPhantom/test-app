import { CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { ChildrenProps } from "../components/PageContainer";
import { useCallback, useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { useBoolean, useCreation } from "ahooks";
import SelfMasonry from "../components/List/SelfMasonry";
import { ItemType } from "../utils/item";

interface TestListProps extends ChildrenProps {
  list: ItemType[];
  loading: boolean;
}

const TestList = (props: TestListProps) => {
  const { width = 0, list, loading } = props;

  const colWidth = useCreation(() => ((width ?? 0) - 16 * 3) / 2, [width]);

  return (
    <Stack sx={{ p: 2 }}>
      <SelfMasonry
        {...props}
        width={width - 16 * 2}
        col={3}
        list={list}
        itemRender={(item, index) => {
          const imgW = item.image.width;
          const imgH = item.image.height;

          const curHeight = colWidth * (imgH / imgW);
          return (
            <Stack border={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <img
                src={item.image.imageUrl}
                style={{ width: colWidth, height: curHeight }}
              />
              <Divider />
              <Stack sx={{ width: "100%" }}>
                <Typography>{index}</Typography>
                <Typography>{item.title}</Typography>
              </Stack>
            </Stack>
          );
        }}
      />
      {loading && (
        <Stack>
          <CircularProgress size={20} />
        </Stack>
      )}
    </Stack>
  );
};

export default TestList;
