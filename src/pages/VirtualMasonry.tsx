import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import AutoSizerMasonry from "../components/ReactMasonry/AutoSizerMasonry";
import { ItemType, createNewList, delay } from "../utils/item";
import {
  MasonryItemProps,
  isEmptyOrNil,
} from "../components/ReactMasonry/CommonMasonry";
import { useLockFn, useSize } from "ahooks";
import { clone, findIndex, remove } from "ramda";
import MasonryCard from "../components/ReactMasonry/MasonryCard";
import { faker } from "@faker-js/faker";
import useListAtom from "../atoms/list.atom";
import { PrimitiveAtom } from "jotai";

const text = faker.word.words({ count: { min: 100, max: 600 } });

const VirtualMasonry = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const size = useSize(pageRef);

  const { list, deleteItem } = useListAtom();
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleRemoveItem = useCallback(
    async (itemAtom: PrimitiveAtom<ItemType>) => {
      try {
        await delay();
        deleteItem(itemAtom);
      } catch {
        console.log("error");
      }
    },
    [list]
  );

  const ItemRender = useCallback(
    (props: MasonryItemProps<PrimitiveAtom<ItemType>>) => {
      return (
        <MasonryCard<PrimitiveAtom<ItemType>>
          {...props}
          onRemoveItem={handleRemoveItem}
        />
      );
    },
    [handleRemoveItem]
  );

  useLayoutEffect(() => {
    pageRef.current?.addEventListener("scroll", () => {
      const pageScrollTop = pageRef.current?.scrollTop ?? 0;
      const offsetTop = containerRef.current?.offsetTop ?? 0;
      setScrollTop(pageScrollTop - offsetTop);
    });
  }, []);

  return (
    <Stack
      ref={pageRef}
      sx={{ width: "100%", height: "100%", overflow: "auto" }}
    >
      <Paper
        sx={{
          height: 56,
          px: 2,
          borderRadius: 0,
        }}
      >
        <Stack
          sx={{ alignItems: "center", flexDirection: "row", height: "100%" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Virtual Masonry
          </Typography>
        </Stack>
      </Paper>
      <Stack
        sx={{ flex: 1, minHeight: 0, px: 2, py: 1.5, position: "relative" }}
      >
        <Typography>{text}</Typography>
        <Stack
          ref={containerRef}
          sx={{ flexDirection: "row", alignItems: "flex-start", pb: 2 }}
        >
          {!isEmptyOrNil(size?.height) && (
            <AutoSizerMasonry<PrimitiveAtom<ItemType>>
              itemRender={ItemRender}
              targetTop={0}
              list={list}
              scrollTop={scrollTop}
              height={size?.height ?? 0}
            />
          )}
        </Stack>
        <Typography variant="h6">This is anonymous text!!!</Typography>
      </Stack>
    </Stack>
  );
};

export default VirtualMasonry;
