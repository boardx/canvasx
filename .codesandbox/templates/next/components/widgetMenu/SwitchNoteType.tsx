import React from "react";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import showMenu from "./ShowMenu";
import { useTranslation } from "../../services/i18n/client";
//** Import Redux toolkit
import store, { RootState } from "../../redux/store";
import { handleSetDropdownDisplayed } from "../../redux/features/widgets.slice";
import { useSelector } from "react-redux";
import { handleSetGetOptions } from "../../redux/features/board.slice";
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import SvgIcon from "@mui/joy/SvgIcon";
import Button from "@mui/joy/Button";
import { Popover } from "@mui/material";
import { IconSticker2, IconSticker } from "@tabler/icons-react";

import { IconTransform } from "@tabler/icons-react";
import { IconChevronDown, IconLetterT } from "@tabler/icons-react";


const menuItems = [
  {
    iconCss: "em-icons e-file",
    items: [
      { text: "Open", iconCss: "em-icons e-open" },
      { text: "Save", iconCss: "e-icons e-save" },
      { separator: true },
      { text: "Exit" },
    ],
    text: "File",
  },
  {
    iconCss: "em-icons e-edit",
    items: [
      { text: "Cut", iconCss: "em-icons e-cut" },
      { text: "Copy", iconCss: "em-icons e-copy" },
      { text: "Paste", iconCss: "em-icons e-paste" },
    ],
    text: "Edit",
  },
  {
    items: [{ text: "Toolbar" }, { text: "Sidebar" }, { text: "Full Screen" }],
    text: "View",
  },
  {
    items: [
      { text: "Spelling & Grammar" },
      { text: "Customize" },
      { text: "Options" },
    ],
    text: "Tools",
  },
  { text: "Go" },
  { text: "Help" },
];

export default function SwitchNoteType({
  paddingLeft,
  paddingRight,
  canvas
}: {
  paddingLeft: number;
  paddingRight: number;
  canvas: any
}) {
  const { t } = useTranslation("menu");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNoteType, setSelectedNoteType] = React.useState("");
  const [options, setOptions] = React.useState<any>(null);
  // const canvas: any = BoardService.getInstance().getBoard();
  const getOptions = useSelector((state: RootState) => state.board.getOptions);

  const optionsText = [
    { id: 1, text: t("3X3Note"), value: "33" },
    { id: 2, text: t("5X3Note"), value: "53" },
    { id: 3, text: t("circleNote"), value: "circle" },
    { id: 5, text: t("text"), value: "text" },
  ];

  const optionsDraw = [
    { id: 6, text: t("textModel"), value: "texting" },
    { id: 1, text: t("3X3Note"), value: "33" },
    { id: 2, text: t("5X3Note"), value: "53" },
    { id: 3, text: t("circleNote"), value: "circle" },
    { id: 5, text: t("text"), value: "text" },
  ];
  // useEffect(() => {
  //   let op = getOptions || optionsText;
  //   setOptions(op);
  // }, [getOptions]);
  const handleClick = (event: any) => {
    // const { isDraw } = canvas.getActiveObject();
    // if (!isDraw){
    store.dispatch(handleSetGetOptions(optionsText));
    // }
    // else{
    //   store.dispatch(handleSetGetOptions(optionsDraw));
    // }
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

  const handleChange = (event: any) => {
    const { isDraw } = canvas.getActiveObject();
    if (!isDraw) {
      store.dispatch(handleSetGetOptions(optionsText));
    } else {
      store.dispatch(handleSetGetOptions(optionsDraw));
    }
  };

  const changeToDrawMode = (e: any) => {
    e.preventDefault();
    const widget = canvas.getActiveObject();

    widget.initializeDrawOnStickyNote();
  };

  const changeToTextNodeMode = (e: any) => {
    e.preventDefault();
    const widget = canvas.getActiveObject();

    if (widget.objType !== "XRectNotes" && widget.objType !== "XCircleNotes") {
      return;
    }

    const { defaultNote } = canvas;
    defaultNote.isDraw = false;
    canvas.changeDefaulNote(defaultNote);

    widget.set("isDraw", false);
    widget.dirty = true;

    widget.saveData("MODIFIED", ["isDraw"]);
    canvas.unlockObjectsInCanvas();
    // $("#notesDrawCanvas").hide();
    // $("#notesDrawCanvas").next().hide();
    showMenu(canvas);
    canvas.requestRenderAll();
    setAnchorEl(null);
  };

  const switchType = (e: any, index: number, value: any) => {
    if (value === "drawing") {
      changeToDrawMode(e);
      showMenu(canvas);
      setAnchorEl(null);
      return;
    }
    if (value === "texting") {
      changeToTextNodeMode(e);
      return;
    }
    setSelectedNoteType(value);
    e.preventDefault();
    const type = value;
    const objects = canvas.getActiveObjects();
    handleClose();
    canvas.switchNoteType(objects, type);
  };

  const handleMenuItemDOM = () =>
    options?.map((option: any, id: any) => (
      <IconButton
        size="sm"
        variant="plain"
        data-cy={option.text}
        key={option.text}
        onClick={(event) => switchType(event, id, option.value)}
        sx={{ p: "6px 12px" }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          {option.text === t("3X3Note") ? (
            <IconSticker2
              fontSize="md"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          ) : null}
          {option.text === t("5X3Note") ? (
            <SvgIcon fontSize="xl2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12H16C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V19M21 12V12.172C20.9999 12.7024 20.7891 13.211 20.414 13.586L15.586 18.414C15.211 18.7891 14.7024 18.9999 14.172 19H14M21 12V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H14"
                  stroke="var(--joy-palette-text-icon)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </SvgIcon>
          ) : null}
          {option.text === t("circleNote") ? (
            <IconSticker
              fontSize="md"
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          ) : null}

          {option.text === t("text") ? (
            <IconLetterT style={{ strokeWidth: "var(--joy-lineHeight-sm" }} />
          ) : null}
          {option.text === t("drawingMode") ? (
            <BrushOutlinedIcon
              style={{ strokeWidth: "var(--joy-lineHeight-sm)" }}
            />
          ) : null}
          {option.text === t("textMode") ? (
            <IconLetterT style={{ strokeWidth: "var(--joy-lineHeight-sm" }} />
          ) : null}

          <Box
            sx={{
              ml: "14px",
              fontSize: "16px",
              minWidth: "138px",
              textAlign: "left",
            }}
          >
            {option.text}
          </Box>
        </Box>
      </IconButton>
    ));
  return (
    <Box>
      <Button
        component="label"
        tabIndex={-1}
        color="neutral"
        variant="plain"
        onClick={handleClick}
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
        <IconTransform style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
        {/*<ChangeCircleOutlinedIcon fontSize="small" />*/}
        {/* 
          {canvas.getActiveObject() &&
            (canvas.getActiveObject().objType === 'XRectNotes' ||
              canvas.getActiveObject().objType === 'XCircleNotes') ? (
            <StickyNoteIcon fontSize="md" />
          ) : (
            <TextNoteIcon fontSize="md" />
          )} */}
      </Button>

      <Popover
        anchorEl={anchorEl}
        sx={{
          top: 10,
          left: 35,
          "& .MuiPopover-paper": {
            borderRadius: "8px",
          },
        }}
        id="simple-menu-note"
        keepMounted
        onBlur={handleBlur}
        onChange={handleChange}
        onClose={handleClose}
        onFocus={handleFocus}
        open={Boolean(anchorEl)}
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
            borderRadius: "8px",
          }}
        >
          {handleMenuItemDOM()}
        </Box>
      </Popover>
    </Box>
  );
}
