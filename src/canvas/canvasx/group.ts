import * as fabric from '../../../fabric';

//Redux Store
// import store from '@/redux/store';

//Services
// import { WidgetService } from '../../../services/index';
import { WBCanvas } from './bx-canvas';

WBCanvas.prototype.ungroup = async function (object) {
  const self = this;

  // check if the object to ungroup is a 'WBGroup' and it has an ID
  if (object.obj_type === 'WBGroup' && object._id) {
    // get all objects(or widgets) from the object(group) to ungroup
    const objects = object.getObjects();

    // arrays to hold ungrouped widgets, their IDs, and states
    const widgets = [];
    const objIdArr = [];
    const toInsertWidgets = [];

    let stateList = [];

    // discard previous active object
    self.discardActiveObject();

    // loop through each object in the group
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];

      // if the object doesn't have an ID, return without doing anything
      if (!obj._id) return;

      // adjust the object's position and scale relative to the group's scale
      obj.left = object.left + obj.left * object.scaleX;
      obj.top = object.top + obj.top * object.scaleY;
      obj.scaleX *= object.scaleX;
      obj.scaleY *= object.scaleY;

      // // set the property for user and whiteboard details
      // obj.userId = store.getState().user.userInfo.userId;
      // obj.whiteboardId = store.getState().board.board._id;

      // make the object selectable in user interface
      obj.selectable = true;

      // handle special cases for 'WBImage' type
      if (obj.obj_type === 'WBImage') {
        if (obj.src.indexOf('?') > -1) [obj.src] = obj.src.split('?');
      }

      // handle special cases for 'WBArrow' type
      if (obj.obj_type === 'WBArrow') {
        objIdArr.push(obj._id);
      }

      // create the widget from the object and add it to the canvas
      const widget = await self.createWidgetAsync(obj.getObject());

      if (obj.lines && obj.lines.length > 0) {
        widget.lines = obj.lines;
      }

      self.add(widget);

      // add this widget to final list
      widgets.push(widget);
      toInsertWidgets.push(widget.getObject());

      // update the coordinates of widget
      widget.setCoords();

      // record the state of operation for undo/redo functionality
      const state = widget.getUndoRedoState('ADDED');

      // push state to the state list
      stateList = stateList.concat(state);

      // rerender the canvas
      self.requestRenderAll();
    }

    // Database operation: Insert array of widgets into database
    WidgetService.getInstance().insertWidgetArr(toInsertWidgets);

    // get and push to stateList the deleted state of the object(group)
    const state2 = self.findById(object._id).getUndoRedoState('REMOVED');
    stateList = stateList.concat(state2);

    // push the new state list to the undo/redo stack
    self.pushNewState(stateList);

    // Database operation: Remove the 'group' object from the database
    WidgetService.getInstance().removeWidget(object._id);

    // reset all the arrow objects in group, if there are any
    if (objIdArr) {
      for (let j = 0; j < objIdArr.length; j++) {
        const connObj = self.findById(objIdArr[j]);
        if (!connObj) return;
        connObj.getresetArrowaftermoving();
      }
    }

    // create and set the new Active selection with all the ungrouped widgets
    const sel = canvas.getActiveSelection();
    sel.add(...widgets);
    self.setActiveObject(sel);

    // remove the original 'group' object from the canvas
    self.remove(object);

    // rerender the canvas
    self.requestRenderAll();
  }
};

