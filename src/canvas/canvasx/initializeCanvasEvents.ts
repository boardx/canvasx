import { WBCanvas } from './bx-canvas';

var scale = 1;
let rotation = 0;
let gestureStartRotation = 0;
let gestureStartScale = 0;
var scale = 1;
let posX = 0;
let posY = 0;
let initialX;
let initialY;
let modifyType: string;

export function whiteboardMouseMoveListener(event: any) {
  const canvas = event.target.canvas;
  // Return if event exists and event type is 'touchmove'
  if (event && event.e.type === 'touchmove') return;

  const { e } = event;

  // Define speed for moving
  const moveSpeeding = 7;

  // Handle moving of active object on the canvas with specified speed
  if (canvas.getActiveObject() && canvas.getActiveObject().isMoving) {
    handleMoving(e, moveSpeeding);
  }
}

function handleMoving(e: any, moveSpeeding: any) {
  const canvas = e.target.canvas;
  /*
   * This function handles moving an object on the canvas when the object is near canvas edge.
   * 4 situations are covered:
   * 1. object is near the bottom edge
   * 2. object is near the top edge, due to the top-menu, there is a range of 75px rather than the standard 50px
   * 3. object is near the left edge
   * 4. object is near the right edge
   *
   * The logic uses 4 'if' conditions rather than 'if-elseif' to allow functioning on 4 corners at the same time.
   */

  // Handle when object is near bottom edge
  if (document.documentElement.clientHeight - e.y < 50) {
    // Move the object down
    canvas
      .getActiveObject()
      .set(
        'top',
        canvas.getActiveObject().top + moveSpeeding / canvas.getZoom()
      );
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas upwards
    canvas.relativePan({ x: 0, y: -moveSpeeding });
  }

  // Handle when object is near top edge
  if (e.y <= 75) {
    // Move the object up
    canvas
      .getActiveObject()
      .set(
        'top',
        canvas.getActiveObject().top - moveSpeeding / canvas.getZoom()
      );
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas downwards
    canvas.relativePan({ x: 0, y: moveSpeeding });
  }

  // Handle when object is near left edge
  if (e.x <= 50) {
    // Move the object to the left
    canvas
      .getActiveObject()
      .set(
        'left',
        canvas.getActiveObject().left - moveSpeeding / canvas.getZoom()
      );
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas to the right
    canvas.relativePan({ x: moveSpeeding, y: 0 });
  }

  // Handle when object is near right edge
  if (document.documentElement.clientWidth - e.x < 50) {
    // Move the object to the right
    canvas
      .getActiveObject()
      .set(
        'left',
        canvas.getActiveObject().left + moveSpeeding / canvas.getZoom()
      );
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas to the left
    canvas.relativePan({ x: -moveSpeeding, y: 0 });
  }

  // Redraw all objects on canvas
  canvas.requestRenderAll();
}

/**
 * canvas mouseup event listener
 */
export function whiteboardMouseUpListener(event: any) {
  const canvas = event.target.canvas;
  // 使用事件服务反注册函`changeCursor`的`CANVAS_MOUSE_MOVE`事件

  // canvas.off('mouse:move', changeCursor);
  // 如果事件类型是'touchend'，则直接返回
  if (event && event.e.type === 'touchend') {
    return;
  }
  // 如果没有这个鼠标抬起事件，设置鼠标按下状态为假
  canvas.mouse.down = false;
  // 为`panMode`赋值`.board.isPanMode` 或者 null
  const panMode = false;
  // 如果处于平移模式，鼠标样式设置为'grabbing'
  if (panMode) {
    canvas.setCursor('grabbing');
  } else {
    // 否则鼠标样式设置为'default'
    canvas.setCursor('default');
  }
  // // 如果mouseMoveHandler不为null，清除鼠标移动事件的定时器
  // if (mouseMoveHandler !== null) {
  //   clearInterval(mouseMoveHandler);
  // }

  // 如果没有提供画布就直接返回
  if (!canvas) {
    return;
  }

  canvas.off('mouse:up', whiteboardMouseUpListener);
}
/**
 * canvas mouseout event listener
 * @param {*} event
 */
export function whiteboardMouseOutListener(event: any) {
  const canvas = event.target.canvas;
  canvas.mouse.down = false;
}

