import { useDrag } from "react-dnd";
import { BoardService } from "../../services";

export default function MenuImageDragItem({
  objType,
  isSticker,
  previewUrl,
  downloadUrl,
  width,
  handleClose,
  handleShowClose,
  margin,
}: {
  objType: string;
  isSticker: boolean;
  previewUrl: string;
  downloadUrl: string;
  width: string;
  handleClose: Function;
  handleShowClose: Function;
  margin: string;
}) {
  const handlePopoverClose = () => {
    handleShowClose();
  };
  const canvas: any = BoardService.getInstance().getBoard();
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "widget",
      item: { objType, isSticker, type: "widget" },
      end: (item, monitor) => {
        canvas.createWidgetatCurrentLocationByType(item.objType, {
          previewUrl,
          downloadUrl,
        });
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [previewUrl, downloadUrl]
  );

  const onClickItem = (e: any) => {
    canvas.createWidgetatCurrentLocationByType(objType, {
      useCenterOfScreen: true,
      previewUrl,
      downloadUrl,
      isSticker,
    });
    handlePopoverClose();
    handleClose();
  };

  return (
    <img
      draggable="true"
      onClick={onClickItem}
      //@ts-ignore
      ref={drag}
      role="widget"
      src={previewUrl}
      style={{ width, margin, cursor: "pointer" }}
    />
  );
}
