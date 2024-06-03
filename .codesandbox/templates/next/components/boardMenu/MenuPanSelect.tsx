import { Tooltip } from "@mui/joy";
import { useTranslation } from "../../services/i18n/client";
import { changeMode } from "../../redux/features/mode.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IconHandMove, IconClick } from "@tabler/icons-react";

import ListItem from "@mui/material/ListItem";

import Sheet from "@mui/joy/Sheet";
import { BoardService } from "../../services";

export default function MenuPanSelect() {
  const canvas: any = BoardService.getInstance().getBoard();
  const modeType = useSelector((state: RootState) => state.mode.type);
  const dispatch = useDispatch();
  const { t } = useTranslation("menu");
  const handleButtonClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (modeType === "pan") {
      dispatch(changeMode("default"));
      canvas.skipTargetFind = false;
      canvas.forEachObject((obj: any) => {
        obj.selectable = true;
        if (obj.editable === false) {
          obj.editable = true;
        }
      });
      canvas.requestRenderAll();
    } else {
      dispatch(changeMode("pan"));
    }
  };

  return modeType === "pan" ? (
    <Tooltip title={t("navigate")} placement="top" arrow>
      <Sheet
        sx={{
          display: "flex",
          borderRadius: "8px 0 0 0",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          mr: "16px",
        }}
      >
        <ListItem
          data-tut="reactour__pan"
          value="default"
          // className={modeType === 'pan' ? 'active':''}

          onClick={handleButtonClick}
          sx={{ borderRadius: "8px 0 0 0", p: "8px" }}
        >
          {/* <NearMeOutlinedIcon
            fontSize="medium"
            sx={{ color: 'var(--joy-palette-text-icon)' }}
          /> */}
          <IconClick
            style={{ color: "var(--joy-palette-text-icon)" }}
            fontSize="medium"
          />
        </ListItem>
      </Sheet>
    </Tooltip>
  ) : (
    <Tooltip title={t("pan")} placement="top" arrow>
      <Sheet
        sx={{
          display: "flex",
          borderRadius: "8px 0 0 0",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          mr: "16px",
        }}
      >
        <ListItem
          data-tut="reactour__pan"
          value="pan"
          onClick={handleButtonClick}
          sx={{ borderRadius: "8px 0 0 0", p: "8px" }}
        >
          {/* <PanToolOutlinedIcon  sx={{color:   'var(--joy-palette-text-icon)'}} fontSize='medium'/> */}
          <IconHandMove
            style={{ color: "var(--joy-palette-text-icon)" }}
            fontSize="medium"
          />
        </ListItem>
      </Sheet>
    </Tooltip>
  );
}
