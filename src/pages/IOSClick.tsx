import { Button, Dialog, Link, Stack } from "@mui/material";
import { useState } from "react";

const IOSClick = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack sx={{ height: "100dvh", width: "100vw" }}>
      <Stack sx={{ flex: 1, minHeight: 0, p: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setIsOpen((current) => !current);
          }}
        >
          open dialog
        </Button>
      </Stack>
      <Stack sx={{ height: 48, flexDirection: "row" }}>
        <Button
          component={Link}
          href="/"
          sx={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          第一个
        </Button>
        <Button
          component={Link}
          href="/"
          sx={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          第二个
        </Button>
        <Button
          href="/"
          component={Link}
          sx={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          第三个
        </Button>
        <Button
          href="/"
          component={Link}
          sx={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          第四个
        </Button>
      </Stack>

      <Dialog open={isOpen} fullScreen>
        <Stack sx={{ height: "100%" }}>
          <Stack sx={{ flex: 1 }}>Component</Stack>
          <Stack sx={{ p: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              这不是一个按钮
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  );
};

export default IOSClick;
