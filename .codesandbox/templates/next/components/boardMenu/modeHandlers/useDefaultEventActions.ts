//**React */
import { useCallback } from 'react';

//**Functions */
import showMenu from '../../widgetMenu/ShowMenu';

//**Events */
import { EventService } from '../../../services';

//**Utils */
import EventNames from '../../../services/EventNames';

import { doubleClickToCreateStickyNote } from '../MenuStickyNote';

import {
  handleMouseWheel,
  handleShortCut,
  handleWidgetShortCut,
} from './utils';

import { BoardService } from '../../../services';

const useDefaultEventActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const windowKeyupListener = (e: KeyboardEvent) => {
    handleShortCut(e);

    handleWidgetShortCut(e);
  };

  const startDefaultListener = useCallback(() => {
    if (!canvas) return;
    // 1.设置鼠标样式为default
    canvas.defaultCursor = 'default';

    canvas.hoverCursor = 'default';

    // 2.设置选择框为true
    canvas.selection = true;

    canvas.requestRenderAll();

    // 3.绑定事件  1.键盘事件 2.鼠标双击事件 3.鼠标滚轮事件 4.选择框事件
    window.addEventListener('keyup', windowKeyupListener);

    canvas.wrapperEl.addEventListener('wheel', handleMouseWheel, true);

    EventService.getInstance().register(
      EventNames.MOUSE_DBCLICK,
      doubleClickToCreateStickyNote
    );

    EventService.getInstance().register(
      EventNames.CANVAS_SELECTION_CREATED,
      showMenu
    );

    EventService.getInstance().register(
      EventNames.CANVAS_SELECTION_UPDATED,
      showMenu
    );
  }, [canvas]);

  const endDefaultListener = useCallback(() => {
    if (!canvas) return;

    // 1.解绑事件
    if (canvas && canvas.wrapperEl) {
      window.removeEventListener('keyup', windowKeyupListener);

      EventService.getInstance().unregister(
        EventNames.MOUSE_DBCLICK,
        doubleClickToCreateStickyNote
      );

      canvas.wrapperEl.removeEventListener('wheel', handleMouseWheel, true);

      EventService.getInstance().unregister(
        EventNames.CANVAS_SELECTION_CREATED,
        showMenu
      );

      EventService.getInstance().unregister(
        EventNames.CANVAS_SELECTION_UPDATED,
        showMenu
      );
    }
  }, []);

  return {
    startDefaultListener,
    endDefaultListener,
  };
};

export default useDefaultEventActions;
