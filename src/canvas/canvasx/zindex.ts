import _ from 'underscore';
import * as fabric from '../../../fabric';
import { WBCanvas } from '@/x-canvas/canvas';
import { WBObject } from '@/x-canvas/shapes/object/bx-object';

WBCanvas.prototype.getTopObjectByPointer = function (point, ismouseup, isFrom) {
  // Initialize all objects present on the canvas
  const objects = this.getObjects();

  // Array to store relevant objects
  const objArray: fabric.FabricObject[] = [];

  // Traversing each object to check if the point is within its bounds
  objects.forEach((obj: WBObject) => {
    if (
      obj &&
      // Checking if the point is within the object
      obj.containsPointNew(point, ismouseup, isFrom) &&
      // Checking to ensure that the object is not of type "common" or "WBArrow"
      obj.obj_type !== 'common' &&
      obj.obj_type !== 'WBArrow'
    ) {
      // If all conditions met, object is pushed to the array
      objArray.push(obj);
    }
  });

  // Sorting the objects in the array based on their z-index
  objArray.sort((a, b) => b.zIndex - a.zIndex);

  // If array contains objects, return the top-most object (relative to the z-index)
  if (objArray.length > 0) {
    return objArray[0];
  }

  // Return null if no relevant objects found
  return null;
};

WBCanvas.prototype._getIntersectedObjects = function (object) {
  const self = this;

  // Initialize all objects present on the canvas, excluding objects of "common" type
  const objects = self._objects.filter((o) => o.obj_type !== 'common');

  // Array to store intersected objects
  const newArray = [];

  // Traversing each object to check if it intersects with the input object
  objects.forEach((obj: any) => {
    // Checking if the objects intersect
    const isIntersecting =
      object.intersectsWithObject(obj) ||
      object.isContainedWithinObject(obj) ||
      obj.isContainedWithinObject(object);

    // If the objects intersect and the object on the canvas is visible, it is added to the array
    if (isIntersecting && obj.visible) {
      newArray.push(obj);
    }
  });

  // Returns the array of intersected objects
  return newArray;
};

WBCanvas.prototype.sortByZIndex = function () {
  const self = this;

  // Sorting all objects on the canvas based on their z-index
  self._objects.sort((a, b) => a.zIndex - b.zIndex);

  // Rendering all changes
  self.requestRenderAll();
};

WBCanvas.prototype.createTopZIndex = function () {
  const self = this;

  let topZindex = Date.now() * 100;

  if (self._objects.length > 0) {
    self._objects.sort((a, b) => b.zIndex - a.zIndex);

    if (topZindex < self._objects[0].zIndex)
      topZindex = self._objects[0].zIndex + 1;
  }

  return topZindex;
};

/* to do: maybe improve this function to better handler the zindex change */
WBCanvas.prototype.createUniqueZIndex = function (inputZindex, tohigher) {
  // Define the scope as the canvas
  const self = this;

  // Initialise the way to create a unique zIndex
  let uniqueZIndex;

  // Create a filtered array containing objects that have both an ID and a zIndex
  const objsWithId = self._objects.filter((o) => o._id && o.zIndex);

  // Find the index of the object that has the provided zIndex
  const inputIndx = objsWithId.findIndex((obj) => obj.zIndex === inputZindex);

  // Check if the z-index needs to be increased
  if (tohigher) {
    // go to higher ZIndex
    // If the object exists that has the index greater than the provided index
    if (objsWithId[inputIndx + 1]) {
      // set the new zIndex as the average between the original element z-index and the next one
      uniqueZIndex = 0.5 * (inputZindex + objsWithId[inputIndx + 1].zIndex);
    } else {
      // If there isn't a next object, increase the zIndex by 100
      uniqueZIndex = inputZindex + 100;
    }
  }

  // Check if the z-index needs to be decreased
  if (!tohigher) {
    // go to lower ZIndex
    // If there is a previous object
    if (inputIndx > 0) {
      // set the new zIndex as the average between the original element z-index and the previous one
      uniqueZIndex = 0.5 * (inputZindex + objsWithId[inputIndx - 1].zIndex);
    } else {
      // If there isn't a previous object, decrease the zIndex by 100
      uniqueZIndex = inputZindex - 100;
    }
  }

  // Return the unique zIndex
  return uniqueZIndex;
};

WBCanvas.prototype.zindexArrBetween = function (lowz, highz, size) {
  // Calculate the interval between two indexes based on the number of elements between them
  const zInterval = size > 0 ? (highz - lowz) / (size + 1) : null;

  // If there is an interval
  if (zInterval) {
    // Increase the lower limit by the interval
    const newlowZ = lowz + zInterval;
    // Create an array that includes all the zIndex between lowz and highz
    const zindexArrB = _.range(newlowZ, highz, zInterval);

    // Return the array of z-indicies
    return zindexArrB;
  }
};
