import React from "react";
import store from "../../redux/store";
import { handleSetDropdownDisplayed } from "../../redux/features/widgets.slice";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import { IconButton } from "@mui/joy";
import { Popover } from "@mui/material";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutAlignTop,
  IconLayoutAlignMiddle,
  IconLayoutAlignBottom,
  IconChevronDown,
  IconSpacingHorizontal,
  IconSpacingVertical,
} from "@tabler/icons-react";
import { XCanvas } from "../../../../../fabric";


const options = [
  { id: 0, text: "Vertical Left", value: "vleft" },
  { id: 1, text: "Vertical Right", value: "vright" },
  { id: 2, text: "Vertical Middle", value: "vmiddle" },
  { id: 3, text: "Vertical Distributed", value: "DistrH" },
  { id: 4, text: "Horizontal Top", value: "htop" },
  { id: 5, text: "Horizontal Middle", value: "hmiddle" },
  { id: 6, text: "Horizontal Bottom", value: "hbottom" },
  { id: 7, text: "Horizontal Distributed", value: "DistrV" },
];

// import { BoardService } from "../../services";

export default function AlighGroup({ canvas }: { canvas: XCanvas }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const canvas: any = BoardService.getInstance().getBoard();
  const [] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlur = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const alignGroup = (event: any, alginGroup: any) => {
    const currentObject: any = canvas.getActiveObject();

    canvas.alignGroupObjects(currentObject, alginGroup);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        aria-label="bold"
        variant="plain"
        color="neutral"
        size="sm"
        sx={{
          p: "4px",
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
        <IconLayoutAlignCenter
          fontSize="small"
          style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
        />
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="simple-popover"
        keepMounted
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={Boolean(anchorEl)}
        sx={{
          top: 10,
          left: 35,
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
          <IconButton
            key="GroupAlignVLeft"
            onClick={(event) => alignGroup(event, "VLeft")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconLayoutAlignLeft
              fontSize="small"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            key="GroupAlignVCenter"
            onClick={(event) => alignGroup(event, "VCenter")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconLayoutAlignCenter
              fontSize="small"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            key="GroupAlignVRight"
            onClick={(event) => alignGroup(event, "VRight")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconLayoutAlignRight
              fontSize="small"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            key="GroupAlignHTop"
            onClick={(event) => alignGroup(event, "HTop")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconLayoutAlignTop
              fontSize="small"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            key="GroupAlignHCenter"
            onClick={(event) => alignGroup(event, "HCenter")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconLayoutAlignMiddle
              fontSize="small"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            key="GroupAlignHBottom"
            onClick={(event) => alignGroup(event, "HBottom")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconLayoutAlignBottom
              fontSize="small"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          </IconButton>

          <IconButton
            key="GroupDistributeV"
            onClick={(event) => alignGroup(event, "DistrV")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconSpacingVertical
              fontSize="md"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
            {/*<GroupDistributeV fontSize="md" />*/}
          </IconButton>

          <IconButton
            key="GroupDistributeH"
            onClick={(event) => alignGroup(event, "DistrH")}
            sx={{ p: "6px 12px", minWidth: "48px !important" }}
          >
            <IconSpacingHorizontal
              fontSize="md"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
            {/*<GroupDistributeH fontSize="md" />*/}
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
}
