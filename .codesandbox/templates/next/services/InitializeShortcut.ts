//use fabric for canvas

//redux store query
import store from '../redux/store';
import { changeMode } from '../redux/features/mode.slice';
import { updateStickyNoteMenuBarOpenStatus } from '../redux/features/widget/stickNote';
import {
  handleSetZoomFactor,
  handleSetIsPanMode,
  handleSetConnectorMode,
  handleSetArrowMode,
  handleSetDrawToCreateWidget,
} from '../redux/features/board.slice';

//services
import { WidgetService, EventService, DrawingService } from '../services';
import EventNames from '../services/EventNames';

//functions
import showMenu from '../components/widgetMenu/ShowMenu';
// import '../../widgets';

let firstkeyDownAt = 0;
let lastkeyUpAt = 0;
let firstKeyDown = true;

let canvas: any = null;

export const bindEvents = (canvasInstance: any) => {
  canvas = canvasInstance;
  // Register event for key down in the document
  EventService.getInstance().register(
    EventNames.DOCUMENT_KEY_DOWN,
    onDocumentKeydownListener
  );

  // Register event for 'F' key down
  EventService.getInstance().register(
    EventNames.F_KEY_DOWN,
    onKeyFDownDrawPanel
  );

  // Register event for 'Z + Ctrl' key down for undo
  EventService.getInstance().register(
    EventNames.Z_CTRL_KEY_DOWN,
    onKeyZCtrlDownUndo
  );

  // Register event for 'Z + Ctrl + Shift' key down for redo
  EventService.getInstance().register(
    EventNames.Z_CTRL_SHIFT_KEY_DOWN,
    onKeyZCtrlShiftDownRedo
  );

  // Register event for 'L' key down to draw line
  EventService.getInstance().register(
    EventNames.L_KEY_DOWN,
    onKeyLDownDrawLine
  );

  // Register event for 'Space' key down
  EventService.getInstance().register(
    EventNames.SPACE_KEY_DOWN,
    onKeySpaceDown
  );

  // Register event for 'Ctrl + Shift + 5' key down to take screenshot
  EventService.getInstance().register(
    EventNames.CTRL_SHIFT_FIVE_KEY_DOWN,
    onKeyCtrlShiftFiveDownScreenShot
  );

  // Register event for 'A + Ctrl' key down
  EventService.getInstance().register(
    EventNames.A_CTRL_KEY_DOWN,
    onKeyACtrlDown
  );

  // Register event for 'B + Ctrl' key down to bold font
  EventService.getInstance().register(
    EventNames.B_CTRL_KEY_DOWN,
    onKeyBCtrlDownBoldFont
  );

  // Register event for 'G + Ctrl + Shift' key down to ungroup
  EventService.getInstance().register(
    EventNames.G_CTRL_SHIFT_KEY_DOWN,
    onKeyGCtrlShiftUngroup
  );

  // Register event for 'G + Ctrl' key down to group
  EventService.getInstance().register(
    EventNames.G_CTRL_KEY_DOWN,
    onKeyGCtrlGroup
  );

  // Register event for 'Ctrl + +' key down to zoom in
  EventService.getInstance().register(
    EventNames.CTRL_PLUS_KEY_DOWN,
    onKeyCtrlPlusZoomIn
  );

  // Register event for 'Ctrl + -' key down to zoom out
  EventService.getInstance().register(
    EventNames.CTRL_MINUS_KEY_DOWN,
    onKeyCtrlMinusZoomOut
  );

  // Register event for 'Ctrl + 0' key down to zoom to center
  EventService.getInstance().register(
    EventNames.CTRL_ZERO_KEY_DOWN,
    onKeyCtrlZeroZoomToCenter
  );

  // Register event for 'D + Ctrl' key down to duplicate
  EventService.getInstance().register(
    EventNames.D_CTRL_KEY_DOWN,
    onKeyDCtrlDuplicate
  );

  // Register event for 'Delete' key down
  EventService.getInstance().register(EventNames.DELETE_KEY_DOWN, onKeyDelete);

  // Register event for 'Up, Down, Left, Right' key down to move
  EventService.getInstance().register(
    EventNames.UP_DOWN_LEFT_RIGHT_KEY_DOWN,
    onKeyUpDownLeftRightDownMove
  );

  // Register event for key up in the document
  EventService.getInstance().register(
    EventNames.DOCUMENT_KEY_UP,
    onDocumentKeyupListener
  );

  // Register event for 'Z + Ctrl' key up
  EventService.getInstance().register(
    EventNames.Z_CTRL_KEY_UP,
    onKeyZCtrlUpUndo
  );

  // Register event for 'Z + Ctrl + Shift' key up
  EventService.getInstance().register(
    EventNames.Z_CTRL_SHIFT_KEY_UP,
    onKeyZCtrlShiftUpRedo
  );

  // Register event for 'Space' key up
  EventService.getInstance().register(EventNames.SPACE_KEY_UP, onKeySpaceUp);
};

