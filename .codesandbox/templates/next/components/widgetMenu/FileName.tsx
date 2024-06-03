//** Import react


//** Import i18n
import { useTranslation } from "../../services/i18n/client";

import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";


export default function FileName({ fileName }: { fileName: string }) {
  const { t } = useTranslation("menu");
  return (
    <Box
      sx={{
        ".toggleButtonRoot": {
          height: "32px",
          textTransform: "none",
        },
        ".typographyRoot": {
          fontSize: "14px",
          lineHeight: "20px",
          width: "92px",
        },
      }}
    >
      <ToggleButton
        value="fileName"
        sx={{ borderWidth: "0px", p: "6px 4px" }}
        classes={{ root: "toggleButtonRoot" }}
      >
        <Typography
          sx={{ fontSize: "14px", fontWeight: 400, color: "#171A1C" }}
          noWrap
        >
          {fileName ? fileName : t("board.filedrop.fileNameError")}
        </Typography>
      </ToggleButton>
    </Box>
  );
}