export function whiteboardMouseDownListener(event: any) {
  const canvas = event.target.canvas;
  // If there is an active object on the canvas,
  // we register an event handler for mouse-move events that changes the cursor.
  if (canvas.getActiveObject()) {
    // canvas.on('mouse:move', changeCursor);
    // EventService.getInstance().register(
    //   EventNames.CANVAS_MOUSE_MOVE,
    //   changeCursor,
    // );
  }

  // If the target of the event is null or undefined, we discard the active object,
  // set the cursor to the default type, and call the function to show the menu.
  if (event.target == null || event.target === undefined) {
    canvas.discardActiveObject();
    canvas.setCursor('default');
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    canvas.requestRenderAll();
    // showMenu();
  }

  // We flag that the mouse has not moved yet
  canvas.mouse.moved = false;

  // If the active object is in edit mode, we return and do nothing.
  if (canvas.getActiveObject() && canvas.getActiveObject().isEditing) return;

  //If the shift key was pressed during the event, we add the target to the active selection.
  if (canvas.getActiveObject() && event.target && event.e.shiftKey) {
    const objects = canvas.getActiveObjects();
    const sel = canvas.getActiveSelection();
    sel.add(...objects, event.target);
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
    return;
  }

  // If the target of the event is in edit mode, we return true.
  if (event.target && event.target.isEditing) return true;

  // We check if the whiteboard is in pan mode.
  // const panMode = store.getState().board.isPanMode || null;
  // We flag that the mouse is down.
  canvas.mouse.down = true;

  // We register the mouse-up event listener.
  canvas.on('mouse:up', whiteboardMouseUpListener);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_MOUSE_UP,
  //   whiteboardMouseUpListener,
  // );

  // We store the current mouse positions (X and Y coordinates).
  canvas.lastPosX = event.e.offsetX;
  canvas.lastPosY = event.e.offsetY;

  // We initialize the mouse delta values.
  canvas.mouseDeltaX = 0;
  canvas.mouseDeltaY = 0;
}

/**
 * switch the interaction mode, mouse or trackpad
 * @param {string} interactionMode
 */
export function switchInteractionMode(interactionMode: any, canvas: WBCanvas) {
  // Checking if canvas is not available, or the current UI is mobile. If either is true, exit the function.
  // if (!canvas || store.getState().system.currentUIType === 'mobile') return;

  // Removing event handlers for touch:drag and touchend events on the canvas container.
  // $('#canvasContainer').off('touch:drag');
  // $('#canvasContainer').off('touchend');

  // Registering a whiteboardMouseOutListener to handle a canvas mouse out event using the EventService register method.
  canvas.on('mouse:out', whiteboardMouseOutListener);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_MOUSE_OUT,
  //   whiteboardMouseOutListener,
  // );

  // Registering a whiteboardMouseDownListener to handle a canvas mouse down event.
  canvas.on('mouse:down', whiteboardMouseDownListener);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_MOUSE_DOWN,
  //   whiteboardMouseDownListener,
  // );

  // Registering a whiteboardMouseDownListener to handle a canvas mouse down event before the original event.
  canvas.on('mouse:down:before', whiteboardMouseDownListener);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_MOUSE_DOWN_BEFORE,
  //   whiteboardMouseDownListener,
  // );

  // Registering a whiteboardMouseMoveListener to handle a canvas mouse move event.
  canvas.on('mouse:move', whiteboardMouseMoveListener);
  // // EventService.getInstance().register(
  // //   EventNames.CANVAS_MOUSE_MOVE,
  // //   whiteboardMouseMoveListener,
  // // );
  // //todo: need to check
  // // Registering a windowGestureStarthandler to handle a window gesture start event.
  // canvas.on('gesture:start', windowGestureStarthandler);
  // // EventService.getInstance().register(
  // //   EventNames.WINDOW_GESTURE_START,
  // //   windowGestureStarthandler,
  // // );

  // // Registering a windowGestureChangeHandler to handle a window gesture change event.
  // canvas.on('gesture:change', windowGestureChangeHandler);
  // EventService.getInstance().register(
  //   EventNames.WINDOW_GESTURE_CHANGE,
  //   windowGestureChangeHandler,
  // );
}

const windowGestureStarthandler = (e: any) => {
  // Initialize the touch position, rotation and scale at the start of a gesture
  initialX = e.pageX - posX;
  initialY = e.pageY - posY;
  gestureStartRotation = rotation;
  gestureStartScale = scale;

  // Prevent the default action and stop the propagation of the event to the parent elements
  e.preventDefault();
  e.stopPropagation();
};