export const KeyCode = {
  //Add KeyCode here
  Space: 32,
  ControlShiftFive: 53,
  Up: 38,
  Down: 40,
  Left: 37,
  Right: 39,
  Shift: 16,
  ESC: 27,
  CtrlZ: 90,
  CtrlA: 65,
  CtrlB: 66,
  CtrlG: 71,
  CtrlPlus: 187,
  CtrlMinus: 189,
  CtrlZero: 48,
  CtrlD: 68,
  Delete: 46,
  Backspace: 8,
  F: 70,
  L: 76,
  O: 79,
  R: 82,
  S: 83,
  T: 84,
  P: 80,
  Slash: 191,
  Enter: 13,
};

function onDocumentKeydownListener(e: any) {
  const d = e.srcElement || e.target;
  const object = canvas && canvas.getActiveObject();

  // The execution of this function will set setDrawingMode to false,
  // which will exit painting mode when using the undo shortcut。
  // BoardService.getInstance().resetBoardMenuEvents();

  if (!canvas) return; // if canvas is not exist, disable all shortcut
  // if (store.getState().board.showLexical) return; // if show lexical editor, disable all shortcut
  if (
    d.tagName.toUpperCase() === 'INPUT' ||
    d.tagName.toUpperCase() === 'TEXTAREA'
  ) {
    return;
  } // if focus on input or textarea, disable all shortcut

  if (
    object &&
    (object.obj_type === 'WBRectNotes' ||
      object.obj_type === 'WBCircleNotes' ||
      (object.obj_type === 'WBShapeNotes' && !object.isPanel)) &&
    e.keyCode >= 65 &&
    e.keyCode <= 90 &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.shiftKey &&
    !canvas.drawTempWidget
  ) {
    object.enterEditing();
  }

  if (e.keyCode === KeyCode.Space) {
    EventService.getInstance().trigger(EventNames.SPACE_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.ControlShiftFive) {
    EventService.getInstance().trigger(EventNames.CTRL_SHIFT_FIVE_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.ESC) {
    EventService.getInstance().trigger(EventNames.ESC_KEY_DOWN, e);
    store.dispatch(updateStickyNoteMenuBarOpenStatus(false));
  }

  if (e.keyCode === KeyCode.CtrlA) {
    EventService.getInstance().trigger(EventNames.A_CTRL_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlB) {
    EventService.getInstance().trigger(EventNames.B_CTRL_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlD) {
    EventService.getInstance().trigger(EventNames.D_CTRL_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlG && e.shiftKey) {
    EventService.getInstance().trigger(EventNames.G_CTRL_SHIFT_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlG && !e.shiftKey) {
    EventService.getInstance().trigger(EventNames.G_CTRL_KEY_DOWN, e);
  }

  // if (e.keyCode === KeyCode.S) {
  //   BoardService.getInstance().resetBoardMenuEvents();
  //   EventService.getInstance().trigger(EventNames.S_KEY_DOWN, e);
  // }

  // if (e.keyCode === KeyCode.R) {
  //   BoardService.getInstance().resetBoardMenuEvents();
  //   EventService.getInstance().trigger(EventNames.R_KEY_DOWN, e);
  // }

  // if (e.keyCode === KeyCode.F) { // unknow this code will be use or not;
  // BoardService.getInstance().resetBoardMenuEvents();
  // EventService.getInstance().trigger(EventNames.F_KEY_DOWN, e);
  // }

  // if (e.keyCode === KeyCode.O) {
  //   BoardService.getInstance().resetBoardMenuEvents();
  //   EventService.getInstance().trigger(EventNames.O_KEY_DOWN, e);
  // }

  // if (e.keyCode === KeyCode.T) {
  //   BoardService.getInstance().resetBoardMenuEvents();
  //   EventService.getInstance().trigger(EventNames.T_KEY_DOWN, e);
  // }

  // todo: disposal code
  // if (e.keyCode === KeyCode.P) {
  //   BoardService.getInstance().resetBoardMenuEvents();
  //   EventService.getInstance().trigger(EventNames.P_KEY_DOWN, e);
  // }

  if (e.keyCode === KeyCode.L) {
    EventService.getInstance().trigger(EventNames.L_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlZ && !e.shiftKey) {
    EventService.getInstance().trigger(EventNames.Z_CTRL_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlZ && e.shiftKey) {
    EventService.getInstance().trigger(EventNames.Z_CTRL_SHIFT_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlPlus) {
    EventService.getInstance().trigger(EventNames.CTRL_PLUS_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlMinus) {
    EventService.getInstance().trigger(EventNames.CTRL_MINUS_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.CtrlZero) {
    EventService.getInstance().trigger(EventNames.CTRL_ZERO_KEY_DOWN, e);
  }

  if (e.keyCode === KeyCode.Shift) {
    EventService.getInstance().trigger(EventNames.SHIFT_KEY_DOWN, e);
  }

  // if (e.keyCode === KeyCode.Backspace || e.keyCode === KeyCode.Delete) {
  //   EventService.getInstance().trigger(EventNames.DELETE_KEY_DOWN, e);
  // }

  if (e.keyCode >= KeyCode.Left && e.keyCode <= KeyCode.Down) {
    EventService.getInstance().trigger(
      EventNames.UP_DOWN_LEFT_RIGHT_KEY_DOWN,
      e
    );
  }

  if (e.shiftKey && e.keyCode === KeyCode.Slash) {
    EventService.getInstance().trigger(EventNames.SLASH_SHIFT_KEY_DOWN, e);
  }
}

function onDocumentKeyupListener(e: any) {
  // Store the event target (the element which triggered the event) in a constant named 'd'
  const d = e.target;
  // If the event target is an input or a textarea element, then do not execute the rest of the function
  // Check by converting the target's tag name into uppercase
  if (
    d.tagName.toUpperCase() === 'INPUT' ||
    d.tagName.toUpperCase() === 'TEXTAREA'
  ) {
    return;
  }

  // List of commented out possible key event triggers.
  // Each conditional checks if the event's keyCode matches the assigned code for specific keys like 'S', 'O', 'R', 'F', 'L'.
  // If there's a match, it will then trigger a specific event using 'EventService' service instance.

  // If the key released is a Control + Z combination and the Shift key is NOT being pressed
  if (e.keyCode === KeyCode.CtrlZ && !e.shiftKey) {
    // Trigger a specific event 'Z_CTRL_KEY_UP' using 'EventService' service instance
    EventService.getInstance().trigger(EventNames.Z_CTRL_KEY_UP, e);
  }

  // If the key released is a Control + Z combination and the Shift key is also being pressed
  if (e.keyCode === KeyCode.CtrlZ && e.shiftKey) {
    // Trigger a specific event 'Z_CTRL_SHIFT_KEY_UP' using 'EventService' service instance
    EventService.getInstance().trigger(EventNames.Z_CTRL_SHIFT_KEY_UP, e);
  }

  // If the key released is the Shift key
  if (e.keyCode === KeyCode.Shift) {
    // Trigger a specific event 'SHIFT_KEY_UP' using 'EventService' service instance
    EventService.getInstance().trigger(EventNames.SHIFT_KEY_UP, e);
  }

  // If the key released is the Space bar
  if (e.keyCode === KeyCode.Space) {
    // Trigger a specific event 'SPACE_KEY_UP' using 'EventService' service instance
    EventService.getInstance().trigger(EventNames.SPACE_KEY_UP, e);
  }
}

function DrawToCreateMouseUpListener(e: any) {
  // If the temporary drawing widget does not exist, exit function
  if (!canvas.drawTempWidget) return;

  // Get the object properties of the temporary drawing widget
  const toCreateWidget = canvas.drawTempWidget.getObject();

  // Use the widget service to insert the widget into the canvas
  WidgetService.getInstance().insertWidget(toCreateWidget);

  // Update the coordinates of the temporary drawing widget in the canvas
  canvas.drawTempWidget.setCoords();

  // Create a new state for the undo/redo functionality after the widget is added
  const newState = canvas
    .findById(toCreateWidget._id)
    .getUndoRedoState('ADDED');

  // Add the new state to the undo/redo stack in the canvas
  canvas.pushNewState(newState);

  // Make the newly added widget the active object in the canvas
  canvas.setActiveObject(canvas.drawTempWidget);

  // Cancel the drawing function, allowing the user to create new widgets without having to re-select the tool
  cancelDrawToCreateWidget(false);
}

function DrawToCreateMouseMoveListener(e: any) {
  // Retrieve the starting position of the drawing
  const startPosition = canvas.drawStartPosition;

  // Calculate the x position on the canvas based off the client e (mouse event) x coordinate
  const x = canvas.getPositionOnCanvas(e.e.clientX, e.e.clientY).left;

  // Calculate the y position on the canvas based off the client e (mouse event) y coordinate
  const y = canvas.getPositionOnCanvas(e.e.clientX, e.e.clientY).top;

  // Combine the x and y coordinates into a single object representing the current position
  const currentPosition = { x, y };

  // Instantiate the drawing service and call the function to create a new widget
  // The function is passed the start position, current position, and the canvas object
  DrawingService.getInstance().drawToCreateWidget(
    startPosition,
    currentPosition,
    canvas
  );
}

function DrawToCreateMouseDownListener(e: any) {
  // Register the MouseUp event listener through the event service
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_UP,
    DrawToCreateMouseUpListener
  );

  // Register the MouseMove event listener through the event service
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_MOVE,
    DrawToCreateMouseMoveListener
  );

  // If there's a widget to be drawn on the board according to the global application state
  if (store.getState().board.drawToCreateWidget) {
    // Calculate the x position on the canvas based on the offset x coordinate of the mouse event
    const x = canvas.getPositionOnCanvas(e.e.offsetX, e.e.offsetY).left;

    // Calculate the y position on the canvas based on the offset y coordinate of the mouse event
    const y = canvas.getPositionOnCanvas(e.e.offsetX, e.e.offsetY).top;

    // Save the starting position for the drawing on the canvas
    canvas.drawStartPosition = { x, y };

    // If the widget to be drawn is a 'WBText'
    if (store.getState().board.drawToCreateWidget === 'WBText') {
      // Use the drawing service to draw a 'WBText' on the canvas
      DrawingService.getInstance().drawWBText(canvas);

      // Cancel the drawing state of the widget, stopping further 'WBText' from being drawn until reselected
      cancelDrawToCreateWidget(false);
    }

    // If the widget to be drawn is a 'WBRectNotes'
    if (store.getState().board.drawToCreateWidget === 'WBRectNotes') {
      // Use the drawing service to draw 'WBRectNotes' on the canvas
      DrawingService.getInstance().drawWBRectNotes(canvas);

      // Cancel the drawing state of the widget, stopping further 'WBRectNotes' from being drawn until reselected
      cancelDrawToCreateWidget(false);
    }
  }
}

export function cancelDrawToCreateWidget(deleteTempWidget?: any) {
  // If deleteTempWidget is true, remove temporary widget from canvas
  if (deleteTempWidget) {
    canvas.remove(canvas.drawTempWidget);
  }
  // Reset the drawTempWidget on the canvas to null
  canvas.drawTempWidget = null;

  // Dispatch action to clear drawToCreateWidget state in redux store
  store.dispatch(handleSetDrawToCreateWidget(null));

  // Unregister the canvas mouse up event from the Event service
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_UP,
    DrawToCreateMouseUpListener
  );

  // Unregister the canvas mouse down event from the Event service
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_DOWN,
    DrawToCreateMouseDownListener
  );

  // Unregister the canvas mouse move event from the Event service
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_MOVE,
    DrawToCreateMouseMoveListener
  );

  // Reset the drawStartPosition on the canvas to null
  canvas.drawStartPosition = null;

  // Dispatch action to set connector mode in redux store to false
  store.dispatch(handleSetConnectorMode(false));

  // Dispatch action to set arrow mode in redux store to false
  store.dispatch(handleSetArrowMode(false));

  // Dispatch action to change the mode to 'default'
  store.dispatch(changeMode('default'));
}

function onKeySpaceUp(e: any) {
  if (!canvas) return;
  store.dispatch(handleSetIsPanMode(false));
  canvas.isEnablePanMoving = false;
  keyUpCleanUp();
}

function onKeySpaceDown(e: any) {
  if (!canvas) return;
  store.dispatch(handleSetIsPanMode(true));
  canvas.isEnablePanMoving = true;
}

function onKeyCtrlShiftFiveDownScreenShot(e: any) {
  store.dispatch(handleSetIsPanMode(true));
}

function onKeyZCtrlDownUndo(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  if (isMac && e.metaKey) {
    canvas.undo();
  }
}

function onKeyZCtrlShiftDownRedo(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  if (isMac && e.metaKey) {
    canvas.redo();
  }
}

function onKeyACtrlDown(e: any) {
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  e.preventDefault();
  store.dispatch(handleSetIsPanMode(false));
  if ((isMac && !e.metaKey) || (!isMac && !e.ctrlKey)) return;
  canvas.discardActiveObject();
  const objects = canvas
    .getObjects()
    .filter(
      (obj) => obj._id !== undefined && !obj.locked && obj.obj_type !== 'common'
    );
  if (objects && objects.length > 0) {
    const selectedObject = canvas.getActiveSelection();
    selectedObject.add(...objects);
    canvas.requestRenderAll();
    canvas.setActiveObject(selectedObject);
  }
}

function onKeyBCtrlDownBoldFont(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  const object = canvas && canvas.getActiveObject();
  e.preventDefault();
  store.dispatch(handleSetIsPanMode(false));
  if ((isMac && !e.metaKey) || (!isMac && !e.ctrlKey)) return;
  if (
    object.obj_type === 'WBRectNotes' ||
    object.obj_type === 'WBCircleNotes' ||
    object.obj_type === 'WBTextbox' ||
    object.obj_type === 'WBText' ||
    object.obj_type === 'WBShapeNotes'
  ) {
    if (object.fontWeight) {
      object.fontWeight = object.fontWeight === 400 ? 550 : 400;
      object.saveData('MODIFIED', ['fontWeight']);
      object.dirty = true;
      canvas.requestRenderAll();
    }
  }
}

function onKeyGCtrlShiftUngroup(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const object = canvas && canvas.getActiveObject();
  if (!e.metaKey && !e.ctrlKey) return;
  store.dispatch(handleSetIsPanMode(false));
  e.preventDefault();
  if (!object) return;
  if (e.shiftKey && object && object.obj_type === 'WBGroup') {
    canvas.ungroup(object);
  }
}

function onKeyGCtrlGroup(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const object = canvas && canvas.getActiveObject();
  if (!e.metaKey && !e.ctrlKey) return;
  e.preventDefault();
  store.dispatch(handleSetIsPanMode(false));
  if (!object) return;
  let group = null;
  if (canvas.getActiveObjects() && canvas.getActiveObjects().length > 1) {
    group = canvas.getActiveObject();
  }
  canvas.group(group);
}

function handleDefaulKeyDown(e: any) {
  if (canvas.drawTempWidget) {
    return;
  }
  if (firstKeyDown) {
    firstkeyDownAt = Date.now();
    firstKeyDown = false;
  }
  e.preventDefault();
}

function onKeyLDownDrawLine(e: any) {
  e.preventDefault();
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  if ((isMac && e.metaKey) || e.ctrlKey) {
    const cursorLock =
      "data:image/svg+xml,%3Csvg width='10' height='13' viewBox='0 0 10 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.832 0.755L5 0.75C5.70029 0.749965 6.37421 1.01709 6.8843 1.49689C7.39439 1.97669 7.70222 2.63302 7.745 3.332L7.75 3.5V4H8.5C8.89782 4 9.27936 4.15804 9.56066 4.43934C9.84196 4.72064 10 5.10218 10 5.5V11.5C10 11.8978 9.84196 12.2794 9.56066 12.5607C9.27936 12.842 8.89782 13 8.5 13H1.5C1.10218 13 0.720644 12.842 0.43934 12.5607C0.158035 12.2794 0 11.8978 0 11.5V5.5C0 5.10218 0.158035 4.72064 0.43934 4.43934C0.720644 4.15804 1.10218 4 1.5 4H2.25V3.5C2.24997 2.79971 2.51709 2.12579 2.99689 1.6157C3.47669 1.10561 4.13302 0.797781 4.832 0.755L5 0.75L4.832 0.755ZM5 7.5C4.73478 7.5 4.48043 7.60536 4.29289 7.79289C4.10536 7.98043 4 8.23478 4 8.5C4 8.76522 4.10536 9.01957 4.29289 9.20711C4.48043 9.39464 4.73478 9.5 5 9.5C5.26522 9.5 5.51957 9.39464 5.70711 9.20711C5.89464 9.01957 6 8.76522 6 8.5C6 8.23478 5.89464 7.98043 5.70711 7.79289C5.51957 7.60536 5.26522 7.5 5 7.5ZM5.128 2.256L5 2.25C4.69054 2.24986 4.39203 2.36451 4.16223 2.57177C3.93244 2.77903 3.78769 3.06417 3.756 3.372L3.75 3.5V4H6.25V3.5C6.25014 3.19054 6.13549 2.89203 5.92823 2.66223C5.72097 2.43244 5.43583 2.28769 5.128 2.256L5 2.25L5.128 2.256Z' fill='%23232930'/%3E%3C/svg%3E";
    if (!canvas.getActiveObject()) return;
    const selectObj = canvas.getActiveObject();
    if (e.shiftKey) {
      /* unlock selected objs */
      if (selectObj.isActiveSelection()) {
        selectObj._objects.forEach((obj) => {
          canvas.unLockObject(obj);
          obj.hoverCursor = 'default';
        });
      } else {
        canvas.unLockObject(selectObj);
      }
    } else {
      if (selectObj.isActiveSelection()) {
        selectObj._objects.forEach((obj) => {
          canvas.lockObject(obj);
          obj.hoverCursor = `url("${cursorLock}") 0 0, auto`;
        });
      } else {
        canvas.lockObject(selectObj);
        selectObj.hoverCursor = `url("${cursorLock}") 0 0, auto`;
      }
    }

    selectObj.dirty = true;
    canvas.setActiveObject(selectObj);
    showMenu();
    canvas.requestRenderAll();
    selectObj.saveData('MODIFIED', [
      'locked',
      'lockMovementX',
      'lockMovementY',
      'editable',
      'lockScalingX',
      'lockScalingY',
      'lockSkewingX',
      'lockSkewingY',
      'lockRotation',
    ]);
  }
}

// function onKeySDownDrawTriangle(e:any) {
//   handleDefaulKeyDown(e:any);
//   if (SlideService.getInstance().getPresentationMode()) {
//     return;
//   }
//   DrawingService.getInstance().getReadyToDrawShape(5, canvas);
// }

// function onKeySDownDrawNote(e:any) {
//   handleDefaulKeyDown(e:any);
//   if (SlideService.getInstance().getPresentationMode()) {
//     return;
//   }
//   canvas.discardActiveObject();
//   const cursorNote =
//     "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.6863 0H0.313719C0.1405 0 0 0.1405 0 0.313719V15.6863C0 15.8595 0.1405 16 0.313719 16H11.5815C11.7548 16 16 11.6732 16 11.5V0.313719C16 0.1405 15.8595 0 15.6863 0ZM13.8977 13.5L12.0252 15.3726L15.3725 12.0252L13.8977 13.5ZM11.5815 14.9288V11.5815H14.9288L11.5815 14.9288ZM15.3726 10.954H11.2677C11.0945 10.954 10.954 11.0945 10.954 11.2677V15.3725H0.627437V0.627437H15.3725L15.3726 10.954Z' fill='%23232930'/%3E%3C/svg%3E";
//   DrawingService.getInstance().getReadyToDrawWidget(
//     `url("${cursorNote}") 0 0, auto`,
//     'WBRectNotes',
//     canvas,
//   );
//   keyUpCleanUp();
// }

// function onKeyRDownDrawRectangle(e:any) {
//   handleDefaulKeyDown(e:any);
//   if (SlideService.getInstance().getPresentationMode()) {
//     return;
//   }
//   DrawingService.getInstance().getReadyToDrawShape(0, canvas);
// }

function onKeyFDownDrawPanel(e: any) {
  handleDefaulKeyDown(e);
  if (store.getState().slides.presentationMode) {
    return;
  }
  canvas.discardActiveObject();
  DrawingService.getInstance().getReadyToDrawWidget(
    'crosshair',
    'WBRectPanel',
    canvas
  );
}

// function onKeyODownDrawCircle(e:any) {
//   handleDefaulKeyDown(e:any);
//   if (SlideService.getInstance().getPresentationMode()) {
//     return;
//   }
//   DrawingService.getInstance().getReadyToDrawShape(3, canvas);
// }

// function onKeyTDrawText(e:any) {
//   handleDefaulKeyDown(e:any);
//   if (SlideService.getInstance().getPresentationMode()) {
//     return;
//   }
//   const cursorNote = 'text';
//   DrawingService.getInstance().getReadyToDrawWidget(
//     cursorNote,
//     'WBText',
//     canvas,
//   );
//   keyUpCleanUp();
// }

function onKeyCtrlPlusZoomIn(e: any) {
  if (!e.metaKey && !e.ctrlKey) return;
  e.preventDefault();
  let newZoom = canvas.getZoom() * 1.2;
  if (newZoom > 4) newZoom = 4;
  canvas.zoomToCenterPoint(canvas.getVpCenter(), newZoom);
  canvas.setZoom(newZoom);
  store.dispatch(handleSetZoomFactor(newZoom));
  canvas.requestRenderAll();
}

function onKeyCtrlMinusZoomOut(e: any) {
  if (!e.metaKey && !e.ctrlKey) return;
  e.preventDefault();
  let newZoom = canvas.getZoom() * 0.8;
  if (newZoom < 0.05) newZoom = 0.05;
  canvas.zoomToCenterPoint(canvas.getVpCenter(), newZoom);
  canvas.setZoom(newZoom);
  store.dispatch(handleSetZoomFactor(newZoom));
  canvas.requestRenderAll();
}

async function onKeyCtrlZeroZoomToCenter(e: any) {
  if (!e.metaKey && !e.ctrlKey) return;
  e.preventDefault();

  await canvas.zoomToViewAllObjects();
  canvas.requestRenderAll();
  store.dispatch(handleSetZoomFactor(1));
}

function onKeyDCtrlDuplicate(e: any) {
  if (!e.metaKey && !e.altKey) return;
  const direction = e.shiftKey ? 'bottom' : 'right';

  if (store.getState().slides.presentationMode) {
    return;
  }

  e.preventDefault();

  canvas.duplicateWidget(direction);
}

function onKeyDelete(e: any) {
  e.preventDefault();
  const object = canvas.getActiveObject();

  if (!object || object.isEditing) {
    return;
  }

  canvas.removeWidget(object);
  showMenu();
}

function onKeyUpDownLeftRightDownMove(e: any) {
  const widget = canvas.getActiveObject();
  const dropdownDisplayed = store.getState().widgets.dropdownDisplayed;
  if (dropdownDisplayed) {
    return;
  }
  if (!widget) {
    return;
  }
  let changePosition;
  if (widget) {
    if (e.shiftKey) changePosition = 10;
    else changePosition = 1;
    if (widget.obj_type === 'WBArrow') {
      if (!widget.connectorStart && !widget.connectorEnd) {
        let { left, top } = widget;
        switch (e.keyCode) {
          case 37:
            left -= changePosition / store.getState().board.zoomFactor;
            break;
          case 38:
            top -= changePosition / store.getState().board.zoomFactor;
            break;
          case 39:
            left += changePosition / store.getState().board.zoomFactor;
            break;
          case 40:
            top += changePosition / store.getState().board.zoomFactor;
            break;
          default:
            break;
        }
        canvas.requestRenderAll();
        widget.set('left', left).set('top', top).setCoords();
        widget.saveData('MOVED', ['left', 'top']);
      }
    } else {
      let { left } = widget;
      let { top } = widget;
      switch (e.keyCode) {
        case 37:
          left -= changePosition / store.getState().board.zoomFactor;
          break;
        case 38:
          top -= changePosition / store.getState().board.zoomFactor;
          break;
        case 39:
          left += changePosition / store.getState().board.zoomFactor;
          break;
        case 40:
          top += changePosition / store.getState().board.zoomFactor;
          break;
        default:
          break;
      }
      if (widget.lines && widget.lines.length > 0) {
        canvas.onObjectModifyUpdateArrows(widget);
      }
      widget.set('left', left).set('top', top).setCoords();
      widget.saveData('MOVED', ['left', 'top']);
    }
    canvas.requestRenderAll();
  } else if (e.shiftKey) {
    changePosition = 250;
  } else {
    changePosition = 50;
  }
}

function isLongPress() {
  lastkeyUpAt = Date.now();
  if (lastkeyUpAt - firstkeyDownAt > 1000) {
    return true;
  }
  return false;
}

function keyUpCleanUp() {
  lastkeyUpAt = 0;
  firstkeyDownAt = 0;
  firstKeyDown = true;
}

function cancelDrawing() {
  if (!canvas) return;
  store.dispatch(changeMode('default'));
  store.dispatch(handleSetDrawToCreateWidget(null));
  //   recoverEventsByInteractionMode();
}

function onKeyUpDraw(e: any) {
  if (!store.getState().slides.presentationMode) {
    if (isLongPress()) {
      cancelDrawing();
    }
  }
  keyUpCleanUp();
}

function onKeyZCtrlUpUndo(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  if ((isMac && e.metaKey) || e.ctrlKey) {
    canvas.undo();
  }
}

function onKeyZCtrlShiftUpRedo(e: any) {
  if (store.getState().slides.presentationMode) {
    return;
  }
  const isMac = !!navigator.userAgent.match(/Macintosh/);
  if ((isMac && e.metaKey) || e.ctrlKey) {
    canvas.redo();
  }
}
