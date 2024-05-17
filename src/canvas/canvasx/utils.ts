// import * as fabric from '../../../fabric';
//@ts-ignore
import $ from 'jquery';
//Redux Store
// import store from '@/redux/store';
import { WBCanvas } from '../canvasx/bx-canvas';
import { ActiveSelection } from '../../shapes/ActiveSelection';
// import { ClipboardService } from '@/services';
// import { Util } from '@/utils/util';
// import { BXObject } from '@/x-canvas/shapes/object/bx-object';

WBCanvas.prototype.removeById = function (id) {
  // Save a reference to the current fabric.Canvas instance
  const self = this;

  // Loop through each object on the canvas
  self.getObjects().forEach((obj: any) => {
    // If the object's id (_id) matches the target id
    if (obj._id === id) {
      // Remove that object from the canvas
      self.remove(obj);
    }
  });
};

WBCanvas.prototype.findById = function (id: string) {
  const canvas = this;
  const obj = canvas?.getObjects().filter((widget: any) => widget._id === id);
  if (obj.length === 0) return null;
  return obj[0];
};

WBCanvas.prototype.selectAllWidgets = function () {
  const canvas: WBCanvas = this;
  const objects = canvas.getObjects(); // Get all objects on the canvas

  const selectedObjects = objects.filter(
    (obj: any) =>
      obj._id !== undefined && !obj.locked && obj.obj_type !== 'common'
  );

  if (selectedObjects && selectedObjects.length > 0) {
    const activeSelection = new ActiveSelection(selectedObjects, {
      canvas: canvas,
    });

    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }
};

WBCanvas.prototype.resetCoordsOnScreen = function () {
  // Get all objects on the canvas
  const objs = this.getObjects();

  // Check if there are any objects on the canvas
  if (objs && objs.length > 0) {
    // For each object on the canvas
    this.getObjects().forEach((obj: any) => {
      // If the object is on the screen
      if (obj.isOnScreen()) {
        // Reset its coordinates
        obj.setCoords();
      }
    });
  }
};

WBCanvas.prototype.getCenterPointOfScreen = () => {
  const cvsOffset = $('#canvasContainer').offset(); // Get the offset of the canvas container

  // Calculate the coordinates of the center point
  const left = window.innerWidth / 2 - cvsOffset.left;
  const top = window.innerHeight / 2 - cvsOffset.top;

  // Store and return the coordinates in a position object
  const position = { x: left, y: top };
  return position;
};

// Adding a new method 'getAbsoluteCoords' to the fabric.Canvas object
// This method calculates the absolute coordinates of the given object based on the offset value of the canvas
WBCanvas.prototype.getAbsoluteCoords = function (object) {
  return {
    left: object.left + this._offset.left,
    top: object.top + this._offset.top,
  };
};

// Adding a new method 'getCurCanvasSize' to the fabric.Canvas object
// This method returns the current viewport transformation, effectively representing the current size of the canvas
WBCanvas.prototype.getCurCanvasSize = function () {
  const size = this.viewportTransform;
  return size;
};

// Adding a new method 'getContentArea' to the fabric.Canvas object
// This method gets the coordinates area of all non-common objects on the canvas
WBCanvas.prototype.getContentArea = function () {
  const self: WBCanvas = this;

  // Discard the currently active object on the canvas
  self.discardActiveObject();

  // Get all the objects on the canvas that are not of type 'common' or 'WBFile'
  const activeSelection = self
    .getObjects()
    .filter((o) => o.obj_type !== 'common' && o.obj_type !== 'WBFile');

  // Create a new active selection
  const sel = new fabric.ActiveSelection(activeSelection, {
    canvas: self,
  });

  // Set the newly created active selection as the currently active selection in the canvas
  self.setActiveObject(sel);

  // Return the active selection
  return sel.aCoords;
};

WBCanvas.prototype.toDataURLContent = function (multiplier) {
  const self: WBCanvas = this;

  const originalTransform = self.viewportTransform;

  self.viewportTransform = [0.05, 0, 0, 0.05, 0, 0];

  const aCoordsOfContent = self.getContentArea() || {
    tl: { x: 0, y: 0 },
    br: { x: 0, y: 0 },
  };

  self.showBackgroundDots = false;

  self.backgroundColor = '#fff';

  const { tl }: { tl: any } = aCoordsOfContent;

  const { br }: { br: any } = aCoordsOfContent;

  const width = (br.x - tl.x) * 0.05;

  const height = (br.y - tl.y) * 0.05;

  const dataUrl = self.toDataURL({
    format: 'png',
    multiplier,
    left: tl.x * 0.05,
    top: tl.y * 0.05,
    width: width,
    height: height,
  });

  self.viewportTransform = originalTransform;

  return dataUrl;
};

