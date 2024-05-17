import * as fabric from '../../../fabric';

//Store

// import { handleWidgetMenuDisplay } from '@/redux/features/board.slice';

// //Services
// import {
//   WidgetService,
//   UtilityService,
//   BoardService,
// } from '../../../services/index';

//functions
// import showMenu from '../../../boardApp/widgetMenu/ShowMenu';
import { alignmentGuideLines } from './WBAlignmentGuidelinesc';

//@ts-ignore
import { WBCanvas } from '../canvasx/bx-canvas';

let currentZoom = 1;

// Create a new "state" variable within the fabric.Canvas prototype, using a reactive dictionary for reactive programming
// WBCanvas.prototype.state = {};

// Indicate that object scaling must be uniform (equal in all dimensions)
WBCanvas.prototype.uniformScaling = true;

// Store the previous transform state of the canvas
// WBCanvas.prototype.previousViewportTransform ;

// Indicate if a current selection is fully contained within the canvas
WBCanvas.prototype.selectionFullyContained = false;

// Do not render items that are offscreen for performance
WBCanvas.prototype.skipOffscreen = true;

// Preserve the order of objects in the canvas
WBCanvas.prototype.preserveObjectStacking = true;

// Set tolerance for finding targets (objects) within the canvas
WBCanvas.prototype.targetFindTolerance = 8;

// Stop event to animate rectangle in the canvas
WBCanvas.prototype.stopAnimateToRectStatus = false;

// Stop event to animate specific object to position in the canvas
WBCanvas.prototype.stopAnimateObjectToPositionStatus = false;

// Set the mouse cursor representation while moving an object within the canvas
WBCanvas.prototype.moveCursor = 'default';

// Set the color of the selection area within the canvas
WBCanvas.prototype.selectionColor = 'rgba(179, 205, 253, 0.5)';

// Set the color of the border of the selected area within the canvas
WBCanvas.prototype.selectionBorderColor = '#31A4F5';

// Set the width of the line for the selected area within the canvas
WBCanvas.prototype.selectionLineWidth = 1;

// Allow middle click events to be fired within the canvas
WBCanvas.prototype.fireMiddleClick = true;

// Show background dots within the canvas
WBCanvas.prototype.showBackgroundDots = true;

// Define a method to reset the background image of the canvas
WBCanvas.prototype.resetBackgoundImage = function () {
  const self = this;

  let zoom = self.getZoom();

  // Adjust pattern and dot size based on zoom to maintain clarity
  let patternSize = 15;
  let dotSize = 1; // Increase dot size for better visibility at high zoom
  let scaledPatternSize = patternSize / zoom;
  let scaledDotSize = dotSize / zoom;

  // Consider using a higher resolution for the pattern canvas
  let patternSourceCanvas = new fabric.StaticCanvas(null, {
    width: scaledPatternSize,
    height: scaledPatternSize,
  });
  if (zoom > 0.3 && zoom < 2) {
    // Adjust dot properties to ensure it remains sharp at higher zoom levels
    let dot = new fabric.Circle({
      radius: scaledDotSize / 2, // Adjust radius to keep the dot visible and sharp
      fill: '#aaa',
      left: scaledPatternSize / 2,
      top: scaledPatternSize / 2,
      originX: 'center',
      originY: 'center',
    });

    // Add the dot to the pattern canvas
    patternSourceCanvas.add(dot);
    patternSourceCanvas.renderAll();
  } else {
    patternSourceCanvas.clear();
  }

  // Create a new pattern using the pattern canvas as the source
  const backgroundColor = new fabric.Pattern({
    source: patternSourceCanvas.getElement(),
    repeat: 'repeat',
    crossOrigin: 'anonymous',
  });

  // Set the generated pattern as the background
  self.set({
    backgroundColor: backgroundColor,
  });
  self.requestRenderAll();
};

/**
 * This function checks if the background of the canvas needs a reset.
 * The canvas background might need a reset if the zoom factor has crossed certain
 * threshold values. The zoom values are rounded off to the nearest threshold
 * before making comparisons for reset.
 */

WBCanvas.prototype.checkIfResetBackground = function () {
  const self = this;

  // A helper function to get a zoom value rounded nearest to pre-defined zoom stages
  const getRoundZoom = (zoom: number) => {
    // Convert zoom level to percentage
    let roundZoom = Math.round(zoom * 100);

    // Define and sort the zoom stages in ascending order
    let zoomStages = [
      5, 15, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400,
    ].sort((a, b) => a - b);

    // Find the closest lower zoom stage
    let closestZoomStage = zoomStages.find((stage) => roundZoom <= stage);

    //If no zoom stage found, set to the maximum allowed zoom stage
    if (!closestZoomStage) {
      closestZoomStage = 400;
    }

    return closestZoomStage;
  };

  // Get the rounded off zoom level of the canvas
  const roundZoom = getRoundZoom(self.getZoom());

  // If the rounded zoom level has been changed, if the zoom level is lower than or equals to 4, and if background dots are shown, then reset the background image
  if (
    currentZoom != roundZoom &&
    self.getZoom() <= 4 &&
    self.showBackgroundDots
  ) {
    self.resetBackgoundImage();

    currentZoom = roundZoom;
  }

  // If background dots should not show, set the background color of the canvas to null
  if (!self.showBackgroundDots) {
    self.set({
      backgroundColor: null,
    });
  }
};

