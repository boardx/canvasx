import { MenuItem, Popover } from "@mui/material";
//@ts-ignore
import { CirclePicker } from "react-color";
import {
  SmallNoteSvg,
  LagerNoteSvg,
  CircleNoteSvg,
} from "../../svg/widgetToolBarMenuSvg";
import { NoteType } from "../../../definition/widget/widgetType";
// import { updateStickNoteInfo } from '../../../redux/features/widget/stickNote'; //there has an error
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { stickyNoteColorSeriesOne } from "../../../utils/stickynoteColor";

const StickyNotes = (props: any) => {
  const noteColors = ["#FCEC8A", ...stickyNoteColorSeriesOne.slice(0, 7)];

  const { anchorEl, setAnchorEl } = props;
  const backgroundColor = useSelector(
    (state: RootState) => state.widget.stickNote.backgroundColor
  );
  const noteType = useSelector(
    (state: RootState) => state.widget.stickNote.noteType
  );

  const [defaultColor, selectedColor] = ["#B8B8B8", "#354858"];
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: any) => {
    // dispatch(
    //   updateStickNoteInfo([
    //     {
    //       key: "backgroundColor",
    //       value: color.hex,
    //     },
    //   ])
    // );

    handleClose();
  };

  const handleNoteTypeChange = (type: any) => {
    // dispatch(
    //   updateStickNoteInfo([
    //     {
    //       key: "objType",
    //       value:
    //         type === NoteType.CIRCLE
    //           ? WidgetType.XCircleNotes
    //           : WidgetType.XRectNotes,
    //     },
    //     {
    //       key: "noteType",
    //       value: type,
    //     },
    //   ])
    // );

    handleClose();
  };

  return (
    <Popover
      id="sticky-notes-popover"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      transformOrigin={{ vertical: 70, horizontal: 180 }}
      sx={{ ml: 2, zIndex: 0 }}
    >
      <div style={{ display: "flex", overflow: "hidden" }}>
        <MenuItem
          style={{ paddingLeft: "8px", paddingRight: "8px" }}
          onClick={() => {
            handleNoteTypeChange(NoteType.RECT);
          }}
        >
          <LagerNoteSvg
            color={noteType === NoteType.RECT ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem
          style={{ paddingRight: "8px" }}
          onClick={() => {
            handleNoteTypeChange(NoteType.SQUARE);
          }}
        >
          <SmallNoteSvg
            color={noteType === NoteType.SQUARE ? selectedColor : defaultColor}
          />
        </MenuItem>

        <MenuItem
          style={{ paddingLeft: "8px" }}
          onClick={() => {
            handleNoteTypeChange(NoteType.CIRCLE);
          }}
        >
          <CircleNoteSvg
            color={noteType === NoteType.CIRCLE ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem style={{ paddingLeft: 0, paddingRight: 0 }}>
          <img
            src="/images/board/line.png"
            alt=""
            style={{ width: "0.5px", height: "1.5rem" }}
          />
        </MenuItem>
        <MenuItem
          style={{ paddingLeft: "16px", paddingRight: 0 }}
          sx={{
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <CirclePicker
            circleSize={25}
            color={backgroundColor}
            colors={noteColors}
            width={"330px"}
          // onChange={(color) => handleColorChange(color)}
          ></CirclePicker>
        </MenuItem>
      </div>
    </Popover>
  );
};

export default StickyNotes;
