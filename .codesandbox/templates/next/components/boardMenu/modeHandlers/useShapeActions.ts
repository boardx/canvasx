//**Fabric */

//**Redux store */
import store, { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../redux/features/mode.slice';
import { handleSetMenuFontWeight } from '../../../redux/features/widgets.slice';

//**Services */

//**utils */
import {
  calcDimension,
  calcDirection,
  calcDistance,
  createShapeNote,
} from '../events';

import useCommonActions from './useCommonActions';
import { BoardService } from '../../../services';

const useShapeActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  const { handleCommonBefore, handleCommonAfter } = useCommonActions();

  const shapeType = useSelector((state: RootState) => state.widget.shape.type);

  const dispatch = useDispatch();

  let instance: any = null;

  let startPoint: any = null;

  const handleShapeBefore = () => {
    if (!canvas) return;

    handleCommonBefore();

    canvas.discardActiveObject();

    canvas.defaultCursor = 'crosshair';

    canvas.hoverCursor = 'crosshair';

    canvas.selection = false;

    canvas.requestRenderAll();
  };

  const handleShapeAfter = () => {
    handleCommonAfter();
  };

  const handleShapeMouseDown = (e: any) => {
    if (!canvas) return;

    startPoint = e.scenePoint;

    instance = createShapeNote(startPoint, shapeType);

    instance.fontFamily = 'Inter';

    instance.fontSize = 26;

    instance.fontWeight = 400;

    instance.strokeWidth = 0;

    instance.objType = 'XShapeNotes';

    instance.fill = '#000';

    instance.stroke = '#BDBDBD';

    instance.backgroundColor = '#FFFFFF';

    instance.fixedLineWidth = 2;

    instance.lineWidth = 2;

    instance.strokeWidth = 0.2;

    instance.lockMovementX = false;

    instance.lockMovementY = false;

    instance.selectable = true;

    instance.locked = false;

    instance.lockUniScaling = true;

    instance.isFirst = true;

    instance.selectable = true;

    canvas.requestRenderAll();
  };

  const handleShapeMouseMove = (e: any) => {
    if (!canvas) return;

    if (instance.isFirst) {
      delete instance.isFirst;

      canvas.add(instance);

      canvas.requestRenderAll();
    }

    const { width, height } = calcDimension(startPoint, e.scenePoint);

    const { x, y } = calcDirection(startPoint, e.scenePoint);

    instance.width = Math.abs(width);

    instance.height = Math.abs(height);

    instance.maxHeight = Math.abs(height);

    instance.originX = x;

    instance.originY = y;

    instance.dirty = true;

    canvas.requestRenderAll();
  };

  const handleShapeMouseUp = (e: any) => {
    if (calcDistance(startPoint, e.pointer) < 5) {
      canvas.remove(instance);

      dispatch(changeMode('default'));

      return;
    }

    instance.left +=
      instance.originX === 'left'
        ? instance.width / 2
        : (-1 * instance.width) / 2;

    instance.top +=
      instance.originY === 'top'
        ? instance.height / 2
        : (-1 * instance.height) / 2;

    instance.originX = 'center';

    instance.originY = 'center';

    instance.dirty = true;

    instance.setCoords();

    store.dispatch(handleSetMenuFontWeight('normal'));

    // WidgetService.getInstance().insertWidget(instance.getObject());

    // canvas.pushNewState([
    //   {
    //     targetId: instance.id,
    //     activeselection: true,
    //     newState: instance.getObject(),
    //     action: 'ADDED',
    //   },
    // ]);

    canvas.setActiveObject(instance);

    canvas.requestRenderAll();
    canvas.unlockObjectsInCanvas();
    dispatch(changeMode('default'));
  };

  return {
    handleShapeMouseDown,
    handleShapeMouseMove,
    handleShapeMouseUp,
    handleShapeBefore,
    handleShapeAfter,
  };
};

export default useShapeActions;
