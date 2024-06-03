import { useTranslation } from "../../services/i18n/client";
import { Tooltip } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../redux/features/mode.slice";
import { RootState } from "../../redux/store";

import ListItemButton from "@mui/joy/ListItemButton";
import { IconLetterT } from "@tabler/icons-react";
export default function MenuText() {
  const dispatch = useDispatch();
  const modeType = useSelector((state: RootState) => state.mode.type);
  const { t } = useTranslation("menu");
  const handleClick = () => {
    dispatch(changeMode("text"));
  };

  return (
    <Tooltip arrow placement="top" title={t("menuTitleText")}>
      <ListItemButton
        selected={modeType === "text"}
        id="textBtn"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          p: "8px",
          mr: "16px",
          borderWidth: "0px",
          borderRadius: "6px",
          backgroundColor:
            modeType === "text"
              ? "var(--joy-palette-primary-100) !important"
              : null,
          svg: {
            color:
              modeType === "text"
                ? "var(--joy-palette-primary-500)"
                : "var(--joy-palette-neutral-500)",
          },
        }}
        onClick={handleClick}
      >
        <IconLetterT style={{ strokeWidth: "var(--joy-lineHeight-sm" }} />
      </ListItemButton>
    </Tooltip>
  );
}
