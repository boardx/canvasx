import React from "react";
import { MenuItem } from "@mui/material";
import Tooltip from "@mui/joy/Tooltip";
import { useTranslation } from "../../services/i18n/client";
import { useDispatch, useSelector } from "react-redux";
import { LineType, updateLineType } from "../../redux/features/widget/line";
import { changeMode } from "../../redux/features/mode.slice";
import { RootState } from "../../redux/store";
import { handleSetTips } from "../../redux/features/widgets.slice";
import { ListItem, ListItemButton, Sheet } from "@mui/joy";
import { IconLine, IconChevronUp, IconX } from "@tabler/icons-react";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { BoardService } from "../../services";

const LineArrow = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.05023 16.9495L16.9497 7.05003M16.9497 7.05003V12.7069M16.9497 7.05003H11.2929"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Line = () => {
  return <IconLine />;
};

const UpArrow = () => (
  <svg
    width="8"
    stroke="var(--joy-palette-text-icon)"
    height="5"
    viewBox="0 0 8 5"
    fill="var(--joy-palette-text-icon)"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.25 4.72966L3.82333 1.15666C3.84652 1.13343 3.87406 1.11501 3.90437 1.10244C3.93469 1.08987 3.96718 1.0834 4 1.0834C4.03282 1.0834 4.06531 1.08987 4.09563 1.10244C4.12594 1.11501 4.15348 1.13343 4.17667 1.15666L7.75 4.72966"
      stroke="var(--joy-palette-text-icon)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation("menu");
  const modeType = useSelector((state: RootState) => state.mode.type);
  const lineType = useSelector(
    (state: RootState) => state.widget.line.lineType
  );

  const handleLineSelected = (type: LineType) => {
    dispatch(handleSetTips(type === "line" ? "none" : "end"));
    dispatch(updateLineType(type));
    dispatch(changeMode("line"));
    setOpen(false);
  };

  const handleCreateLineWhenClick = () => {
    dispatch(changeMode("line"));
    canvas.discardActiveObject();
    //dispatch(updateStickyNoteMenuBarOpenStatus(false));
    setOpen(false);
  };

  const handleLineClick = (e: any) => {
    e.stopPropagation();
    dispatch(changeMode("default"));
    //dispatch(updateStickyNoteMenuBarOpenStatus(false));
    canvas.discardActiveObject();
    setOpen(!open);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  const ArrowIcon = () => {
    switch (lineType) {
      case "line":
        return <Line />;
      case "lineArrow":
        return <LineArrow />;
    }
  };

  return (
    <>
      <Tooltip title={t("arrowConnectorsLines")} placement="top" arrow>
        <ListItem
          id="lineBtn"
          sx={{ width: "56px", borderWidth: "0px", mr: "16px" }}
          value="line"
          onClick={handleCreateLineWhenClick}
        >
          <ListItemButton
            selected={modeType === "line"}
            sx={{
              width: "24px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              p: "8px 4px",
              borderWidth: "0px",
              borderRadius: "6px",
              gap: 0,
              backgroundColor: open
                ? "var(--joy-palette-primary-100) !important"
                : null,
              ".tabler-icon": {
                color: open
                  ? "var(--joy-palette-primary-500)"
                  : "var(--joy-palette-neutral-500)",
              },
            }}
          >
            {lineType === "line" && (
              <IconLine style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
            )}
            {lineType === "lineArrow" && <LineArrow />}

            <IconChevronUp
              onClick={handleLineClick}
              style={{
                marginLeft: "4px",
                width: "20px",
                height: "20px",
                strokeWidth: "var(--joy-lineHeight-sm)",
              }}
            />
          </ListItemButton>
        </ListItem>
      </Tooltip>

      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={handlePopoverClose}
      >
        <Sheet
          sx={{
            position: "fixed",
            bottom: "68px",
            left: "50%",
            transform: "translateX(0%)",
            display: open ? "flex" : "none",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "var(--joy-shadow-md)",
            p: "8px",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <MenuItem
            selected={lineType === "lineArrow"}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                lineType === "lineArrow" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleLineSelected("lineArrow")}
          >
            <LineArrow />
          </MenuItem>

          <MenuItem
            selected={lineType === "line"}
            sx={{
              p: 0,
              mr: "8px",
              borderRadius: "4px",
              backgroundColor:
                lineType === "line" ? "#EAEEF6 !important" : "transparent",
            }}
            onClick={() => handleLineSelected("line")}
          >
            <IconLine style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
          </MenuItem>
          <MenuItem sx={{ p: 0 }} onClick={handlePopoverClose}>
            <IconX style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
          </MenuItem>
        </Sheet>
      </ClickAwayListener>

      {/* <Popover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={document.getElementById('lineBtn')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 71, horizontal: 'center' }}
      ></Popover> */}
    </>
  );
};
