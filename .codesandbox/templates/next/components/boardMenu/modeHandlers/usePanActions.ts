//**React */
import { useCallback, useRef } from 'react';

//**Redux store */
import store from '../../../redux/store';
import {
  handleSetWidgetMenuList,
  handleWidgetMenuDisplay,
} from '../../../redux/features/board.slice';

//**utils */
import useCommonActions from './useCommonActions';
import showMenu from '../../widgetMenu/ShowMenu';

import { BoardService } from '../../../services';

const usePanActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const { handleCommonBefore, handleCommonAfter } = useCommonActions();

  const active: any = useRef(null);

  const handlePanBefore = useCallback(() => {
    if (!canvas) return;

    handleCommonBefore();

    canvas.defaultCursor = 'grab';

    canvas.hoverCursor = 'grab';

    const activeObj = canvas.getActiveObject();

    if (activeObj && activeObj.isEditing) {
      activeObj.exitEditing();
    }

    canvas.discardActiveObject();

    canvas.lockObjectsInCanvas();

    canvas.skipTargetFind = true;

    canvas.forEachObject((obj: any) => {
      obj.selectable = false;
    });

    canvas.selection = false;

    canvas.requestRenderAll();
  }, [canvas]);

  const handlePaning = useCallback(
    (e: MouseEvent) => {
      if (!e.movementX) return;

      const movePosition = { x: e.movementX, y: e.movementY };

      const users: any = store.getState().user.onlineUsers;

      if (store.getState().board.followMe && users.length - 1 > 0) {
        canvas.updateViewport();
      }

      canvas.relativePan(movePosition);

      canvas.setCursor('grab');

      canvas.defaultCursor = 'grab';

      canvas.hoverCursor = 'move';

      canvas.requestRenderAll();
    },
    [canvas]
  );

  const handlePanAfter = () => {
    canvas.unlockObjectsInCanvas();

    canvas.skipTargetFind = false;

    canvas.forEachObject((obj: any) => {
      obj.selectable = true;
    });

    handleCommonAfter();
  };

  const handlePanMouseDown = (lock: boolean = true) => {
    lock && handlePanBefore();

    const currentActive = canvas.getActiveObject();

    if (currentActive) {
      store.dispatch(handleSetWidgetMenuList([]));

      store.dispatch(handleWidgetMenuDisplay(false));

      // 保存当前激活状态widget。
      active.current = currentActive;
    }

    canvas.setCursor('grab');

    canvas.defaultCursor = 'grab';

    canvas.hoverCursor = 'move';
  };

  const handlePanMouseUp = (lock: boolean = true) => {
    lock && handlePanAfter();

    canvas.setCursor('grab');

    canvas.defaultCursor = 'grab';

    canvas.hoverCursor = 'move';

    if (active.current) {
      showMenu(canvas);

      store.dispatch(handleWidgetMenuDisplay(true));
    }
  };

  return {
    handlePanMouseDown,
    handlePanMouseUp,
    handlePanBefore,
    handlePanAfter,
    handlePaning,
  };
};

export default usePanActions;
