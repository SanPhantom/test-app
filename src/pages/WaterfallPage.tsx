import { Stack, Typography, alpha } from "@mui/material";
import Waterfall from "../components/waterfall/Waterfall";
import { uniqueId } from "lodash";

const WaterfallPage = () => {
  const list = new Array(50).fill(0).map(() => ({
    height: Math.floor(Math.random() * 100 + 10),
    id: uniqueId(),
  }));
  return (
    <Stack
      sx={{
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
      }}
    >
      <Stack
        sx={{
          border: 1,
          borderRadius: 2,
          width: "50vw",
          height: "100%",
          p: 1.5,
          overflow: "auto",
        }}
      >
        <Waterfall
          list={list}
          itemRender={(idx, item) => (
            <Stack sx={{ background: alpha("#6a8d52", 0.35) }}>
              <Stack
                sx={{ height: item.height, background: "#b1d5c8" }}
              ></Stack>
              <Stack
                sx={{
                  px: 1,
                  py: 0.5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">index: {idx}</Typography>
                <Typography variant="body2">height: {item.height}</Typography>
              </Stack>
            </Stack>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default WaterfallPage;