WBCanvas.prototype.group = async function (group) {
  const self = this; // canvas

  let stateList = []; // state list for undo/redo functionality

  const arrowtogroup = []; // array to hold arrow objects in group

  if (group) {
    // if the object to group is a 'WBGroup' and it has an ID

    group.scaleX = group.scaleX || 1;

    group.scaleY = group.scaleY || 1;

    const objectArr = [];

    const objIdArr = [];

    group._objects.sort((a, b) => a.zIndex - b.zIndex);

    for (const obj of group.getObjects()) {
      if (!obj._id) {
        // if the object doesn't have an ID, return without doing anything

        return;
      }

      if (obj.locked) {
        // if the object is locked, show the message and return without doing anything

        Util.Msg.info('groupReminder');

        canvas.discardActiveObject();

        canvas.requestRenderAll();

        return;
      }

      const newObj = obj.getObject(); // get the object

      const point = Util.getPointOnCanvasInGroup(obj); // get the point on canvas

      newObj.left = point.x; // set the left coordinate

      newObj.top = point.y; // set the top coordinate

      newObj.scaleX = obj.scaleX * obj.group.scaleX; // set the scaleX

      newObj.scaleY = obj.scaleY * obj.group.scaleY; // set the scaleY

      objectArr.push(newObj); // add the object to the array

      objIdArr.push(obj._id); // add the object ID to the array
    }

    for (const obj of objectArr) {
      // handle special cases for 'WBImage' type

      if (obj.lines && obj.lines.length > 0) {
        for (let i = 0; i < obj.lines.length; i++) {
          const line = obj.lines[i];

          const linewidget = canvas.findById(line._id);

          if (!linewidget) return; // if the line widget doesn't exist, return

          if (linewidget.connectorStart) {
            // if the line widget has a connector start

            if (objIdArr.lastIndexOf(lineWidget?.connectorStart?._id) < 0) {
              // modified lines
              const state0 = canvas
                .findById(lineWidget?.connectorStart?._id)
                .getUndoRedoState('MODIFIED', { fields: ['lines'] });

              stateList = stateList.concat(state0);
            }
          }

          if (linewidget.connectorEnd) {
            // if the line widget has a connector end

            if (objIdArr.lastIndexOf(lineWidget?.connectorEnd?._id) < 0) {
              // modified lines
              const state0 = canvas
                .findById(lineWidget?.connectorEnd?._id)
                .getUndoRedoState('MODIFIED', { fields: ['lines'] });

              stateList = stateList.concat(state0);
            }
          }

          if (objIdArr.lastIndexOf(line._id) < 0) {
            // if the line widget is not in the group

            if (linewidget.connectorEnd && linewidget.connectorStart) {
              if (
                objIdArr.lastIndexOf(lineWidget?.connectorEnd?._id) >= 0 &&
                objIdArr.lastIndexOf(lineWidget?.connectorStart?._id) >= 0
              ) {
                // add this arrow to the group
                if (!arrowtogroup.includes(line._id))
                  arrowtogroup.push(line._id);
              }
            } else {
              // remove the arrow
              const state0 = canvas
                .findById(line._id)
                .getUndoRedoState('REMOVED');

              stateList = stateList.concat(state0);
            }
          }
        }
      }
    }

    if (arrowtogroup.length > 0) {
      // if there are arrows in the group

      for (let i = 0; i < arrowtogroup.length; i++) {
        const objId = arrowtogroup[i];

        const obj = canvas.findById(objId);

        if (!obj) return;

        const newObj = obj.getObject();

        const point = Util.getPointOnCanvasInGroup(obj);

        newObj.left = point.x;

        newObj.top = point.y;

        objectArr.push(newObj);
      }
    }

    self.bindGroup(objectArr, async (tempGroup) => {
      // bind the group

      const groupId = await WidgetService.getInstance().insertWidget({
        angle: 0,
        width: tempGroup.width,
        height: tempGroup.height,
        left: tempGroup.left,
        top: tempGroup.top,
        lockRotation: false,
        locked: false,
        selectable: true,
        lockMovementX: false,
        lockMovementY: false,
        scaleX: 1,
        scaleY: 1,
        obj_type: 'WBGroup',
        objectArr,
        userId: store.getState().user.userInfo.userId,
        whiteboardId: store.getState().board.board._id,
        timestamp: Date.now(),
        zIndex: self.createTopZIndex,
      });

      tempGroup._id = groupId && groupId.data ? groupId.data : groupId; // set the ID of the group

      tempGroup.userId = store.getState().user.userInfo.userId; // set the user ID

      tempGroup.whiteboardId = store.getState().board.board._id; // set the whiteboard ID

      tempGroup.lockRotation = false; // set the lock rotation

      self.add(tempGroup); // add the group to the canvas

      tempGroup.setCoords(); //  set the coordinates of the group

      const state = tempGroup.getUndoRedoState('ADDED'); // get the state of the group

      stateList = stateList.concat(state); // push the state to the state list

      tempGroup.setControlVisible('mtr', false); // set the control visible

      self.setActiveObject(tempGroup); // set the group as the active object

      const arrowIds = []; // array to hold arrow IDs

      const noneArrowIds = []; // array to hold non-arrow IDs

      for (const obj of objectArr) {
        if (obj.obj_type === 'WBArrow') {
          // if the object is an arrow, push it to the arrow IDs array

          arrowIds.push(obj._id);
        }

        if (obj.obj_type !== 'WBArrow' && obj.obj_type !== 'common') {
          // if the object is not an arrow, push it to the non-arrow IDs array

          noneArrowIds.push(obj._id);
        }
      }

      for (const aid of arrowIds) {
        if (!canvas.findById(aid)) break;

        const state2 = canvas.findById(aid).getUndoRedoState('REMOVED'); // get the state of the arrow

        stateList = stateList.concat(state2); // push the state to the state list

        WidgetService.getInstance().removeWidget(aid); // remove the arrow from the database

        self.removeById(aid); // remove the arrow from the canvas
      }

      for (const naid of noneArrowIds) {
        // loop through each non-arrow object

        if (!canvas.findById(naid)) break;

        const state2 = canvas.findById(naid).getUndoRedoState('REMOVED'); // get the state of the object

        stateList = stateList.concat(state2); // push the state to the state list

        WidgetService.getInstance().removeWidget(naid); // remove the object from the database

        self.removeById(naid); // remove the object from the canvas
      }

      canvas.pushNewState(stateList); // push the state list to the undo/redo stack

      self.requestRenderAll(); //  rerender the canvas
    });
  }
};