WBCanvas.prototype.captureThumbnail = function () {
  const self = this;

  const originalTransform = self.viewportTransform;

  self.zoomToViewAllObjects();

  self.showBackgroundDots = false;

  self.backgroundColor = '#fff';

  const dataUrl = self.toDataURL({
    format: 'png',
    multiplier: 5,
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  self.viewportTransform = originalTransform;

  // store.dispatch(handleSetCaptureThumbnail(dataUrl));

  // let name = store.getState().board.board.name;

  // store.dispatch(handleSetCaptureThumbnailBoardName(name));

  return dataUrl;
};

WBCanvas.prototype.getObjectByID = function (id) {
  const self = this;

  const objs = self.getObjects().filter((obj:any) => obj._id === id);

  if (objs.length > 0) return objs[0];

  return null;
};

WBCanvas.prototype.planNewLayout = function (objects: any, numOfColumns: any) {
  const canvas = this;
  const self = this;

  let _objects = objects;

  let _numOfColumns = numOfColumns;

  _numOfColumns = parseInt(numOfColumns, 10);

  self.discardActiveObject();

  let leftOffset = 0;

  let topOffset = 0;

  const leftObject = Util.getLeftObject(objects);

  const topObject = Util.getTopObject(objects);

  const { left } = leftObject;

  let { top } = topObject;

  _objects = objects.sort((a, b) => a.zIndex - b.zIndex);

  _objects = objects.sort((a, b) =>
    a.backgroundColor.localeCompare(b.backgroundColor)
  );

  _objects = objects.sort((a, b) => a.obj_type.localeCompare(b.obj_type));

  objects.forEach((_obj, index) => {
    const index1 = index + 1;

    if (index1 % _numOfColumns === 1 || _numOfColumns === 1) {
      _obj.left = left;

      _obj.top = top;

      _obj.setCoords();

      topOffset = _obj.height * _obj.scaleY;

      leftOffset = leftOffset + (_obj.width / 2) * _obj.scaleX;

      if (_numOfColumns === 1) {
        top = top + topOffset + 10;
        topOffset = 0;
        leftOffset = 0;
      }
    } else {
      _obj.left = left + leftOffset + (_obj.width / 2) * _obj.scaleX + 10;

      _obj.top = top;

      _obj.setCoords();

      if (_obj.height * _obj.scaleY > topOffset) {
        topOffset = _obj.height * _obj.scaleY;
      }

      if (index1 % _numOfColumns === _numOfColumns) {
        leftOffset = 0;
      } else {
        leftOffset = leftOffset + _obj.width * _obj.scaleX + 10;
      }

      if (index1 % _numOfColumns === 0) {
        top = top + topOffset + 10;

        topOffset = 0;

        leftOffset = 0;
      }
    }
  });

  const activeSelection = _objects;

  const sel = canvas.getActiveSelection();

  sel.add(...activeSelection);

  self.setActiveObject(sel);
  self.getActiveObject().saveData('MOVED', ['left', 'top']);
};

WBCanvas.prototype.clearData = function () {
  const self = this;

  if (self._objects) {
    for (let i = self._objects.length - 1; i >= 0; i--) {
      self.remove(self._objects[i]);
    }
  }
};

WBCanvas.prototype.getNewPositionNextToActiveObject = function (direction) {
  const canvas = this;
  let position = { x: 0, y: 0 };
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return position;

  if (direction === 'right') {
    position = {
      x:
        activeObject.aCoords.tr.x +
        10 +
        (activeObject.aCoords.tr.x - activeObject.aCoords.tl.x) / 2,
      y:
        activeObject.aCoords.tr.y +
        (activeObject.aCoords.br.y - activeObject.aCoords.tr.y) / 2,
    };
  } else if (direction === 'bottom') {
    position = {
      x:
        activeObject.aCoords.bl.x +
        (activeObject.aCoords.br.x - activeObject.aCoords.bl.x) / 2,
      y:
        activeObject.aCoords.bl.y +
        10 +
        (activeObject.aCoords.bl.y - activeObject.aCoords.tl.y) / 2,
    };
  }
  return position;
};

WBCanvas.prototype.duplicateWidget = async function (direction) {
  const canvas = this;
  let position = canvas.getNewPositionNextToActiveObject(direction);
  const activeObject: any = canvas.getActiveObject();
  const boardId = store.getState().board.board._id;
  const userId = store.getState().user.userInfo.userId;
  const dataToPaste = activeObject?._objects
    ? activeObject?._objects.map((r: BXObject) => r.getObject())
    : [activeObject.getObject()];

  canvas.discardActiveObject();

  await ClipboardService.pasteCallback(
    [],
    JSON.stringify({ data: dataToPaste, type: 'whiteboard' }),
    position,
    boardId,
    userId
  );
};
