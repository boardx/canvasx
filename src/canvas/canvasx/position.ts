import * as fabric from '../../../fabric';
import { WBCanvas } from '../../canvas/canvasx/bx-canvas';
import { XY } from '../../../fabric';
import { FabricObject } from '../../shapes/Object/Object';
import * as util from '../../util';

WBCanvas.prototype.getNextObjectByPoint = function (
  point: XY,
  width: number,
  height: number
) {
  const self: WBCanvas = this;
  // Convert the passed point from the board coordinate system to the canvas one
  const pointOnCanvas = self.getPositionOnCanvas(point.x, point.y);

  // Format the obtained coordinates a bit, making it more convenient to work with
  const pointOnCanvas2 = { x: pointOnCanvas.x, y: pointOnCanvas.y };

  // Retrieve all the objects that are located around the specified point on the canvas
  let objects = self.getObjectsAroundPointByDistance(pointOnCanvas2);

  // Filtering out unwanted object types
  objects = objects.filter(
    (o: any) =>
      o.obj_type === 'WBRectNotes' ||
      o.obj_type === 'WBCircleNotes' ||
      o.obj_type === 'WBTextbox' ||
      o.obj_type === 'WBText'
  );

  // If there are no objects of the specified types around the point, we return null
  if (objects.length === 0) return null;

  // Getting the nearest object
  const closeObject: any = objects[0];

  // Calculating the absolute width and height of the closest object
  width = closeObject.width * closeObject.scaleX;
  height = closeObject.height * closeObject.scaleY;

  // Getting the coordinates of the top left and bottom right corners of the board
  const { tl } = closeObject.aCoords;
  const { br } = closeObject.aCoords;

  // Constructing an object that will hold details of the closest object
  const obj = {
    width: closeObject.width,
    height: closeObject.height,
    scaleX: closeObject.scaleX,
    scaleY: closeObject.scaleY,
    fontSize: closeObject.fontSize,
    fontFamily: closeObject.fontFamily,
    fontWeight: closeObject.fontWeight,
    textAlign: closeObject.textAlign,
    backgroundColor: closeObject.backgroundColor,
    obj_type: closeObject.obj_type,
    fill: closeObject.fill,
    left: 0,
    top: 0,
  };

  // Checking the position of the point relative to the closest object and calculating the position
  // of the next object based on that

  // Check if the point is above the object
  if (
    pointOnCanvas2.y < tl.y &&
    pointOnCanvas2.x > tl.x &&
    pointOnCanvas2.x < br.x
  ) {
    // Calculating the position for the next object
    obj.left = tl.x + width / 2.0 + 0.5;
    obj.top = tl.y - 10 - height + height / 2.0;
    return obj;
  }

  // Check if the point is below the object
  if (
    pointOnCanvas2.y > br.y &&
    pointOnCanvas2.x > tl.x &&
    pointOnCanvas2.x < br.x
  ) {
    // Calculating the position for the next object
    obj.left = tl.x + width / 2.0 + 0.5;
    obj.top = br.y + 10 + height / 2.0;
    return obj;
  }

  // Check if the point is to the left of the object
  if (
    pointOnCanvas2.x < tl.x &&
    pointOnCanvas2.y < br.y &&
    pointOnCanvas2.y > tl.y
  ) {
    // Calculating the position for the next object
    obj.left = tl.x - 10 - width + width / 2;
    obj.top = tl.y + height / 2 + 0.5;
    return obj;
  }

  // Check if the point is to the right of the object
  if (
    pointOnCanvas2.x > br.x &&
    pointOnCanvas2.y < br.y &&
    pointOnCanvas2.y > tl.y
  ) {
    // Calculating the position for the next object
    obj.left = br.x + 10 + width / 2;
    obj.top = tl.y + height / 2 + 0.5;
    return obj;
  }

  // If the point is not above, below, to the left or to the right of the closest object, return null
  return null;
};

