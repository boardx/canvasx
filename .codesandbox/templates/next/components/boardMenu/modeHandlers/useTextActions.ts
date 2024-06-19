//**Fabric */
import * as fabric from '../../../../../../fabric';

//**Redux store */
import store from '../../../redux/store';
import { changeMode } from '../../../redux/features/mode.slice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { handleSetMenuFontWeight } from '../../../redux/features/widgets.slice';

//**Services */
import { UtilityService, WidgetService } from '../../../services';
import { BoardService } from '../../../services';

const createTextFunc = (position: any) => {
  const options = {
    angle: 0,
    width: 250,
    height: 138,
    scaleX: 1,
    scaleY: 1,
    left: position.x + 125,
    top: position.y,
    selectable: true,
    fill: '#333333',
    stroke: '#BDBDBD',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    strokeWidth: 0,
    objType: 'XTextbox',
    userid: store.getState().user.userInfo.userId,
    whiteboardId: store.getState().board.board.id,
    timestamp: Date.now(),
    zIndex: Date.now() * 100,
    isPanel: false,
    lockMovementX: false,
    lockMovementY: false,
    fontFamily: 'Inter',
    originX: 'center',
    originY: 'center',
    fontSize: 20,
    fontWeight: 400,
    id: UtilityService.getInstance().generateWidgetID(),
    verticalAlign: 'top',
    oneLine: true,
  };

  return new fabric.XTextbox('', options);
};

const useTextActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const dispatch = useDispatch();

  // This function changes the canvas cursor to 'text' (from 'default') when the pointer using 'hover' action is performed before creating the Text.
  const handleTextBefore = useCallback(() => {
    const canvas = BoardService.getInstance().getBoard();
    //set the default cursor to 'text'
    canvas.defaultCursor = 'text';

    //set the hover cursor to 'text'
    canvas.hoverCursor = 'text';

    // It forces a re-render of canvas to apply the new cursor changes.
    canvas.requestRenderAll();
  }, [canvas]);

  // This function is used to handle the event when user releases the mouse button after dragging to create the Text on the canvas.
  const handleTextMouseUp = useCallback(
    (e: any) => {
      // it creates a new text object at the coordinates specified by the pointer
      const instance: any = createTextFunc(e.scenePoint);

      // it adds the created text object to the canvas.
      canvas.add(instance);

      // it sets the created text object as the active object on the canvas.
      canvas.setActiveObject(instance);

      // it opens the text object for editing.
      instance.enterEditing();

      // it gets the fabric object from the created text object
      const objs = instance.getObject();

      // unlock the movement of the text object along x and y directions.
      objs.lockMovementX = false;
      objs.lockMovementY = false;

      // allow the text object to be selected.
      objs.selectable = true;

      // dispatchs the redux action to set the font weight of the menu to that of the created text object.
      store.dispatch(handleSetMenuFontWeight(objs.fontWeight));

      // calls the insertWidget method of WidgetService to insert a new widget.
      WidgetService.getInstance().insertWidget(objs);

      // // push a new state entry to the history stack of canvas for allowing undo/redo functionality.
      // canvas.pushNewState([
      //   {
      //     targetId: instance.id,
      //     activeselection: true,
      //     newState: objs,
      //     action: 'ADDED',
      //   },
      // ]);

      // dispatches the redux action to change the mode to 'default' from 'text'.
      dispatch(changeMode('default'));

      // re-render the canvas to reflect the changes made on the canvas.
      canvas.requestRenderAll();
    },
    [canvas]
  );

  // This function changes the canvas cursor back to 'default' (from 'text') when the pointer action is performed after creating the Text.
  const handleTextAfter = useCallback(() => {
    const canvas = BoardService.getInstance().getBoard();
    //set the default cursor to 'default'
    canvas.defaultCursor = 'default';

    //set the hover cursor to 'default'
    canvas.hoverCursor = 'default';

    // re-render the canvas to reflect the changes made on the canvas.
    canvas.requestRenderAll();
  }, []);

  return {
    handleTextMouseUp,
    handleTextBefore,
    handleTextAfter,
  };
};

export default useTextActions;
