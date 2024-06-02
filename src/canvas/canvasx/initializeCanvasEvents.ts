import { Point } from '../../Point';
import { ActiveSelection } from '../../shapes/ActiveSelection';
import { XConnector } from '../../shapes/canvasx/XConnector';
import { XCanvas } from './bx-canvas';

export function initializeCanvasEvents(canvas: XCanvas) {
  let endX;
  let endY;
  let mouseMoveHandler: any = null;

  let timer = null;

  var scale = 1;
  let rotation = 0;
  let gestureStartRotation = 0;
  let gestureStartScale = 0;
  var scale = 1;
  let posX = 0;
  let posY = 0;
  let sX;
  let sY;

  function getIsFirefox() {
    // Check if the current browser is Firefox
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isFirefox;
  }
  /**
   * handle the mouse wheel event
   */
  function isTrackpadOrMouse(e: any) {
    // Check if the current device is a Mac
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    // Initialize a default value for the isTrackpad variable
    let isTrackpad = false;

    if (isMac) {
      //On a Mac device
      if (e.wheelDeltaY) {
        // if the scrolling is in the Y direction
        // check for equality between wheelDeltaY and deltaY times -3
        // if they're equal, the input device is a trackpad
        if (e.wheelDeltaY === e.deltaY * -3) {
          isTrackpad = true;
        }
      } else if (e.deltaMode === 0) {
        //deltaMode of 0 indicates that the unit of the delta values is in pixels
        // which means the input device is a trackpad
        isTrackpad = true;
      }
    } else {
      //On a Non-Mac device
      if (getIsFirefox()) {
        // check the deltaY and deltaX values for a Firefox browser
        isTrackpad =
          e.deltaY !== 0
            ? e.wheelDeltaY !== e.deltaY * -3
            : e.deltaX !== 0
            ? e.wheelDeltaX !== e.deltaX * -3
            : false;
        // If deltaY is equal to wheelDeltaY times -1, it's a trackpad
      } else if (e.deltaY === e.wheelDeltaY * -1) {
        isTrackpad = true;
      }
    }

    // Return if the input device is a trackpad
    return isTrackpad;
  }

  function whiteboardMouseMoveListener(event: any) {
    // Set mouse moved attribute to true on canvas object
    // canvas.mouse.moved = true;

    // Return if event exists and event type is 'touchmove'
    if (event && event.e.type === 'touchmove') return;

    const { e } = event;

    // Define speed for moving
    const moveSpeeding = 7;

    // Handle moving of active object on the canvas with specified speed
    if (canvas.getActiveObject() && canvas.getActiveObject()?.isMoving) {
      handleMoving(e, moveSpeeding);
    }
  }

  function handleMoving(e: any, moveSpeeding: any) {
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

    if (!canvas.getActiveObject()) return;

    // Handle when object is near bottom edge
    if (document.documentElement.clientHeight - e.y < 50) {
      // Move the object down
      canvas!
        .getActiveObject()!
        .set(
          'top',
          canvas.getActiveObject()!.top + moveSpeeding / canvas.getZoom()
        );
      // Set the object's dirty attribute to true
      canvas.getActiveObject()!.dirty = true;
      // Pan the canvas upwards
      canvas.relativePan({ x: 0, y: -moveSpeeding });
    }

    // Handle when object is near top edge
    if (e.y <= 75) {
      // Move the object up
      canvas
        .getActiveObject()!
        .set(
          'top',
          canvas.getActiveObject()!.top - moveSpeeding / canvas.getZoom()
        );
      // Set the object's dirty attribute to true
      canvas.getActiveObject()!.dirty = true;
      // Pan the canvas downwards
      canvas.relativePan({ x: 0, y: moveSpeeding });
    }

    // Handle when object is near left edge
    if (e.x <= 50) {
      // Move the object to the left
      canvas
        .getActiveObject()!
        .set(
          'left',
          canvas.getActiveObject()!.left - moveSpeeding / canvas.getZoom()
        );
      // Set the object's dirty attribute to true
      canvas.getActiveObject()!.dirty = true;
      // Pan the canvas to the right
      canvas.relativePan({ x: moveSpeeding, y: 0 });
    }

    // Handle when object is near right edge
    if (document.documentElement.clientWidth - e.x < 50) {
      // Move the object to the right
      canvas
        .getActiveObject()!
        .set(
          'left',
          canvas.getActiveObject()!.left + moveSpeeding / canvas.getZoom()
        );
      // Set the object's dirty attribute to true
      canvas.getActiveObject()!.dirty = true;
      // Pan the canvas to the left
      canvas.relativePan({ x: -moveSpeeding, y: 0 });
    }

    // Redraw all objects on canvas
    canvas.requestRenderAll();
  }

  function changeCursorForArrow() {
    // Change the cursor on the canvas to a crosshair
    canvas.setCursor('crosshair');
  }

  /**
   * canvas mouseup event listener
   */
  function whiteboardMouseUpListener(event: any) {
    // 使用事件服务反注册函`changeCursor`的`CANVAS_MOUSE_MOVE`事件

    canvas.off('mouse:move', changeCursor);
    // 如果事件类型是'touchend'，则直接返回
    if (event && event.e.type === 'touchend') {
      return;
    }
    // 如果没有这个鼠标抬起事件，设置鼠标按下状态为假
    // canvas.mouse.down = false;
    // 为`panMode`赋值`.board.isPanMode` 或者 null
    const panMode = false;
    // 如果处于平移模式，鼠标样式设置为'grabbing'
    if (panMode) {
      canvas.setCursor('grabbing');
    } else {
      // 否则鼠标样式设置为'default'
      canvas.setCursor('default');
    }
    // 如果mouseMoveHandler不为null，清除鼠标移动事件的定时器
    if (mouseMoveHandler !== null) {
      clearInterval(mouseMoveHandler);
    }

    // 如果没有提供画布就直接返回
    if (!canvas) {
      return;
    }

    // // 使用事件服务取消注册白板的鼠标抬起事件监听器
    // EventService.getInstance().unregister(
    //   EventNames.CANVAS_MOUSE_UP,
    //   whiteboardMouseUpListener,
    // );

    canvas.off('mouse:up', whiteboardMouseUpListener);

    // // 如果处于箭头模式，保存箭头
    // if (store.getState().board.arrowMode) {
    //   saveArrow();
    // }
  }

  // function saveArrow() {
  //   // 如果箭头的起始点X坐标非空
  //   if (canvas.arrowStartX) {
  //     // 调用画布上的drawArrowSave方法保存箭头图形，参数包括箭头的起始点和终止点
  //     canvas.drawArrowSave(canvas.arrowStartX, canvas.arrowStartY, endX, endY);
  //     // 保存后将箭头的起始点重置为null
  //     canvas.arrowStartX = null;
  //     canvas.arrowStartY = null;
  //   }
  // }

  function changeCursor() {
    if (!canvas.getActiveObject()) return;
    // 如果当前活动的物体存在并且被锁定
    if (canvas.getActiveObject()!.locked) {
      // 设置鼠标光标样式为'grabbing'，表示在移动可拖动的物体
      canvas.setCursor('grabbing');
    }
  }
  /**
   * canvas mouseout event listener
   * @param {*} event
   */
  function whiteboardMouseOutListener(event: any) {
    canvas.mouse.down = false;
  }

  function whiteboardMouseDownListener(event: any) {
    // If there is an active object on the canvas,
    // we register an event handler for mouse-move events that changes the cursor.
    if (canvas.getActiveObject()) {
      canvas.on('mouse:move', changeCursor);
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
    // canvas.mouse.moved = false;

    // If the active object is in edit mode, we return and do nothing.
    if (canvas.getActiveObject() && canvas.getActiveObject()!.isEditing) return;

    //If the shift key was pressed during the event, we add the target to the active selection.
    if (canvas.getActiveObject() && event.target && event.e.shiftKey) {
      const objects = canvas.getActiveObjects();
      const sel = new ActiveSelection(); // canvas.getActiveSelection();
      sel.add(...objects, event.target);
      canvas.setActiveObject(sel);
      canvas.requestRenderAll();
      return;
    }

    // If the target of the event is in edit mode, we return true.
    if (event.target && event.target.isEditing) return true;

    // We check if the whiteboard is in pan mode.
    const panMode = false; // store.getState().board.isPanMode || null;
    // We flag that the mouse is down.
    canvas.mouse.down = true;

    // We register the mouse-up event listener.
    canvas.on('mouse:up', whiteboardMouseUpListener);
    // EventService.getInstance().register(
    //   EventNames.CANVAS_MOUSE_UP,
    //   whiteboardMouseUpListener,
    // );

    // // We store the current mouse positions (X and Y coordinates).
    // canvas.lastPosX = event.e.offsetX;
    // canvas.lastPosY = event.e.offsetY;

    // // We initialize the mouse delta values.
    // canvas.mouseDeltaX = 0;
    // canvas.mouseDeltaY = 0;
  }

  /**
   * switch the interaction mode, mouse or trackpad
   * @param {string} interactionMode
   */
  function switchInteractionMode(interactionMode: any) {
    // Checking if canvas is not available, or the current UI is mobile. If either is true, exit the function.
    // if (!canvas || store.getState().system.currentUIType === 'mobile')
    //   return;

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
    // EventService.getInstance().register(
    //   EventNames.CANVAS_MOUSE_MOVE,
    //   whiteboardMouseMoveListener,
    // );
    //todo: need to check
    // Registering a windowGestureStarthandler to handle a window gesture start event.
    // canvas.on('gesture:start', windowGestureStarthandler);
    // EventService.getInstance().register(
    //   EventNames.WINDOW_GESTURE_START,
    //   windowGestureStarthandler,
    // );

    // Registering a windowGestureChangeHandler to handle a window gesture change event.
    // canvas.on('gesture:change', windowGestureChangeHandler);
    // EventService.getInstance().register(
    //   EventNames.WINDOW_GESTURE_CHANGE,
    //   windowGestureChangeHandler,
    // );
  }

  const windowGestureStarthandler = (e: any) => {
    // Initialize the touch position, rotation and scale at the start of a gesture
    sX = e.pageX - posX;
    sY = e.pageY - posY;
    gestureStartRotation = rotation;
    gestureStartScale = scale;

    // Prevent the default action and stop the propagation of the event to the parent elements
    e.preventDefault();
    e.stopPropagation();
  };

  const windowGestureChangeHandler = (e: any) => {
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
    canvas.zoomToPoint(new Point({ x: e.clientX, y: e.clientY }), scale);
    // Request a rerender for the canvas
    canvas.requestRenderAll();

    // Prevent the default action and stop the propagation of the event to the parent elements
    e.preventDefault();
    e.stopPropagation();
  };

  function recoverEventsByInteractionMode() {
    // Fetch the interaction mode that is currently stored in the canvas state
    const interactionMode = canvas.interactionMode;
    // Call the function to switch interaction mode with the current interaction mode as the argument
    // SwitchInteractionMode function will register events based on interaction mode
    switchInteractionMode(interactionMode);
  }

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
  //       target.objType === 'XCircleNotes' ||
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
  //       target.objType === 'XCircleNotes' ||
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

  function onTextChanged(e: any) {
    e.target.changed = true;
    //syncObjectChangeToRemote
    // canvas.syncObjectChangeToRemote(e.target.id, { text: e.target.text });
  }

  function onTextEditingExited(event: any) {
    return;
    // Extract target from the event object
    const { target } = event;

    // Get the widget with the corresponding id from the widget list
    const widget = canvas.findById(target.id);

    // If the event target hasn't changed, return immediately
    if (!event.target.changed) return;

    // If the related widget does not exist, return immediately
    if (!widget) return;

    // Inform the server that the text property of the target has been modified
    target.saveData('MODIFIED', ['text']);
    // Reset the 'changed' status of the event target
    event.target.changed = false;

    // Return to the previous viewpoint in the canvas
    canvas.gobackToPreviousViewport();

    // Remove the currently active object from the canvas
    canvas.discardActiveObject();

    // Request the canvas to re-render all of its objects
    canvas.requestRenderAll();
  }

  async function onObjectSelectionCleared() {
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

  function onSelectionUpdated(e: any) {
    // If the number of active objects on the canvas are more than one,
    // then lock the scaling option that keeps the object's aspect ratio fixed.
    // if (canvas.getActiveObjects().length > 1) {
    //   canvas.getActiveObject()!.lockUniScaling = true;
    // }
    // Display the context menu, this line of code is commented. If required, you can remove the comment.
    // showMenu(e);
  }

  function clearCanvasEvent() {
    // Checks if a mouseMoveHandler exists
    if (mouseMoveHandler !== null) {
      // If it exists, clear the timer associated with the mouseMoveHandler
      // This effectively ends tracking of mouse movement over the canvas
      clearInterval(mouseMoveHandler);
    }
  }

  function checkIsTrackpad(e: any) {
    const inputDevice = localStorage.getItem('inputDevice');
    if (inputDevice === 'trackpad') {
      return true;
    }

    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    let isTrackpad = false;

    const isFirefox = false; //SystemService.getInstance().getIsFirefox();

    // console.log('isFirefox', isFirefox);

    if (isMac) {
      isTrackpad = checkMacTrackpad(e);
    } else {
      isTrackpad = checkNonMacTrackpad(e, isFirefox);
    }

    return isTrackpad;
  }

  function checkMacTrackpad(e: any) {
    // console.log('checkMacTrackpad', e.deltaY );
    // Commonly, trackpads will have a non-integer `deltaY` value when scrolling, whereas a mouse will have an integer.
    // This is not universally true, but it holds up in many cases.
    const isLikelyTrackpad = e.deltaY !== Math.round(e.deltaY);

    return !isLikelyTrackpad;
  }

  function checkNonMacTrackpad(e: any, isFirefox: boolean) {
    if (isFirefox) {
      return (
        e.deltaMode === e.DOM_DELTA_PIXEL && e.deltaX === 0 && e.deltaY === 0
      );
    }

    return e.deltaY === e.wheelDeltaY * -1;
  }

  // let timer = null;

  function mouseWheelListener(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const isTrackpad = checkIsTrackpad(e) && !e.ctrlKey;

    if (e.buttons !== 0) {
      // console.log('e.buttons !== 0', e)
      return;
    }

    // if (timer && canvas.getActiveObject()) {
    //   clearTimeout(timer);
    //   timer = null;
    // }

    // timer = setTimeout(() => {

    //   showMenu()

    // }, 200);

    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    // console.log('isMac', isMac, 'isTrackpad', isTrackpad);;

    // store.dispatch(handleWidgetMenuDisplay(false));

    // const users = store.getState().user.onlineUsers;

    const deltaY = Math.abs(e.deltaY);

    if (isTrackpad) {
      const delta = { x: 0, y: 0 };
      delta.x -= e.deltaX;

      delta.y -= e.deltaY;
      // canvas.mouse.delta.x -= e.deltaX;

      // canvas.mouse.delta.y -= e.deltaY;

      canvas.isEnablePanMoving = true;

      // canvas.relativePan(canvas.mouse.delta);
      // console.log('delta', delta)
      canvas.relativePan(delta);

      // canvas.updateViewportToLocalStorage(canvas.viewportTransform);

      canvas.requestRenderAll();

      // canvas.mouse.delta.x = 0;

      // canvas.mouse.delta.y = 0;

      // if (
      //   store.getState().board.followMe &&
      //   users.length - 1 > 0
      // ) {

      //   canvas.updateViewport();

      // }

      return false;
    }

    const isPanAction =
      Math.abs(e.deltaX) !== 0 || parseInt(deltaY.toString()) === deltaY;

    if (isMac && isPanAction) {
      return false;
    }

    let zoom = canvas.getZoom();

    if (isMac) {
      zoom *= 0.999 ** (e.deltaY * 10);

      if (deltaY > 100) {
        zoom = canvas.getZoom() * 0.999 ** (e.deltaY / 6.6);
      }
    } else {
      if (isPanAction) {
        zoom = canvas.getZoom() * 0.999 ** e.deltaY;
      } else {
        zoom = canvas.getZoom() * 1.001 ** (e.wheelDelta / 2);
      }
    }

    if (zoom > 4) zoom = 4;

    if (zoom < 0.05) zoom = 0.05;

    // store.dispatch(handleSetZoomFactor(zoom));

    canvas.zoomToPoint(new Point({ x: e.layerX, y: e.layerY }), zoom);

    // canvas.updateViewportToLocalStorage(canvas.viewportTransform);

    canvas.requestRenderAll();

    // if (
    //   store.getState().board.followMe &&
    //   users.length - 1 > 0
    // ) {

    //   // canvas.updateViewport();

    // }
    const objects = canvas.getObjects();

    if (objects && objects.length > 0) {
      const zoom = canvas.getZoom();
      objects.map((obj: any) => {
        let limitWidth = obj.width * obj.scaleX * zoom;
        if (limitWidth < 32) {
          obj.set({
            hasControls: false,
          });
        } else {
          obj.set({
            hasControls: true,
          });
        }
        //deal with pic
        if (obj.objType === 'WBImage' && zoom > 0.4) {
          if (obj.src) {
            let pic = obj.src.replace('smallPic/', 'bigPic/');
            obj.set({ src: pic });
          }
        }

        if (obj.objType === 'WBImage' && zoom < 0.4) {
          if (obj.src) {
            let pic = obj.src.replace('bigPic/', 'smallPic/');
            obj.set({ src: pic });
          }
        }
      });
    }
  }

  // For all future instances of fabric.Object, transparent corners are disabled
  // fabric.Object.prototype.transparentCorners = false;

  // Set the cursor style for rotating objects in the canvas to 'alias'
  // canvas.rotationCursor = 'alias';

  // Register event listener for 'TEXT_EDITING_EXISTED' event, to call the function 'onTextEditingExited'
  canvas.on('text:editing:exited', onTextEditingExited);

  // EventService.getInstance().register(
  //   EventNames.TEXT_EDITING_EXISTED,
  //   onTextEditingExited,
  // );

  // Register event listener for 'TEXT_CHANGED' event, to call the function 'onTextChanged'
  canvas.on('text:changed', onTextChanged);
  // EventService.getInstance().register(
  //   EventNames.TEXT_CHANGED,
  //   onTextChanged,
  // );

  // Register event listener for 'CANVAS_BEFORE_SELECTION_CLEARED' event, to call the function 'onObjectSelectionCleared'
  // canvas.on('before:selection:cleared', onObjectSelectionCleared);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_BEFORE_SELECTION_CLEARED,
  //   onObjectSelectionCleared,
  // );

  // Register event listener for 'CANVAS_SELECTION_UPDATED' event, to call the function 'onSelectionUpdated'
  // canvas.on('selection:updated', onSelectionUpdated);
  // EventService.getInstance().register(
  //   EventNames.CANVAS_SELECTION_UPDATED,
  //   onSelectionUpdated,
  // );

  // Register event listener for 'CANVAS_BEFORE_SELECTION_CLEARED' event, to call the function 'onBeforeSelectionCleared'
  // canvas.on('before:selection:cleared', onBeforeSelectionCleared);

  // Registering a windowGestureStarthandler to handle a window gesture start event.
  // canvas.on('gesture:start', windowGestureStarthandler);
  // EventService.getInstance().register(
  //   EventNames.WINDOW_GESTURE_START,
  //   windowGestureStarthandler,
  // );

  // Registering a windowGestureChangeHandler to handle a window gesture change event.
  // canvas.on('gesture:change', windowGestureChangeHandler);
  // EventService.getInstance().register(
  //   EventNames.WINDOW_GESTURE_CHANGE,
  //   windowGestureChangeHandler,
  // );

  // Filter out specific object types during group selection
  canvas.on('selection:created', function (e) {
    var activeSelection = e.selected;

    // if (activeSelection.type === 'activeselection') {
    // var objects = activeSelection._objects;

    // Filter out the connectors
    var filteredObjects = activeSelection.filter(function (obj) {
      return !(obj instanceof XConnector);
    });

    if (filteredObjects.length !== activeSelection.length) {
      // Create a new active selection with the filtered objects
      var newActiveSelection = new ActiveSelection(filteredObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(newActiveSelection);
    }

    canvas.renderAll();
    // }
  });

  canvas.on('object:moving', function (e) {
    var activeObject = e.target;

    if (canvas.getActiveObjects().length > 1) {
      // Multiple objects are selected
      canvas.getActiveObjects().forEach(function (obj) {
        if (obj !== activeObject) {
          // Manually trigger the 'moving' event for each selected object
          //@ts-ignore
          obj.fire('moving', { e: e.e });
        }
      });
    } else {
      // Single object is moving
      //@ts-ignore
      activeObject.fire('moving', { e: e.e });
    }
  });

  canvas.wrapperEl.addEventListener('wheel', mouseWheelListener, true);

  // EventService.getInstance().register(
  //   EventNames.CANVAS_BEFORE_SELECTION_CLEARED,
  //   onBeforeSelectionCleared,
  // );

  // Define function 'onBeforeSelectionCleared' to crop the selected image when selection is about to be cleared
  function onBeforeSelectionCleared(e: any) {
    // Get the currently active object on the canvas
    const target = canvas.getActiveObject();
    // If the application is in crop mode
    // if (store.getState().board.cropMode) {
    // Dispatch an action to set crop mode to false
    // store.dispatch(handleSetCropMode(false));
    // Crop the parent image of the object
    //   target.parentImage.crop(target.parentImage);
    // }
  }

  // Register event listener for 'SELECTION_CLEARED' event, to call the function 'showMenu'
  // canvas.on('selection:cleared', showMenu);
  // EventService.getInstance().register(
  //   EventNames.SELECTION_CLEARED,
  //   showMenu,
  // );
}

/**
 * handle the trackpad events
 * @param {*} e
 */

// export function onTrackpadTouch(e) {
//   // Update the mouse event object information on the canvas
//   canvas.mouse.e = e;
//   // Check if the control key was pressed during the event
//   if (e.ctrlKey) {
//     // Update the mouse x and y coordinates on the canvas to match the event offsets
//     canvas.mouse.x = e.offsetX;
//     canvas.mouse.y = e.offsetY;
//     // Adjust the zoom level on the canvas based on the scroll direction
//     canvas.mouse.w = canvas.getZoom() - e.deltaY * 0.007;
//     // Flag to update the zoom level
//     canvas.mouse.zoomUpdate = true;
//   } else {
//     // If control key was not pressed, change panMovingType to 'trackpad'
//     canvas.panMovingType = 'trackpad';
//     // Update the delta x and y coordinates of the mouse on the canvas
//     canvas.mouse.delta.x -= e.deltaX;
//     canvas.mouse.delta.y -= e.deltaY;
//     // Flag to update the mouse movement
//     canvas.mouse.mouseMoveUpdate = true;
//     // Enable pan moving on the canvas
//     // canvas.isEnablePanMoving = true;
//   }
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
