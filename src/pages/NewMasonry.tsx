import { Button, Divider, Stack, Typography } from "@mui/material";
import { useSize } from "ahooks";
import { useCallback, useEffect, useRef, useState } from "react";
import SelfMasonry from "../components/List/SelfMasonry";
import PageContainer from "../components/PageContainer";
import { ItemType, createNewList } from "../utils/item";

const NewMasonry = () => {
  const col = 2;

  const bodySize = useSize(document.querySelector("body"));

  const { width, height } = bodySize ?? { width: 0, height: 0 };

  const containerRef = useRef<HTMLDivElement>(null);

  const containerWidth = containerRef.current?.clientWidth ?? 0;

  const [list, setList] = useState<ItemType[]>([]);

  const handleRemoveItem = (deleteItem: ItemType) => {
    console.log({ list, deleteItem });
    // const cloneList = clone(list);
    // const index = findIndex((x: ItemType) => x.id === deleteItem.id, cloneList);
    // console.log({ deleteItem, index });
    // remove(index, 1, cloneList);
    // console.log(cloneList);
    // setList(curList);
  };

  const ItemRender = useCallback(
    (item: ItemType, index: number, colWidth: number) => {
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
          <Stack sx={{ p: 2, gap: 1 }}>
            <Stack>
              <Typography>{index}</Typography>
              <Typography>{item.title}</Typography>
              <Typography variant="body2">{item.id}</Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={() => {
                handleRemoveItem(item);
              }}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      );
    },
    []
  );

  useEffect(() => {
    const currentList = createNewList(10);
    setList(currentList);
  }, []);

  useEffect(() => {
    console.log({ list }, "list updated");
  }, [list]);

  return (
    <PageContainer>
      <Stack sx={{ p: 2, width }}>
        <Stack ref={containerRef}>
          <SelfMasonry
            width={containerWidth}
            height={height}
            scrollTop={scrollTop}
            col={col}
            list={list}
            itemRender={(item, idx) => ItemRender(item, idx, colWidth)}
          />
        </Stack>
      </Stack>
    </PageContainer>
  );
};

export default NewMasonry;