WBCanvas.prototype.alignGroupObjects = function (curentObject, alignment) {
  const self = this;
  const canvas: WBCanvas = self;

  const tempobjects = curentObject.getObjects();

  const objects: BXObject[] = [];

  tempobjects.forEach((obj: any) => {
    if (obj.obj_type !== 'WBArrow') {
      objects.push(obj);
    }
  });

  canvas.discardActiveObject();

  canvas.requestRenderAll();

  const activeSelectionnoArrow = objects;

  const selnoArrow = canvas.getActiveSelection();

  selnoArrow.add(...activeSelectionnoArrow);

  canvas.setActiveObject(selnoArrow);

  if (alignment === 'VLeft') {
    const leftObject = Util.getLeftObject(objects);

    const { left } = leftObject;

    objects.forEach((obj: any) => {
      obj.left =
        left -
        (leftObject.width * leftObject.scaleX) / 2 +
        (obj.width * obj.scaleX) / 2;

      obj.setCoords();

      self.requestRenderAll();
    });

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'VRight') {
    const rightObject = Util.getRightObject(objects);

    const right = rightObject.left;

    objects.forEach((obj: any) => {
      obj.left =
        right +
        (rightObject.width * rightObject.scaleX) / 2 -
        (obj.width * obj.scaleX) / 2;

      obj.setCoords();

      self.requestRenderAll();
    });

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'VCenter') {
    const rightObject = Util.getRightObject(objects);

    const right = rightObject.left;

    const leftObject = Util.getLeftObject(objects);

    const { left } = leftObject;

    objects.forEach((obj: any) => {
      obj.left = (right + left) / 2;
      obj.setCoords();
    });

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'DistrH') {
    const leftObject = Util.getLeftObject(objects);

    const leftleft = leftObject.left;

    const leftId = leftObject._id;

    const lefthalfwidth = (leftObject.width * leftObject.scaleX) / 2;

    const rightObject = Util.getRightObject(objects);

    const rightleft = rightObject.left;

    const rightId = rightObject._id;

    const righthalfwidth = (rightObject.width * rightObject.scaleX) / 2;

    const lrdistance = rightleft - leftleft + lefthalfwidth + righthalfwidth;

    let widthsum = 0;

    let sum = 0;

    let sameObjbool = false;

    if (leftId === rightId) {
      sameObjbool = true;

      sum = objects.length - 1;
    } else {
      sameObjbool = false;

      sum = objects.length;
    }

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];

      if (!sameObjbool) {
        widthsum += obj.width * obj.scaleX;
      } else if (obj._id !== leftId) widthsum += obj.width * obj.scaleX;
    }

    if (!sameObjbool) {
      const space = (lrdistance - widthsum) / (sum - 1);

      const sortObjects = Util.getHSortObjects(objects);

      let currPos = leftleft + lefthalfwidth + space;

      for (let i = 1; i < sortObjects.length - 1; i++) {
        const obj = sortObjects[i];

        if (obj._id !== leftId && obj._id !== rightId) {
          // adjust H location
          obj.left = currPos + (obj.width * obj.scaleX) / 2;

          obj.setCoords();

          self.requestRenderAll();

          currPos += obj.width * obj.scaleX + space;
        }
      }
    } else {
      const space = (lrdistance - widthsum) / sum;

      const sortObjects = Util.getHSortObjects(objects);

      let currPos = leftleft - lefthalfwidth + space;

      for (let i = 0; i < sortObjects.length; i++) {
        const obj = sortObjects[i];

        if (obj._id !== leftId && obj._id !== rightId) {
          // adjust H location
          obj.left = currPos + (obj.width * obj.scaleX) / 2;

          obj.setCoords();

          self.requestRenderAll();

          currPos += obj.width * obj.scaleX + space;
        }
      }
    }

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'HTop') {
    const topObject = Util.getTopObject(objects);

    const { top } = topObject;

    objects.forEach((obj: any) => {
      obj.top =
        top -
        (topObject.height * topObject.scaleY) / 2 +
        (obj.height * obj.scaleY) / 2;

      obj.setCoords();

      self.requestRenderAll();
    });

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'HBottom') {
    const bottomObject = Util.getBottomObject(objects);

    const bottom = bottomObject.top;

    objects.forEach((obj: any) => {
      obj.top =
        bottom +
        (bottomObject.height * bottomObject.scaleY) / 2 -
        (obj.height * obj.scaleY) / 2;

      obj.setCoords();

      self.requestRenderAll();
    });

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'HCenter') {
    const bottomObject = Util.getBottomObject(objects);

    const bottom = bottomObject.top;

    const topObject = Util.getTopObject(objects);

    const { top } = topObject;

    objects.forEach((obj: any) => {
      obj.top = (bottom + top) / 2;
      obj.setCoords();
      self.requestRenderAll();
    });

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  if (alignment === 'DistrV') {
    const bottomObject = Util.getBottomObject(objects);

    const bottom = bottomObject.top;

    const bottomhalfheight = (bottomObject.height * bottomObject.scaleY) / 2;

    const bottomId = bottomObject._id;

    const topObject = Util.getTopObject(objects);

    const { top } = topObject;

    const tophalfheight = (topObject.height * topObject.scaleY) / 2;

    const topId = topObject._id;

    const tbdistance = bottom - top + tophalfheight + bottomhalfheight;

    let heightsum = 0;

    let sum = 0;

    let sameObjbool = false;

    if (topId === bottomId) {
      sameObjbool = true;

      sum = objects.length - 1;
    } else {
      sameObjbool = false;

      sum = objects.length;
    }

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];

      if (!sameObjbool) {
        heightsum += obj.height * obj.scaleX;
      } else if (obj._id !== topId) heightsum += obj.height * obj.scaleX;
    }

    if (!sameObjbool) {
      const space = (tbdistance - heightsum) / (sum - 1);

      const sortObjects = Util.getVSortObjects(objects);

      let currPos = top + tophalfheight + space;

      for (let i = 1; i < sortObjects.length - 1; i++) {
        const obj = sortObjects[i];

        if (obj._id !== topId && obj._id !== bottomId) {
          // adjust H location
          obj.top = currPos + (obj.height * obj.scaleX) / 2;

          obj.setCoords();

          self.requestRenderAll();

          currPos += obj.height * obj.scaleX + space;
        }
      }
    } else {
      const space = (tbdistance - heightsum) / sum;

      const sortObjects = Util.getVSortObjects(objects);

      let currPos = top - tophalfheight + space;

      for (let i = 0; i < sortObjects.length; i++) {
        const obj = sortObjects[i];

        if (obj._id !== topId && obj._id !== bottomId) {
          // adjust H location
          obj.top = currPos + (obj.height * obj.scaleX) / 2;

          obj.setCoords();

          self.requestRenderAll();

          currPos += obj.height * obj.scaleX + space;
        }
      }
    }

    selnoArrow.saveData('MOVED', ['left', 'top']);
  }

  self.discardActiveObject();

  const activeSelection = objects;

  const sel = canvas.getActiveSelection();

  sel.add(...activeSelection);

  canvas.setActiveObject(sel);
};

