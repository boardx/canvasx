import React from "react";

import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";

import { handleChangeFontFamily } from "../../redux/features/widgetMenu.slice";
import store from "../../redux/store";
import {
  handleSetDropdownDisplayed,
  handleSetMultiFontFamily,
  handleSetObjectWidgetStatusChange,
} from "../../redux/features/widgets.slice";
import { useTranslation } from "../../services/i18n/client";
import Popover from "@mui/material/Popover";
import { IconChevronDown, IconTypography } from "@tabler/icons-react";

export default function ({
  font,
  paddingLeft,
  paddingRight,
  canvas
}: {
  font?: string;
  paddingLeft?: string;
  paddingRight?: string;
  canvas: any
}) {
  font = font || "Inter";
  // const canvas: any = BoardService.getInstance().getBoard();
  const { t } = useTranslation("menu");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e: any) => {
    changeFont(e.target.value, 400);
  };

  const handleBlur = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e: any) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const changeFont = (value: any, weight: any) => {
    const fontFamily = value;
    const object = canvas.getActiveObject();
    const fontWeight = weight;

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (object) {
      object.set("fontFamily", fontFamily);

      object.set("fontWeight", fontWeight);
      object.saveData("MODIFIED", ["fontFamily", "fontWeight"]);
      canvas.requestRenderAll();
    }
    if (group && group._objects) {
      group._objects.forEach((obj: any) => {
        obj.set("fontFamily", fontFamily);
        obj.set("fontWeight", fontWeight);
        //fabric.util.clearFabricFontCache(fontFamily);
        canvas.requestRenderAll();
      });

      group.saveData("MODIFIED", ["fontFamily", "fontWeight"]);
      store.dispatch(handleSetMultiFontFamily(fontFamily));
    }
    store.dispatch(handleChangeFontFamily(value));
    canvas.requestRenderAll();
    setAnchorEl(null);
    if (store.getState().widgets.objectWidgetStatusChange) {
      store.dispatch(handleSetObjectWidgetStatusChange(false));
    } else {
      store.dispatch(handleSetObjectWidgetStatusChange(true));
    }
  };

  const open = Boolean(anchorEl);

  const handleFontFamily = () => {
    return font?.toString() === t("mixed") ? "Inter" : font;
  };

  const handleFont = () => {
    return font?.toString() === "Noto Sans SC"
      ? "黑体"
      : font?.toString() === "ZCOOL KuaiLe"
        ? "快乐"
        : font?.toString() === "Liu Jian Mao Cao"
          ? "草书"
          : font?.toString() === "Zhi Mang Xing"
            ? "行书"
            : font?.toString().length > 6
              ? `${font?.toString().substring(0, 4)}..`
              : font?.toString();
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        aria-controls="font-menu"
        aria-haspopup="true"
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
          <IconChevronDown style={{ width: "20px", height: "20px" }} />
        }
      >
        {/* {handleFont()} */}
        <IconTypography style={{ strokeWidth: "var(--joy-lineHeight-sm)" }} />
      </Button>

      <Popover
        anchorEl={anchorEl}
        autoFocus
        sx={{
          top: 10,
          left: 35,
          "& .MuiPopover-paper": {
            borderRadius: "8px",
          },
        }}
        data-cy="FontChange"
        id="font-menu"
        keepMounted
        onBlur={handleBlur}
        onChange={handleChange}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        //@ts-ignore
        value={font}
        defaultValue={font}
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
          {/* <MenuItem
          className={classes.arial}
          onClick={() => changeFont('Arial', 400)}
          value="Arial"
        >
          Arial
        </MenuItem> */}
          {/* <MenuItem
          className={classes.caveat}
          onClick={() => changeFont('Caveat', 400)}
          value="Caveat"
        >
          Caveat
        </MenuItem> */}
          {/* <MenuItem
          className={classes.roboto}
          onClick={() => changeFont('Inter', 400)}
          value="Roboto"
        >
          Roboto
        </MenuItem> */}
          <Button
            color="neutral"
            variant="plain"
            sx={{
              fontFamily: "Inter",
              fontWeight: 400,
              p: "6px 12px",
              width: "100px",
              justifyContent: "flex-start",
            }}
            //variant='plain'
            onClick={() => changeFont("Inter", 400)}
            value="Inter"
          >
            Inter
          </Button>

          <Button
            color="neutral"
            variant="plain"
            sx={{
              fontFamily: "Poppins !important",
              fontWeight: 400,
              p: "6px 12px",
              width: "100px",
              justifyContent: "flex-start",
            }}
            //variant='plain'
            onClick={() => changeFont("Poppins", 400)}
            value="Poppins"
          >
            Poppins
          </Button>

          <Button
            color="neutral"
            variant="plain"
            sx={{
              fontFamily: "Oswald !important",
              fontWeight: 400,
              p: "6px 12px",
              width: "100px",
              justifyContent: "flex-start",
            }}
            //variant='plain'
            onClick={() => changeFont("Oswald", 400)}
            value="Oswald"
          >
            Oswald
          </Button>

          {/* <MenuItem
          className={classes.impact}
          onClick={() => changeFont('Impact', 400)}
          value="Impact"
        >
          Impact
        </MenuItem>
        <MenuItem
          className={classes.comicSansMS}
          onClick={() => changeFont('Comic Sans MS', 400)}
          value="Comic Sans MS"
        >
          Comic Sans MS
        </MenuItem>
        <MenuItem
          className={classes.piedra}
          onClick={() => changeFont('Piedra', 400)}
          value="Piedra"
        >
          Piedra
        </MenuItem> */}
          {/* <Button
          color="neutral"
          variant="plain"
          sx={{
            fontFamily: 'Permanent Marker',
            fontWeight: 400,
            p: '6px 12px',
            width: '100px',
            textAlign: 'left'
          }}
          //variant='plain'
          onClick={() => changeFont('Permanent Marker', 400)}
          value="Permanent Marker"
        >
          Permanent Marker
        </Button> */}

          {/* <MenuItem
          className={classes.yellowtail}
          onClick={() => changeFont('Yellowtail', 400)}
          value="Yellowtail"
        >
          Yellowtail
        </MenuItem> */}
          {/* <MenuItem
          className={classes.notoSansSC}
          onClick={() => changeFont('Noto Sans SC', 400)}
          value="Noto Sans SC"
        >
          黑体
        </MenuItem> */}
          {/* <MenuItem
          className={classes.liuJianMaoCao}
          onClick={() => changeFont('Liu Jian Mao Cao', 400)}
          value="Liu Jian Mao Cao"
        >
          草书
        </MenuItem>
        <MenuItem
          className={classes.zhiMangXing}
          onClick={() => changeFont('Zhi Mang Xing', 400)}
          value="Zhi Mang Xing"
        >
          行书
        </MenuItem> */}
          {/* <MenuItem
          className={classes.ZCOOL}
          onClick={() => changeFont('ZCOOL KuaiLe', 400)}
          value="ZCOOL KuaiLe"
        >
          快乐
        </MenuItem> */}
        </Box>
      </Popover>
    </Box>
  );
}