const windowGestureChangeHandler = (e: any) => {
  const canvas = e.target.canvas;
  // Update the rotation and scale upon gesture's change
  rotation = gestureStartRotation + e.rotation;
  scale = gestureStartScale * e.scale;
  // Update the mouse position information to the canvas
  canvas.mouse.x = e.clientX;
  canvas.mouse.y = e.clientY;

  // Update the mouse wheeling information and the event itself
  canvas.mouse.w = scale;
  canvas.mouse.e = e;
  canvas.mouse.zoomUpdate = true;

  // Restrict the scale (zoom level) to a certain range
  // if (scale > 4 && !store.getState().slides.slidesMode) scale = 4;
  if (scale < 0.05) scale = 0.05;
  // Dispatch an action to update the zoom factor in the store
  // store.dispatch(handleSetZoomFactor(scale));

  // Store the viewport transformation in local storage
  canvas.updateViewportToLocalStorage(canvas.viewportTransform);
  // Update the position and zoom level of the canvas view
  canvas.zoomToPoint({ x: e.clientX, y: e.clientY }, scale);
  // Request a rerender for the canvas
  canvas.requestRenderAll();

  // Prevent the default action and stop the propagation of the event to the parent elements
  e.preventDefault();
  e.stopPropagation();
};

// export async function doubleClickToCreateStickyNote(e) {
//   // Exit the function if an inappropriate mode is selected or a file is being dragged or a click is being processed
//   if (store.getState().mode.type === 'draw' || store.getState().mode.type === 'line' ||
//     canvas.isDrawingMode ||
//     (canvas.getActiveObject() && canvas.getActiveObject().objType === 'WBFile') ||
//     canvas.mouse.moved
//   ) {
//     return;
//   }
//   // Find the currently focused object
//   const target = canvas.findTarget(e);

//   // If the target is of a note type and is editable, enter edit mode
//   if (
//     target &&
//     (target.objType === 'WBRectNotes' ||
//       target.objType === 'WBCircleNotes' ||
//       target.objType === 'WBTextbox' ||
//       target.objType === 'WBText' ||
//       target.objType === 'WBShapeNotes' ||
//       target.type === 'textbox') &&
//     target.editable &&
//     !target.isPanel
//   ) {
//     target.enterEditing();
//     return;
//   }

//   // If the target is of a note or image type and is editable, exit the function
//   if (
//     target &&
//     (target.objType === 'WBRectNotes' ||
//       target.objType === 'WBCircleNotes' ||
//       target.objType === 'WBUrlImage' ||
//       target.objType === 'WBTextbox' ||
//       target.objType === 'WBText' ||
//       target.objType === 'WBShapeNotes') &&
//     target.editable
//   ) {
//     return;
//   }

//   // Define user's default note configuration
//   const { defaultNote } = canvas;

//   // Get the position of the click event
//   const positionOfClick = e.pointerType ? e.srcEvent : e.e;

//   // Calculate the position of the next object on the canvas
//   const nextObject = await canvas.getNextObjectByPoint(
//     { x: positionOfClick.offsetX, y: positionOfClick.offsetY },
//     defaultNote.width * defaultNote.scaleX,
//     defaultNote.height * defaultNote.scaleY,
//   );

//   let position = {};
//   if (!nextObject) {
//     // If there is no next object, get the position on canvas where click event occurred
//     position = canvas.getPositionOnCanvas(
//       positionOfClick.offsetX,
//       positionOfClick.offsetY,
//     );
//   } else {
//     // If there is a next object, set the position and properties of the note to be created similar to the next object
//     position.left = nextObject.left;
//     position.top = nextObject.top;
//     defaultNote.width = nextObject.width;
//     defaultNote.height = nextObject.height;
//     defaultNote.scaleX = nextObject.scaleX;
//     defaultNote.scaleY = nextObject.scaleY;
//     defaultNote.fontSize = nextObject.fontSize;
//     defaultNote.fontWeight = nextObject.fontWeight;
//     defaultNote.fontFamily = nextObject.fontFamily;
//     defaultNote.textAlign = nextObject.textAlign;
//     defaultNote.backgroundColor = nextObject.backgroundColor;
//     defaultNote.fill = nextObject.fill;
//     defaultNote.objType = nextObject.objType;
//     canvas.changeDefaulNote(defaultNote);
//   }

//   // Set other properties of the note
//   const note = {
//     // Initialized note properties
//   }

//   note.id = UtilityService.getInstance().generateWidgetID();
//   // Create and add widget from note properties
//   // Rest of the function
// }