// define the state of the whiteboard as reactive dict
WBCanvas.prototype._initStatic = function () {
  const self = this;

  let modifyType = '';

  self.set('isEnablePanMoving', false);

  self.resetBackgoundImage();

  // self.resetUndoRedoStatus();

  // this.recoverViewportTransformation(store.getState().board.boardId);

  self.mouse = {
    x: 0,
    y: 0,
    down: false,
    w: 0,
    delta: new fabric.Point(0, 0),
    e: null,
    zoomUpdate: false,
    mouseMoveUpdate: false,
  };

  self.whiteboardWidth = 1920 * 5;

  self.whiteboardHeight = 1080 * 6;

  self.isEnableTouchMoving = false;

  self.conextMenuObject = {};

  self.notesDrawCanvas = null;

  self.widgetPadding = 5;

  self.connectorStart = null;

  self.connectorArrow = null;

  self.vAlignLineTimer = null;

  self.hAlignLineTimer = null;

  self.isDrawingMode = false; // is the canvas in drawing mode

  self.isErasingMode = false; // is the canvas in drawing mode

  self.defaultNote = {}; // default sticky note

  //const curCanvasSize = self.getCurCanvasSize();

  self.changeDefaulNote({
    width: 230,
    height: 138,
    fontSize: 26,
    fontFamily: 'Inter',
    fontWeight: 400,
    textAlign: 'center',
    fill: '#000',
    backgroundColor: '#FCEC8A',
    scaleX: 1,
    scaleY: 1,
    obj_type: 'WBRectNotes',
  });

  const thumb = new Image();

  thumb.src = thumbPic;

  thumb.onload = function () {
    self.emoji_thumb = thumb;
  };

  const love = new Image();

  love.src = lovePic;

  love.onload = function () {
    self.emoji_love = love;
  };

  const smile = new Image();

  smile.src = smilePic;

  smile.onload = function () {
    self.emoji_smile = smile;
  };

  const shock = new Image();

  shock.src = shockPic;

  shock.onload = function () {
    self.emoji_shock = shock;
  };

  const question = new Image();

  question.src = questionPic;

  question.onload = function () {
    self.emoji_question = question;
  };

  self.alignmentGuideline = new alignmentGuideLines(self);
};

async function addDraw(e) {
  let canvas = BoardService.getInstance().getBoard();
  // Get the path from the draw event
  const obj = e.path;

  // If the path is not defined, return nothing
  if (obj.path === undefined) {
    return;
  }

  // Convert the object to JSON format
  const data = obj.toJSON();

  // Set the left and top coordinates of the object
  data.left = obj.pathOffset.x;
  data.top = obj.pathOffset.y;

  // Set the object type
  data.obj_type = 'WBPath';

  // // Get the user's id
  // data.userId = store.getState().user.userInfo.userId;

  // // Get the id of the current whiteboard
  // data.whiteboardId = store.getState().board.board._id;

  // Set the timestamp to the current time
  data.timestamp = Date.now();

  // Make the object selectable
  data.selectable = true;

  // Set the zIndex to the current time, multiplied by 100
  data.zIndex = Date.now() * 100;

  // Set the origin points to the center
  data.originX = 'center';

  data.originY = 'center';

  // Generate a unique id for the widget
  data._id = UtilityService.getInstance().generateWidgetID();

  // Insert the widget into the service
  await WidgetService.getInstance().insertWidget(data);

  // Render the widget on the canvas
  const newPath = await canvas.renderWidgetAsync(data);

  // Remove the original object from the canvas
  canvas.remove(obj);

  // Unlock all of the objects in the canvas
  canvas.unlockObjectsInCanvas();

  // Get the new state of the canvas after the object has been added
  const newState = newPath.getUndoRedoState('ADDED');

  // Push the new state to the canvas
  canvas.pushNewState(newState);
}

// it will fire when object modified
WBCanvas.prototype.onObjectModified = async function () {
  const self = this;
  self.anyChanges = true;
};

WBCanvas.prototype.relativePan = function (point) {
  setObjectCaching(this);

  return this.absolutePan(
    new fabric.Point(
      -point.x - this.viewportTransform[4],
      -point.y - this.viewportTransform[5]
    )
  );
};

let transformPoint = fabric.util.transformPoint,
  invertTransform = fabric.util.invertTransform;
/**
 * Sets zoom level of this canvas instance, the zoom centered around point
 * meaning that following zoom to point with the same point will have the visual
 * effect of the zoom originating from that point. The point won't move.
 * It has nothing to do with canvas center or visual center of the viewport.
 * @param {Point} point to zoom with respect to
 * @param {Number} value to set zoom to, less than 1 zooms out
 */
WBCanvas.prototype.zoomToPoint = function (point, value) {
  // TODO: just change the scale, preserve other transformations
  const before = point,
    vpt = [...this.viewportTransform];
  const newPoint = transformPoint(point, invertTransform(vpt));
  vpt[0] = value;
  vpt[3] = value;
  const after = transformPoint(newPoint, vpt);
  vpt[4] += before.x - after.x;
  vpt[5] += before.y - after.y;
  this.setViewportTransform(vpt);

  setObjectCaching(this);
};

let timeoutHandler = null;

function setObjectCaching(canvas) {
  //set all visible objects in canvas to caching true, and set a timerout, after 1 second, set all objects to caching false
  //this will make the canvas render faster
  //this is a hack, because the canvas is not rendering fast enough

  if (!timeoutHandler) {
    canvas.forEachObject(function (obj) {
      obj.set({
        dirty: true,
        objectCaching: true,
      });
    });
    canvas.renderAll();
  } else {
    clearTimeout(timeoutHandler);
  }

  timeoutHandler = setTimeout(() => {
    canvas.forEachObject(function (obj) {
      obj.set({
        dirty: true,
        objectCaching: true,
      });
    });
    canvas.renderAll();
    clearTimeout(timeoutHandler);
    timeoutHandler = null;
  }, 500);
}