WBCanvas.prototype.getObjectsAroundPointByDistance = function (point: XY) {
  // Retrieve coordinates from the specified point.
  const { x } = point;
  const { y } = point;

  // Acquire all objects from the canvas.
  const compareObjects: FabricObject[] = this._objects as FabricObject[];

  // Define the radius of the circle around the point in which to search for objects.
  const scope = 200;

  // Initialise an array to store the found objects.
  let objects: any[] = [];

  // Placeholder for the current object being looked at in the loop.
  let currentObject: any;

  // Define the square area within which to search for objects.
  const x1 = x - scope;
  const y1 = y - scope;
  const x2 = x + scope;
  const y2 = y + scope;

  // Create two new points representing the corners of the search area.
  const selectionX1Y1 = new fabric.Point(Math.min(x1, x2), Math.min(y1, y2));
  const selectionX2Y2 = new fabric.Point(Math.max(x1, x2), Math.max(y1, y2));

  // Iterate through all the objects on canvas, in reverse order.
  for (let i = compareObjects.length; i--; ) {
    // Get the current object.
    currentObject = compareObjects[i];

    /* Verify whether the object is eligible such as it must be an object, visible, 
    and not be of certain types or part of a group. */
    const notValid =
      !currentObject ||
      !currentObject.visible ||
      currentObject.obj_type === 'WBLine' ||
      currentObject.obj_type === 'WBArrow' ||
      currentObject.obj_type === 'common' ||
      currentObject.group;

    // Check if the object is in the search scope.
    const isInScope =
      currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) ||
      currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) ||
      currentObject.containsPoint(selectionX1Y1) ||
      currentObject.containsPoint(selectionX2Y2);

    // If the object is valid and in scope, add it to the array.
    if (!notValid && isInScope) {
      objects.push(currentObject);
    }
  }

  // Sort the objects by distance to the specified point, shortest distance first.
  objects = objects.sort((a, b) => {
    const aCenter = a.getCenterPoint();
    const bCenter = b.getCenterPoint();
    const aLen = Math.sqrt(
      (aCenter.x - x) * (aCenter.x - x) + (aCenter.y - y) * (aCenter.y - y)
    );
    const bLen = Math.sqrt(
      (bCenter.x - x) * (bCenter.x - x) + (bCenter.y - y) * (bCenter.y - y)
    );
    return aLen - bLen;
  });

  // Return the array of found objects.
  return objects;
};
// This function fetches all objects near the specified object by distance.

WBCanvas.prototype.getObjectsAroundObjectByDistance = function (
  object: FabricObject
) {
  // Get center point of the input object.
  const { x, y } = object.getCenterPoint();

  // Get id of the input object.
  //@ts-ignore
  const id = object._id;

  // Acquire all objects present on the canvas.
  const compareObjects: FabricObject[] = this._objects as FabricObject[];

  // Define the scope around the object within which to look for other objects. It's dependent on object's size and scale.
  const scope = 250 * object.scaleX + (object.width / 2) * object.scaleX;

  // Initialising an array to store the located objects.
  let objects = [];

  // Placeholder for the current object being looked at in the loop.
  let currentObject: any;

  // Defining the square area inside which to search for objects.
  const x1 = x - scope;
  const y1 = y - scope;
  const x2 = x + scope;
  const y2 = y + scope;

  // Create two new points representing the corners of the area to be searched.
  const selectionX1Y1 = new fabric.Point(Math.min(x1, x2), Math.min(y1, y2));
  const selectionX2Y2 = new fabric.Point(Math.max(x1, x2), Math.max(y1, y2));

  // Iterate through all the objects of canvas, in reverse order.
  for (let i = compareObjects.length; i--; ) {
    // Get currently looked object.
    currentObject = compareObjects[i];

    // Check whether the object is not disqualified based on its attributes.
    const notValid =
      !currentObject ||
      !currentObject.visible ||
      currentObject.obj_type === 'WBLine' ||
      currentObject.obj_type === 'WBArrow' ||
      currentObject.obj_type === 'common' ||
      currentObject.group ||
      currentObject._id === id;

    // Check if the object is within the defined search area.
    const isInScope =
      currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) ||
      currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) ||
      currentObject.containsPoint(selectionX1Y1) ||
      currentObject.containsPoint(selectionX2Y2);

    // If the object is valid and is within the area, then add it to the array.
    if (!notValid && isInScope) {
      objects.push(currentObject);
    }
  }

  // Sort the objects array based on the distance to the input object, shortest distance comes first.
  objects = objects.sort((a, b) => {
    const aCenter = a.getCenterPoint();
    const bCenter = b.getCenterPoint();
    const aLen = Math.sqrt(
      (aCenter.x - x) * (aCenter.x - x) + (aCenter.y - y) * (aCenter.y - y)
    );
    const bLen = Math.sqrt(
      (bCenter.x - x) * (bCenter.x - x) + (bCenter.y - y) * (bCenter.y - y)
    );
    return aLen - bLen;
  });

  // Return the array of found objects.
  return objects;
};

WBCanvas.prototype.getPositionOnScreenFromCanvas = function (
  left: number,
  top: number
) {
  // Stores a reference to the canvas instance
  const self = this;

  // Uses fabric's utility method 'transformPoint' to calculate the point's
  // position on screen by applying the canvas's viewportTransform on the point
  return util.transformPoint({ x: left, y: top }, self.viewportTransform);
};

// Defines a method on the fabric.Canvas prototype to convert a point's
// position from screen coordinates to canvas coordinates
WBCanvas.prototype.getPositionOnCanvas = function (left, top) {
  // If the horizontal or vertical coordinates are not defined, default them to 0
  if (!left) {
    left = 0;
  }
  if (!top) {
    top = 0;
  }

  // Uses fabric's utility method 'transformPoint' to calculate the point's
  // position on the canvas by applying the inverted viewportTransform on the point
  const point = util.transformPoint(
    {
      x: left,
      y: top,
    },
    util.invertTransform(this.viewportTransform)
  );

  // Returns the transformed coordinates in an object format
  return {
    x: point.x,
    y: point.y,
  };
};