// export function onTextEditingExited(event) {
//   // Extract target from the event object
//   const { target } = event;

//   // Get the widget with the corresponding id from the widget list
//   const widget = canvas.findById(target.id);

//   // If the event target hasn't changed, return immediately
//   if (!event.target.changed) return;

//   // If the related widget does not exist, return immediately
//   if (!widget) return;

//   // Inform the server that the text property of the target has been modified
//   target.saveData('MODIFIED', ['text']);
//   // Reset the 'changed' status of the event target
//   event.target.changed = false;

//   // Return to the previous viewpoint in the canvas
//   canvas.gobackToPreviousViewport();

//   // Remove the currently active object from the canvas
//   canvas.discardActiveObject();

//   // Request the canvas to re-render all of its objects
//   canvas.requestRenderAll();
// }

export async function onObjectSelectionCleared(event: any) {
  const canvas = event.target.canvas;
  // 获取当前在画布上活动的对象
  const target = canvas.getActiveObject();

  // 上传被绘制的笔记
  // uploadTheNotesDraw(target);

  // 显示菜单，该行代码已被注释，如果需要就取消注释
  // showMenu();

  // 如果当前处于自定义颜色模式,则关闭自定义颜色模式
  // if (store.getState().widgets.customColorMode) {
  //   store.dispatch(handleSetCustomColorMode(false));
  // }

  // // 如果当前处于自定义颜色边框模式,则关闭自定义颜色边框模式
  // if (Session.get('customColorBorderMode')) {
  //   Session.set('customColorBorderMode', false);
  // }
}

// export function onSelectionUpdated(e) {
//   // If the number of active objects on the canvas are more than one,
//   // then lock the scaling option that keeps the object's aspect ratio fixed.
//   if (canvas.getActiveObjects().length > 1) {
//     canvas.getActiveObject().lockUniScaling = true;
//   }

//   // Display the context menu, this line of code is commented. If required, you can remove the comment.
//   // showMenu(e);
// }

export function initializeCanvasEvents(canvas: WBCanvas) {
  // For all future instances of fabric.Object, transparent corners are disabled
  // fabric.Object.prototype.transparentCorners = false;

  // Register event listener for 'TEXT_EDITING_EXISTED' event, to call the function 'onTextEditingExited'
  // canvas.on('text:editing:exited', onTextEditingExited);

  // Register event listener for 'CANVAS_BEFORE_SELECTION_CLEARED' event, to call the function 'onObjectSelectionCleared'
  canvas.on('before:selection:cleared', onObjectSelectionCleared);

  // Register event listener for 'CANVAS_SELECTION_UPDATED' event, to call the function 'onSelectionUpdated'
  // canvas.on('selection:updated', onSelectionUpdated);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_SELECTION_UPDATED,
  //   onSelectionUpdated,
  // );

  // Register event listener for 'CANVAS_BEFORE_SELECTION_CLEARED' event, to call the function 'onBeforeSelectionCleared'
  // canvas.on('before:selection:cleared', onBeforeSelectionCleared);

  canvas.on('object:scaling', (event: any) => {
    const { target } = event;

    // if (target.objType === 'WBTextbox' || target.objType === 'WBText') {
    //   const obj = target;

    //   const w = obj.width * obj.scaleX;

    //   const h = obj.height * obj.scaleY;

    //   obj.set({
    //     height: h,
    //     width: w,
    //     scaleX: 1,
    //     scaleY: 1,
    //   });

    //   obj.initDimensions();

    //   obj.dirty = true;

    //   canvas.requestRenderAll();
    // }

    // if (target.isActiveSelection()) {
    //   target._objects.forEach((obj: any) => {
    //     obj.set({ hasBorders: false });
    //     if (obj.id && obj.objType !== 'WBShapeNotes') {
    //       const objwidget = self.findById(obj.id);

    //       objwidget.setCoords();

    //       objwidget.set({
    //         scaleX: objwidget.scaleX,
    //         scaleY: objwidget.scaleY,
    //         left: objwidget.left,
    //         top: objwidget.top,
    //       });
    //     } else {
    //       const objwidget = self.findById(obj.id);

    //       if (!objwidget) return;

    //       objwidget.setCoords();

    //       self.requestRenderAll();
    //     }
    //   });
    // } else if (target.objType !== 'WBArrow' && target.objType !== 'WBGroup') {
    //   // get left and top before scaling
    //   const objwidget = WidgetService.getInstance().getWidgetFromWidgetList(
    //     target.id
    //   );

    //   if (!objwidget) return;

    //   self.syncObjectChangeToRemote(target.id, {
    //     left: target.left,
    //     top: target.top,
    //     scaleX: target.scaleX,
    //     scaleY: target.scaleY,
    //   });

    //   if (target.lines && target.lines.length > 0)
    //     self.onObjectModifyUpdateArrows(target);

    //   if (
    //     target.objType === 'WBRectPanel' &&
    //     target.subIdList() &&
    //     target.subIdList().length > 0
    //   ) {
    //     self.updateSubObjectsbyPanelObjNotMove(target);
    //   }
    // }

    // modifyType = 'SCALED';
  });

  canvas.on('dragenter', () => {
    canvas.wrapperEl.style.opacity = '0.7';
  });

  canvas.on('dragleave', () => {
    canvas.wrapperEl.style.opacity = '1';
  });
}

