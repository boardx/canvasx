//** Import events
import { mouseWheelListener } from '../events';

//** Import Redux toolkit
import store from '../../../redux/store';
import { changeMode } from '../../../redux/features/mode.slice';
import { updateShapeType } from '../../../redux/features/widget/shape';

//** Import svgs

import { getCursorBrush } from '../../svg/cursorBrush';

import { eraser as cursorEraserSvg } from '../../svg/cursorEraser';
import { BoardService } from '../../../services';

export const syncMousePosition = (e: MouseEvent) => {
  const canvas: any = BoardService.getInstance().getBoard();
  canvas.mouse.e = e;

  canvas.mouse.delta.x = e.movementX;

  canvas.mouse.delta.y = e.movementY;

  canvas.updateViewportToLocalStorage(canvas.viewportTransform);
};

export function handleMouseWheel(e: MouseEvent) {
  e.preventDefault();

  e.stopPropagation();

  mouseWheelListener(e);

  return false;
}

function handleDelete(e: any) {
  const canvas: any = BoardService.getInstance().getBoard();
  if (e.target && e.target.tagName && e.target.tagName !== 'BODY') return;

  const target = canvas.getActiveObject();

  if (!target || target.isEditing) return;

  if (target.isPanel && target.subIdList() && target.subIdList().length > 0) {
    canvas.deleteBindingPanel(target);
  } else {
    canvas.removeWidget(target);
  }
}

export function handleEsc(e: KeyboardEvent) {
  const canvas: any = BoardService.getInstance().getBoard();
  if (e.key !== 'Escape') return;

  canvas.discardActiveObject();

  store.dispatch(changeMode('default'));
}

export function handleWidgetShortCut(e: any) {
  e.preventDefault();

  e.stopPropagation();
  const canvas: any = BoardService.getInstance().getBoard();
  if (e.target.tagName !== 'BODY') return;

  if (!window.location.pathname.startsWith('/board')) return;

  if (store.getState().mode.type === 'feedback') return;

  if (canvas.getActiveObject()) return;

  const isMac = !!navigator.userAgent.match(/Macintosh/);

  if ((isMac && e.metaKey) || e.ctrlKey || e.shiftKey) return false;

  const currentMode = store.getState().mode.type;

  if (currentMode !== 'createTemplate') {
    switch (e.key) {
      case 'l':
      case 'L':
        store.dispatch(changeMode('line'));
        break;
      case 'r':
      case 'R':
        store.dispatch(updateShapeType(0));
        store.dispatch(changeMode('shapeNote'));
        break;
      case 'p':
      case 'P':
        store.dispatch(changeMode('draw'));
        break;
      case 'o':
      case 'O':
        store.dispatch(updateShapeType(3));
        store.dispatch(changeMode('shapeNote'));
        break;
      case 's':
      case 'S':
        store.dispatch(changeMode('stickNote'));
        break;
      case 't':
      case 'T':
        store.dispatch(changeMode('text'));
        break;
      default:
        break;
    }
  }

  return false;
}

export function handleShortCut(e: KeyboardEvent) {
  e.preventDefault();

  e.stopPropagation();

  if (!window.location.pathname.startsWith('/board')) return;

  const isMac = !!navigator.userAgent.match(/Macintosh/);

  if ((isMac && e.metaKey) || e.ctrlKey || e.shiftKey) return false;

  switch (e.key) {
    case 'Escape':
      handleEsc(e);
      break;

    case 'Backspace':

    case 'Delete':
      handleDelete(e);
      break;

    default:
      break;
  }

  return false;
}

export const getBrushCursorWithColor = (color: any) => {
  //@ts-ignore
  let colorNow = document.cookie['cursor_color_now']
    ? //@ts-ignore
      document.cookie['cursor_color_now']
    : '';
  //@ts-ignore
  let cursorPen = document.cookie['base64_string']
    ? //@ts-ignore
      document.cookie['base64_string']
    : '';

  if (!cursorPen || colorNow != color) {
    cursorPen = getCursorBrush(color);
  }

  return `url("${cursorPen}") 0 24, auto`;
};

export const getEraserCursor = () => {
  const cursorPen = cursorEraserSvg;

  return `url("${cursorPen}") 0 0, auto`;
};

export const inActiveSelection = (activeSelection: any, object: any) => {
  let selection = {
    x2:
      activeSelection.x1 < activeSelection.x2
        ? activeSelection.x1
        : activeSelection.x2,
    x1:
      activeSelection.x1 > activeSelection.x2
        ? activeSelection.x1
        : activeSelection.x2,
    y2:
      activeSelection.y1 < activeSelection.y2
        ? activeSelection.y1
        : activeSelection.y2,
    y1:
      activeSelection.y1 > activeSelection.y2
        ? activeSelection.y1
        : activeSelection.y2,
  };

  //判断object的tl在范围内
  if (
    selection.x2 < object.aCoords.tl.x &&
    selection.x1 > object.aCoords.tl.x &&
    selection.y2 < object.aCoords.tl.y &&
    selection.y1 > object.aCoords.tl.y
  ) {
    return true;
  }

  //判断object的tr在范围内
  else if (
    selection.x2 < object.aCoords.tr.x &&
    selection.x1 > object.aCoords.tr.x &&
    selection.y2 < object.aCoords.tr.y &&
    selection.y1 > object.aCoords.tr.y
  ) {
    return true;
  }

  //判断object的bl在范围内
  else if (
    selection.x2 < object.aCoords.bl.x &&
    selection.x1 > object.aCoords.bl.x &&
    selection.y2 < object.aCoords.bl.y &&
    selection.y1 > object.aCoords.bl.y
  ) {
    return true;
  }

  //判断object的br在范围内
  else if (
    selection.x2 < object.aCoords.br.x &&
    selection.x1 > object.aCoords.br.x &&
    selection.y2 < object.aCoords.br.y &&
    selection.y1 > object.aCoords.br.y
  ) {
    return true;
  } else {
    return false;
  }
};
