import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/joy/Box";
import Menu from "@mui/material/Menu";
import { useTranslation } from "../../services/i18n/client";
import store from "../../redux/store";
import { handleSetDropdownDisplayed } from "../../redux/features/widgets.slice";
import { handleChangeFontSize } from "../../redux/features/widgetMenu.slice";
import Typography from "@mui/joy/Typography";

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";


/*

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.widget}`]: {},
  [`& .${classes.align}`]: {},

  [`& .${classes.main}`]: {
    display: 'flex',
    height: '44px'
  },

  [`& .${classes.fontBtnGroup}`]: {
    width: '16px',
    marginTop: '4px'
  },

  [`& .${classes.button}`]: {
    borderColor: 'gainsboro',
    textAlign: 'right',
    color: '#150D33',
    borderRightWidth: 0,
    fontSize: '16px',
    fontWeight: 400,
    height: '44px',
    textTransform: 'none',
    minWidth: '25px',
    padding: 0,
    paddingLeft: 0,
    //
 
  },

  [`& .${classes.box}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 0px',
    height: '44px',
    width: '20px',
    boxSizing: 'border-box'
  },

  [`& .${classes.iconStyle}`]: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  [`& .${classes.arrUpBtn}`]: {
    minWidth: '20px',
    color: '#757575',
    textAlign: 'center'
  },

  [`& .${classes.arrDownBtn}`]: {
    minWidth: '20px',
    color: '#757575',
    textAlign: 'center'
  },

  [`& .${classes.btnIcon}`]: {
    width: 16,
    height: 16
  }
}));
*/
export default function FontSize({
  fontSize,
  paddingLeft,
  paddingRight,
  canvas
}: {
  fontSize: number;
  paddingLeft: number;
  paddingRight: number;
  canvas: any;
}) {
  const { t } = useTranslation("menu");
  const displayFontSize = fontSize || 16;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [8, 10, 12, 14, 18, 24, 36, 48, 64, 80, 144, 288];

  const handleChange = () => { };

  const handleBlur = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const changeFontSize = (e: any, index: any, value: any) => {
    store.dispatch(handleChangeFontSize(value));
    setSelectedIndex(index);
    e.preventDefault();
    const object = canvas.getActiveObject();
    if (object.objType === "XText" && !object.isEditing) {
      //计算originx y 从center变到left和top后，object的left和top的新值
      const left = object.left - (object.width * object.scaleX) / 2;
      const top = object.top - (object.height * object.scaleY) / 2;
      object.set({ originX: "left", originY: "top", left, top });
      object.saveData("MODIFIED", ["originX", "left", "top", "originY"]);
    }
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();
    // if (!object) {
    //   return $("#notesMenu").hide();
    // }

    if (!group) {
      const fontSize = value;
      if (object.objType === "XText" && object.isEditing) {
        const width = (object.width * fontSize) / object.fontSize;
        let { left } = object;
        if (object.originX === "center") {
          left += ((width - object.width) * object.scaleX) / 2;
        }
        const height = (object.height * fontSize) / object.fontSize;
        let { top } = object;
        if (object.originY === "center") {
          top += ((height - object.height) * object.scaleY) / 2;
        }
        object.set("width", width);
        object.set("left", left);
        object.set("top", top);
      }
      object.set("fontSize", fontSize);
      object.saveData("MODIFIED", ["fontSize"]);
    } else {
      group._objects.forEach((obj: any) => {
        const fontSize = value;
        obj.set("fontSize", fontSize);
      });
      group.saveData("MODIFIED", ["fontSize"]);
    }

    // canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
    if (object.objType === "XText" && !object.isEditing) {
      //计算originx y 从left和top变到center后，object的left和top的新值
      const originLeft = object.left + (object.width * object.scaleX) / 2;
      const originTop = object.top + (object.height * object.scaleY) / 2;
      object.set({
        originX: "center",
        originY: "center",
        left: originLeft,
        top: originTop,
      });
      object.saveData("MODIFIED", ["originX", "left", "top", "originY"]);
    }

    handleClose();
  };

  const decreaseFontSize = (e: any) => {
    const curSize = store.getState().widgetMenu.menuFontSize;

    let index;
    if (curSize.toString() !== t("mixed")) {
      index = options.indexOf(curSize);
      if (index === -1 && curSize > 7) {
        store.dispatch(handleChangeFontSize(curSize - 1));
      } else {
        if (index === 0) index = 1;
        store.dispatch(handleChangeFontSize(options[index - 1]));
        setSelectedIndex(options[index - 1]);
      }
    }

    e.preventDefault();

    const object = canvas.getActiveObject();
    if (object.objType === "XText" && !object.isEditing) {
      //计算originx y 从center变到left和top后，object的left和top的新值
      const left = object.left - (object.width * object.scaleX) / 2;
      const top = object.top - (object.height * object.scaleY) / 2;
      object.set({ originX: "left", originY: "top", left, top });
      object.saveData("MODIFIED", ["originX", "left", "top", "originY"]);
    }
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();
    // if (!object) {
    //   return $("#notesMenu").hide();
    // }

    if (!group) {
      index = options.indexOf(curSize);
      if (index === 0) index = 1;
      let fontSize = options[index - 1];
      if (index === -1 && curSize > 7) {
        fontSize = curSize - 1;
      }
      if (object.type === "XText") {
        const width = (object.width * fontSize) / object.fontSize;
        let { left } = object;
        if (object.originX === "center") {
          left += ((width - object.width) * object.scaleX) / 2;
        }
        const height = (object.height * fontSize) / object.fontSize;
        let { top } = object;
        if (object.originY === "center") {
          top += ((height - object.height) * object.scaleY) / 2;
        }
        object.set("width", width);
        object.set("left", left);
        object.set("top", top);
      }
      object.set("fontSize", fontSize);
      object.saveData("MODIFIED", [
        "width",
        "left",
        "top",
        "fontSize",
        "originX",
        "originY",
      ]);
    } else {
      let gIndex = 8;
      group._objects.forEach((obj: any) => {
        gIndex = options.indexOf(obj.fontSize) - 1;
        if (gIndex == -1) gIndex = 0;
        obj.set("fontSize", options[gIndex]);
      });
      group.saveData("MODIFIED", ["fontSize"]);
      if (displayFontSize.toString() === t("mixed")) {
        store.dispatch(handleChangeFontSize(t("mixed")));
      } else {
        store.dispatch(handleChangeFontSize(options[gIndex]));
      }
    }
    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
    if (object.objType === "XText" && !object.isEditing) {
      //计算originx y 从left和top变到center后，object的left和top的新值
      const originLeft = object.left + (object.width * object.scaleX) / 2;
      const originTop = object.top + (object.height * object.scaleY) / 2;
      object.set({
        originX: "center",
        originY: "center",
        left: originLeft,
        top: originTop,
      });
      object.saveData("MODIFIED", ["originX", "left", "top", "originY"]);
    }
  };

  const increaseFontSize = (e: any) => {
    const object = canvas.getActiveObject();
    const curSize = store.getState().widgetMenu.menuFontSize;
    if (object.objType === "XShapeNotes") {
      if (curSize === 122) {
        return;
      }
    }

    let index;
    if (curSize.toString() !== t("mixed")) {
      index = options.indexOf(curSize);
      if (index === -1 && curSize > 7) {
        store.dispatch(handleChangeFontSize(curSize + 1));
      } else {
        //if (curSize === 288) index = options.indexOf(288) - 1;
        if (curSize === 144) index = options.indexOf(144) - 1;
        store.dispatch(handleChangeFontSize(options[index + 1]));

        setSelectedIndex(options[index + 1]);
      }
    }

    e.preventDefault();

    if (object.objType === "XText" && !object.isEditing) {
      //计算originx y 从center变到left和top后，object的left和top的新值
      const left = object.left - (object.width * object.scaleX) / 2;
      const top = object.top - (object.height * object.scaleY) / 2;
      object.set({ originX: "left", originY: "top", left, top });
      object.saveData("MODIFIED", ["originX", "left", "top", "originY"]);
    }
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();
    // if (!object) {
    //   return $("#notesMenu").hide();
    // }

    if (!group) {
      index = options.indexOf(curSize);
      //if (curSize === 288) index = options.indexOf(288) - 1;
      if (curSize === 144) index = options.indexOf(144) - 1;
      let fontSize = options[index + 1];
      if (index === -1 && curSize > 7) {
        fontSize = curSize + 1;
      }
      if (object.type === "XText") {
        const width = (object.width * fontSize) / object.fontSize;
        let { left } = object;
        if (object.originX === "center") {
          left += ((width - object.width) * object.scaleX) / 2;
        }
        const height = (object.height * fontSize) / object.fontSize;
        let { top } = object;
        if (object.originY === "center") {
          top += ((height - object.height) * object.scaleY) / 2;
        }
        object.set("width", width);
        object.set("left", left);
        object.set("top", top);
      }
      object.set("fontSize", fontSize);
      object.saveData("MODIFIED", [
        "width",
        "left",
        "top",
        "fontSize",
        "originX",
        "originY",
      ]);
    } else {
      let gIndex = 8;
      group._objects.forEach((obj: any) => {
        gIndex = options.indexOf(obj.fontSize) + 1;
        // if (gIndex > options.indexOf(288) - 1)
        //   gIndex = options.indexOf(288) - 1;
        if (gIndex > options.indexOf(144) - 1)
          gIndex = options.indexOf(144) - 1;
        obj.set("fontSize", options[gIndex]);
      });
      group.saveData("MODIFIED", ["fontSize"]);
      if (displayFontSize.toString() === t("mixed")) {
        store.dispatch(handleChangeFontSize(t("mixed")));
      } else {
        store.dispatch(handleChangeFontSize(options[gIndex]));
      }
    }
    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
    if (object.objType === "XText" && !object.isEditing) {
      //计算originx y 从left和top变到center后，object的left和top的新值
      const originLeft = object.left + (object.width * object.scaleX) / 2;
      const originTop = object.top + (object.height * object.scaleY) / 2;
      object.set({
        originX: "center",
        originY: "center",
        left: originLeft,
        top: originTop,
      });
      object.saveData("MODIFIED", ["originX", "left", "top", "originY"]);
    }
  };

  const open = Boolean(anchorEl);

  const handleMenuItemDOM = () =>
    options.map((option, index) => (
      <MenuItem
        data-cy={option}
        key={option}
        onClick={(event) => changeFontSize(event, index, option)}
        selected={index === selectedIndex}
        value={option}
        sx={{ p: "6px 12px", /*color: '#32383E',*/ minWidth: "56px" }}
      >
        {option}
      </MenuItem>
    ));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",

        p: "6px 4px",
      }}
    >
      {/* <Button
        aria-controls="fontsize-menu"
        aria-haspopup="true"
        variant="plain"
        color="neutral"
        sx={{
          textAlign: 'right',

          borderRightWidth: 0,
          fontSize: 16,
          fontWeight: 400,
          height: 44,
          textTransform: 'none',
          minWidth: 25,
          padding: 0,
          paddingLeft: 0
        }}
        // onClick={handleClick}
      >
        {displayFontSize}
      </Button> */}

      {/* <Input value={displayFontSize} /> */}
      <Typography
        onClick={handleClick}
        color="neutral"
        //level="body-sm"
        sx={{
          minWidth: "32px",
          height: "32px",
          lineHeight: "32px",

          textAlign: "center",
          fontSize: "16px",
          //fontWeight: 600,
          borderRadius: "20%",

          "&:hover": {
            bgcolor: "var(--joy-palette-neutral-plainHoverBg)",
          },
        }}
      >
        {displayFontSize}
      </Typography>
      {/*
      <IconButton
       
        sx={{ minWidth: '20px', minHeight: '20px', p: 0, ml: '4px' }}
      >
        <IconSelector style={{ width: '20px', height: '20px' }} />
      </IconButton>
      */}
      <Menu
        anchorEl={anchorEl}
        autoFocus
        data-cy="FontSize"
        id="fontsize-menu"
        keepMounted
        onBlur={handleBlur}
        onChange={handleChange}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        sx={{
          ".MuiMenu-paper": {
            p: "6px 0px",
            borderRadius: "8px",
            border: "1px solid #CDD7E1",
            mt: "16px",
          },
          ".MuiMenu-list": {
            p: 0,
          },
        }}
      >
        {handleMenuItemDOM()}
      </Menu>

      {
        <Box
          id="fontSizeBox"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0px 0px",
            height: "32px",
            width: "24px",
            boxSizing: "border-box",
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "var(--joy-palette-neutral-plainHoverBg)",
            },
          }}
        >
          <Box
            component="label"
            tabIndex={-1}
            color="neutral"
            sx={{
              mt: "-10px",
              maxHeight: "16px",
            }}
          >
            {/* <IconChevronDown style={{ width: '20px', height: '20px' }} /> */}
            <IconChevronUp
              stroke={1.5}
              onClick={(event) => increaseFontSize(event)}
              style={{
                strokeWidth: "var(--joy-lineHeight-sm)",
                fontSize: "10px",
              }}
            />
          </Box>

          <Box
            component="label"
            tabIndex={-1}
            color="neutral"
            sx={{
              mt: "0px",
              maxHeight: "16px",
            }}
          >
            <IconChevronDown
              stroke={1.5}
              onClick={(event) => decreaseFontSize(event)}
              style={{
                strokeWidth: "var(--joy-lineHeight-sm)",
                fontSize: "10px",
              }}
            />
          </Box>
        </Box>
      }
    </Box>
  );
}