// /**
//  * handle the mouse wheel event
//  */
// function isTrackpadOrMouse(e) {
//   // Check if the current device is a Mac
//   const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
//   // Initialize a default value for the isTrackpad variable
//   let isTrackpad = false;

//   if (isMac) {
//     //On a Mac device
//     if (e.wheelDeltaY) {
//       // if the scrolling is in the Y direction
//       // check for equality between wheelDeltaY and deltaY times -3
//       // if they're equal, the input device is a trackpad
//       if (e.wheelDeltaY === e.deltaY * -3) {
//         isTrackpad = true;
//       }
//     } else if (e.deltaMode === 0) {
//       //deltaMode of 0 indicates that the unit of the delta values is in pixels
//       // which means the input device is a trackpad
//       isTrackpad = true;
//     }
//   } else {
//     //On a Non-Mac device
//     if (SystemService.getInstance().getIsFirefox()) {
//       // check the deltaY and deltaX values for a Firefox browser
//       isTrackpad =
//         e.deltaY !== 0
//           ? e.wheelDeltaY !== e.deltaY * -3
//           : e.deltaX !== 0
//           ? e.wheelDeltaX !== e.deltaX * -3
//           : false;
//       // If deltaY is equal to wheelDeltaY times -1, it's a trackpad
//     } else if (e.deltaY === e.wheelDeltaY * -1) {
//       isTrackpad = true;
//     }
//   }

//   // Return if the input device is a trackpad
//   return isTrackpad;
// }

// export function mouseWheelListener(e) {

//   // Clears any previously set timeout, if there's any.
//   if (timer) {
//     clearTimeout(timer);
//     timer = null;
//   }

//   // Sets a delay to show the menu after 200ms.
//   timer = setTimeout(() => {
//     showMenu();
//   }, 200)

//   // Checks if the system is MacOS.
//   const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

//   // Dispatches an action to hide the widget menu.
//   store.dispatch(handleWidgetMenuDisplay(false))

//   // Checks if an event is available, prevents the default behaviour and propagation if true.
//   if (e != null) {
//     e.preventDefault();
//     e.stopPropagation();
//   }

//   // Measures the vertical scrolling amount.
//   const deltaY = Math.abs(e.deltaY);

//   // Checks if the event was triggered from a trackpad or mouse, and handles it if true.
//   if (isTrackpadOrMouse(e)) {
//     onTrackpadTouch(e);
//     return false;
//   }

//   // If the system is MacOS, and the event contains horizontal scrolling or the deltaY is a whole number, then the function exits.
//   if (
//     isMac &&
//     (Math.abs(e.deltaX) !== 0 || parseInt(deltaY.toString()) === deltaY)
//   ) return false;

//   // Adjusts the zoom factor based on vertical scroll amount.
//   let zoom = canvas.getZoom() * 0.999 ** (e.deltaY * 10)

//   // Sets maximum and minimum zoom limits.
//   if (zoom > 4 && !store.getState().slides.slidesMode) zoom = 4;
//   if (zoom < 0.05) zoom = 0.05;

//   // Dispatches an action to update the zoom factor in store state.
//   store.dispatch(handleSetZoomFactor(zoom));

//   // Zooms the canvas to the point where the event triggered and updates the viewport.
//   canvas.zoomToPoint({ x: e.layerX, y: e.layerY }, zoom);
//   canvas.updateViewportToLocalStorage(canvas.viewportTransform);

//   // Requests a rerender of the canvas.
//   canvas.requestRenderAll()
// }