WBCanvas.prototype.bindGroup = async function (objectArr, callback) {
  // Save context
  const self = this;

  // Get currently active group
  const currentGroup = self.getActiveObject();

  // Initialize an array to store objects
  const objects = [];

  // Variables to store left and top coordinates
  let left;
  let top;

  // If objectArr is empty or null call the callback and return
  if (!objectArr || objectArr.length === 0) {
    return callback && callback(null);
  }

  // If a group is already active, store its left and top coordinates
  if (currentGroup) {
    left = currentGroup.left;
    top = currentGroup.top;
  }

  // Loop over the objects in objectArr
  for (const obj of objectArr) {
    // Create widget for each object and add it to objects array
    const object = await self.createWidgetAsync(obj);

    if (object && object.obj_type === 'WBImage') {
      // If object is an image and its source contains '?', remove the query string
      if (object.src.indexOf('?') > -1) {
        [object.src] = object.src.split('?');
      }
    }

    // Add the crafted fabric object to the array
    objects.push(object);
  }

  // Create a new fabric.Group with the array of objects. Assign properties
  const group = new fabric.Group(objects, {
    obj_type: 'WBGroup',
    lockRotation: true,
    originX: 'center',
    originY: 'center',
    lockUniScaling: true,
    zIndex: self.group_zIndex || Date.now() * 100,
  });

  self.group_zIndex = null;

  // If left and top coordinates were stored, set them to the newly created group
  if (left) group.left = left;

  if (top) group.top = top;

  // Call the callback with the newly created group as the argument
  return callback && callback(group);
};
