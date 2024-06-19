//**React */
import { useCallback } from 'react';

//**Utils */
import { getEraserCursor } from './utils';

import { BoardService } from '../../../services';

const useEraserActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const handleEraseBefore = useCallback(() => {
    if (!canvas) return;

    // 1.设置选择框为false
    canvas.selection = false;

    // 3.关闭画笔模式

    // 4.设置鼠标样式为橡皮擦
    canvas.hoverCursor = getEraserCursor();

    canvas.defaultCursor = getEraserCursor();

    canvas.isDrawingMode = false;

    // 4.设置鼠标样式为橡皮擦
    canvas.hoverCursor = getEraserCursor();

    canvas.defaultCursor = getEraserCursor();
    let objs = canvas.getObjects();
    if (objs && objs.length > 0) {
      objs.forEach((obj: any) => {
        if (obj.type !== 'path') {
          obj.selectable = false;
          if (obj.objType === 'XConnector') {
            obj.hasControls = false;
          }
        } else {
          obj.hasControls = false;
          obj.hasBorders = false;
        }
      });
    }
    canvas.requestRenderAll();
  }, [canvas]);

  const handleEraseAfter = useCallback(() => {
    if (!canvas) return;
    let objs = canvas.getObjects();
    if (objs && objs.length > 0) {
      objs.forEach((obj: any) => {
        if (obj.type !== 'path') {
          obj.selectable = true;
          if (obj.objType === 'XConnector') {
            obj.hasControls = false;
          }
        } else {
          obj.hasControls = true;
          obj.hasBorders = true;
        }
      });
    }
    canvas.requestRenderAll();
  }, [canvas]);

  const handleClearPath = useCallback(
    (e: any) => {
      if (!(e.target && e.target.type === 'path')) {
        canvas.discardActiveObject();
        return;
      }

      canvas.removeWidget(e.target);
      canvas.requestRenderAll();
    },
    [canvas]
  );

  return {
    handleClearPath,
    handleEraseBefore,
    handleEraseAfter,
  };
};

export default useEraserActions;
