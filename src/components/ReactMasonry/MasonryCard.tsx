import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { PrimitiveAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { MasonryItemProps } from "./CommonMasonry";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import useListAtom from "../../atoms/list.atom";
import { updateListItem } from "../../utils/item";

interface MasonryCardProps<T extends PrimitiveAtom<any>>
  extends MasonryItemProps<T> {
  onRemoveItem: (item: T) => void;
}

const MasonryCard = <T extends PrimitiveAtom<any>>(
  props: MasonryCardProps<T>
) => {
  const { item: itemAtom, colWidth, index, onRemoveItem } = props;

  const item = useAtomValue(itemAtom);
  const { updateItem } = useListAtom();

  const { imgW, imgH } = useMemo(() => {
    return {
      imgW: item.image?.width ?? 0,
      imgH: item.image?.height ?? 0,
    };
  }, [item]);

  const curHeight = useMemo(
    () => colWidth * (imgH / imgW),
    [imgW, imgH, colWidth]
  );

  const handleUpdateItem = useCallback(() => {
    updateItem(item.id, { ...item, ...updateListItem() });
  }, []);

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{ width: colWidth, height: curHeight ?? 0, position: "relative" }}
      >
        <img
          src={item.image.imageUrl}
          style={{ width: "100%", height: "100%" }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleUpdateItem();
          }}
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            px: 0.5,
            py: 0.5,
            minWidth: 0,
          }}
        >
          <RefreshIcon />
        </Button>
      </Box>

      <Stack sx={{ p: 1, gap: 1 }}>
        <Stack>
          <Typography>{item.title}</Typography>
        </Stack>

        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "unset" }}
          onClick={() => {
            onRemoveItem(itemAtom);
          }}
        >
          Remove it
        </Button>
      </Stack>
    </Paper>
  );
};

export default MasonryCard;
