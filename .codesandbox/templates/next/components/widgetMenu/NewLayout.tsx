import React from "react";
import { useTranslation } from "../../services/i18n/client";
import Button from "@mui/joy/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/joy/Box";
import { IconChevronDown } from "@tabler/icons-react";


export default function NewLayout({
  paddingLeft,
  paddingRight,
  canvas
}: {
  paddingLeft: number;
  paddingRight: number;
  canvas: any
}) {
  const { t } = useTranslation("menu");
  // const canvas: any = BoardService.getInstance().getBoard();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  function NewLayout(event: any, columns: any) {
    if (!canvas) return null;
    const objects = canvas.getActiveObjects();

    canvas.planNewLayout(objects, columns);
    setAnchorEl(null);
  }

  return (
    <Box>
      <Button
        onClick={handleClick}
        aria-label="bold"
        variant="plain"
        color="neutral"
        size="sm"
        sx={{
          p: "4px 7px",
          m: 0,
          color: "currentcolor",
          ".MuiButton-endDecorator": {
            ml: "4px",
          },
        }}
        endDecorator={
          <IconChevronDown
            style={{
              width: "20px",
              height: "20px",
              strokeWidth: "var(--joy-lineHeight-sm)",
            }}
          />
        }
      >
        {t("tidy")}
        {/*--<Tidy/>  */}
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        sx={{
          top: 10,
          left: 45,
          "& .MuiPopover-paper": {
            borderRadius: "8px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "6px 0px",
          }}
        >
          <Button
            sx={{
              color: "var(--joy-palette-text-surface)",
              justifyContent: "flex-start",
              p: "6px 12px",
              width: "150px",
              fontSize: "16px",
              fontWeight: 400,
            }}
            variant="plain"
            key={100}
            onClick={(event) => NewLayout(event, 100)}
          >
            {t("oneRow")}
          </Button>
          <Button
            sx={{
              color: "var(--joy-palette-text-surface)",
              justifyContent: "flex-start",
              p: "6px 12px",
              width: "150px",
              fontSize: "16px",
              fontWeight: 400,
            }}
            variant="plain"
            key={1}
            onClick={(event) => NewLayout(event, 1)}
          >
            {t("oneColumn")}
          </Button>
          <Button
            sx={{
              color: "var(--joy-palette-text-surface)",
              justifyContent: "flex-start",
              p: "6px 12px",
              width: "150px",
              fontSize: "16px",
              fontWeight: 400,
            }}
            variant="plain"
            key={2}
            onClick={(event) => NewLayout(event, 2)}
          >
            {t("twoColumns")}
          </Button>
          <Button
            sx={{
              color: "var(--joy-palette-text-surface)",
              justifyContent: "flex-start",
              p: "6px 12px",
              width: "150px",
              fontSize: "16px",
              fontWeight: 400,
            }}
            variant="plain"
            key={3}
            onClick={(event) => NewLayout(event, 3)}
          >
            {t("threeColumns")}
          </Button>
          <Button
            sx={{
              color: "var(--joy-palette-text-surface)",
              justifyContent: "flex-start",
              p: "6px 12px",
              width: "150px",
              fontSize: "16px",
              fontWeight: 400,
            }}
            variant="plain"
            key={4}
            onClick={(event) => NewLayout(event, 4)}
          >
            {t("fourColumns")}
          </Button>
          <Button
            sx={{
              color: "var(--joy-palette-text-surface)",
              justifyContent: "flex-start",
              p: "6px 12px",
              width: "150px",
              fontSize: "16px",
              fontWeight: 400,
            }}
            variant="plain"
            key={5}
            onClick={(event) => NewLayout(event, 5)}
          >
            {t("fiveColumns")}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
