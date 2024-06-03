import { useDrag } from "react-dnd";
import { useTranslation } from "../../services/i18n/client";
import { useDispatch } from "react-redux";
import {
  updateStickNoteBackgroundColor,
  updateStickNoteType,
} from "../../redux/features/widget/stickNote";
import { changeMode } from "../../redux/features/mode.slice";
import { BoardService } from "../../services";

export const MenuStickyNoteDragItem = ({
  name,
  objType,
  color,
  noteType,
  handleClose,
}: {
  name: string;
  objType: string;
  color: string;
  noteType: string;
  handleClose: Function;
}) => {
  const dispatch = useDispatch();
  const canvas: any = BoardService.getInstance().getBoard();
  const { t } = useTranslation("menu");
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "widget",
    item: { name, objType, type: "widget" },
    end: (item, monitor) => {
      handleClose();
      canvas.createWidgetatCurrentLocationByType(item.objType, {
        color,
        noteType,
      });
      const dropResult: any = monitor.getDropResult();
      if (item && dropResult) {
        alert(
          `${t("board.filedrop.youDropped")} ${item.name} ${t(
            "board.filedrop.into"
          )} ${dropResult.name}!`
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  // const cursorNote =
  //   "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.6863 0H0.313719C0.1405 0 0 0.1405 0 0.313719V15.6863C0 15.8595 0.1405 16 0.313719 16H11.5815C11.7548 16 16 11.6732 16 11.5V0.313719C16 0.1405 15.8595 0 15.6863 0ZM13.8977 13.5L12.0252 15.3726L15.3725 12.0252L13.8977 13.5ZM11.5815 14.9288V11.5815H14.9288L11.5815 14.9288ZM15.3726 10.954H11.2677C11.0945 10.954 10.954 11.0945 10.954 11.2677V15.3725H0.627437V0.627437H15.3725L15.3726 10.954Z' fill='%23232930'/%3E%3C/svg%3E";

  const onClickItem = () => {
    // if (Date.now() - canvas.__lastClickTimeStamp < 500) return;
    // canvas.__lastClickTimeStamp = Date.now();

    console.log("dispatch stick note ", noteType, color);

    dispatch(changeMode("stickNote"));
    dispatch(updateStickNoteType(noteType));
    dispatch(updateStickNoteBackgroundColor(color));
    handleClose();
  };

  return (
    <div
      style={{
        width: "40px",
        margin: 10,
        cursor: "pointer",
        display: "inline-block",
        boxShadow: "var(--joy-shadow-md)",

        height: noteType === "rect" ? "20px" : "40px",
        marginTop: noteType === "rect" ? "30px" : "10px",
        borderRadius: noteType === "circle" ? "50%" : "0",
        background: color,
      }}
      data-testid="box-WBTitle"
      data-type={objType}
      draggable
      onClick={onClickItem}
      //@ts-ignore
      ref={drag}
      role="Box"
    />
  );
};
