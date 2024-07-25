// import {
//   ActiveSelection,
//   Canvas,
//   FabricObject,
//   FabricObjectProps,
//   ObjectEvents,
//   SerializedObjectProps,
//   TMat2D,
//   XY,
//   StaticCanvas,
//   Pattern,
//   Path,
//   RectNotes,
//   CircleNotes,
//   ShapeNotes,
//   Line,
// } from '../../../fabric';
import { FabricObject } from '../../shapes/Object/FabricObject';
import { FabricObjectProps } from '../../shapes/Object/types';
import { ObjectEvents } from '../../EventTypeDefs';
import { TMat2D } from '../../typedefs';
import { SerializedObjectProps } from '../../shapes/Object/types';
import { XY } from '../../Point';
import { Path } from '../../shapes/Path';
import { XRectNotes } from '../../shapes/canvasx/XRectNotes';
import { Line } from '../../shapes/Line';

import { ActiveSelection } from '../../shapes/ActiveSelection';
import { Canvas } from '../Canvas';
import { AlignmentType } from './bx-canvas-interface';
import { Point } from '../../Point';
import * as util from '../../util';
import { invertTransform, transformPoint } from '../../util';
import { XURL } from '../../shapes/canvasx/XURL';
import { WidgetType } from '../../shapes/canvasx/types';
import { XFile } from '../../shapes/canvasx/XFile';
import { XCircleNotes, XImage, XShapeNotes } from '../../shapes/canvasx';
import { Rect } from '../../shapes/Rect';
import { XTextbox } from '../../shapes/canvasx/XTextbox';
import { XGroup } from '../../shapes/canvasx/XGroup';

let selectedObject: any;

export class XCanvas extends Canvas {
  // Indicate that object scaling must be uniform (equal in all dimensions)
  uniformScaling = true;
  interactionMode = 'mouse';
  isEnablePanMoving = false;
  // Store the previous transform state of the canvas
  // XCanvas.prototype.previousViewportTransform ;

  mouse: any;

  // Indicate if a current selection is fully contained within the canvas
  selectionFullyContained = false;

  // Do not render items that are offscreen for performance
  skipOffscreen = true;

  // Preserve the order of objects in the canvas
  preserveObjectStacking = true;

  // Set tolerance for finding targets (objects) within the canvas
  targetFindTolerance = 8;

  // Stop event to animate rectangle in the canvas
  stopAnimateToRectStatus = false;

  // Stop event to animate specific object to position in the canvas
  stopAnimateObjectToPositionStatus = false;

  // Set the mouse cursor representation while moving an object within the canvas
  moveCursor = 'default';

  // Set the color of the selection area within the canvas
  selectionColor = 'rgba(179, 205, 253, 0.5)';

  // Set the color of the border of the selected area within the canvas
  selectionBorderColor = '#31A4F5';

  // Set the width of the line for the selected area within the canvas
  selectionLineWidth = 1;

  // Allow middle click events to be fired within the canvas
  fireMiddleClick = true;

  // Show background dots within the canvas
  showBackgroundDots = true;

  whiteboardWidth = 1920 * 5;

  whiteboardHeight = 1080 * 6;

  isEnableTouchMoving = false;

  conextMenuObject = {};

  notesDrawCanvas = null;

  widgetPadding = 5;

  connectorStart = null;

  connectorArrow = null;

  vAlignLineTimer = null;

  hAlignLineTimer = null;

  isDrawingMode = false; // is the canvas in drawing mode

  isErasingMode = false; // is the canvas in drawing mode
  group_zIndex = null;

  defaultNote = {}; // default sticky note

  boundHandlerMouseMove: any = null;
  dockingWidget: any = null;
  instanceOfConnector: any = null;
  startPointOfConnector: any = null;
  endPointOfConnector: any = null;
  inConnectingMode: boolean = false;
  toUpdateNewObjectRemote: any[];
  toUpdateRemovedObjectRemote: any[];
  anyChanges: boolean;
  thumbnail: string;
  toUpdateObjectRemote: any[];
  lastMouseData: any;
  _numOfColumns: number;

  handlerMouseMoveForConnector(canvasInstance: any, e: any) {
    const pointer = e.scenePoint;
    const width = 50 / canvasInstance.getZoom();
    const height = 50 / canvasInstance.getZoom();
    const rect = new Rect({
      left: pointer.x - width / 2,
      top: pointer.y - height / 2,
      width: width,
      height: height,
      selectable: false,
    });

    let closestObject: any = null;
    let minDistance = Infinity;

    canvasInstance.getObjects().forEach((obj: any) => {
      if (obj.objType === 'XConnector') {
        return;
      }
      canvasInstance.dockingWidget = null;

      obj.hoveringControl = null;
      obj.dirty = true;

      if (rect.intersectsWithObject(obj)) {
        const objCenter = obj.getCenterPoint();
        const distance = Math.sqrt(
          Math.pow(objCenter.x - pointer.x, 2) +
            Math.pow(objCenter.y - pointer.y, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestObject = obj;
        }
      }
    });

    if (closestObject) {
      // if (selectedObject !== closestObject) {
      // canvasInstance.setActiveObject(closestObject);
      canvasInstance.dockingWidget = closestObject;
      closestObject.dirty = true;
      closestObject.set({
        hasControls: true,
        selectable: true,
      });
      const controlsData = ['mtaStart', 'mbaStart', 'mlaStart', 'mraStart'];

      Object.keys(closestObject.controls).forEach((controlName) => {
        console.log('controlName', controlName);
        // const control = closestObject.controls.find((c) => c.name === controlName);
        if (controlsData.includes(controlName)) {
          closestObject.controls[controlName].visible = true;
        } else {
          closestObject.controls[controlName].visible = false;
        }
      });

      //calculate the four points of the controls 'mtaStart', 'mbaStart', 'mlaStart', 'mraStart'
      const mtaStartPoint = this.getControlPointOnCanvas(
        closestObject,
        'mtaStart'
      );
      const mbaStartPoint = this.getControlPointOnCanvas(
        closestObject,
        'mbaStart'
      );
      const mlaStartPoint = this.getControlPointOnCanvas(
        closestObject,
        'mlaStart'
      );
      const mraStartPoint = this.getControlPointOnCanvas(
        closestObject,
        'mraStart'
      );

      closestObject.hoveringControl = '';
      //if the point is overlap with rect
      if (mtaStartPoint && rect.containsPoint(mtaStartPoint)) {
        console.log(
          'mtaStartPoint',
          mtaStartPoint,
          rect.containsPoint(mtaStartPoint)
        );
        // closestObject.controls.mtaStart.visible = false;
        closestObject.hoveringControl = 'mtaStart';
      }
      if (mbaStartPoint && rect.containsPoint(mbaStartPoint)) {
        console.log(
          'mbaStartPoint',
          mbaStartPoint,
          rect.containsPoint(mbaStartPoint)
        );
        // closestObject.controls.mbaStart.visible = false;
        closestObject.hoveringControl = 'mbaStart';
      }
      if (mlaStartPoint && rect.containsPoint(mlaStartPoint)) {
        console.log(
          'mlaStartPoint',
          mlaStartPoint,
          rect.containsPoint(mlaStartPoint)
        );
        // closestObject.controls.mlaStart.visible = false;
        closestObject.hoveringControl = 'mlaStart';
      }
      if (mraStartPoint && rect.containsPoint(mraStartPoint)) {
        console.log(
          'mraStartPoint',
          mraStartPoint,
          rect.containsPoint(mraStartPoint)
        );
        // closestObject.controls.mraStart.visible = false;
        closestObject.hoveringControl = 'mraStart';
      }

      selectedObject = closestObject;

      // }
    } else if (selectedObject) {
      selectedObject.set({
        hasControls: false,
        selectable: false,
      });
      // canvasInstance.discardActiveObject();
      selectedObject = null;
    }
    canvasInstance.requestRenderAll();
  }

  getControlPointOnCanvas(obj: any, controlName: string) {
    const controlInfo = obj.controls[controlName];
    if (!controlInfo) {
      return;
    }
    const x = controlInfo.offsetX + controlInfo.x * obj.width;
    const y = controlInfo.offsetY + controlInfo.y * obj.height;
    const point = new Point(x, y);

    const transformedPoint = obj.transformPointToCanvas(point);

    return transformedPoint;
  }

  async initializeConnectorMode() {
    const canvasInstance = this;
    this.inConnectingMode = true;
    this.boundHandlerMouseMove = this.handlerMouseMoveForConnector.bind(
      this,
      canvasInstance
    );
    canvasInstance.on('mouse:move', this.boundHandlerMouseMove);
  }

  async exitConnectorMode() {
    const canvasInstance = this;
    this.inConnectingMode = false;
    if (this.boundHandlerMouseMove) {
      canvasInstance.off('mouse:move', this.boundHandlerMouseMove);
      this.boundHandlerMouseMove = null;
    }
    this.makeAllControlsVisible();
  }

  async makeAllControlsVisible() {
    this.getObjects().forEach((obj) => {
      if (obj.controls) {
        Object.keys(obj.controls).forEach((controlName) => {
          obj.controls[controlName].visible = true;
        });
      }
    });
  }

  zoomToViewAllObjects(): number {
    let topLeftX = 0;
    let topLeftY = 0;
    let bottomRightX = 0;
    let bottomRightY = 0;

    //calculate the top left and bottom right points for all the objects on canvas
    this.getObjects().forEach((obj) => {
      if (topLeftX == null) {
        topLeftX = obj.left;
        topLeftY = obj.top;
      }

      if (obj.left < topLeftX) topLeftX = obj.left;

      if (obj.top < topLeftY) topLeftY = obj.top;

      if (bottomRightX == null) {
        bottomRightX = obj.left + obj.width;

        bottomRightY = obj.top + obj.height;
      }

      if (obj.left + obj.width > bottomRightX)
        bottomRightX = obj.left + obj.width;

      if (obj.top + obj.height > bottomRightY)
        bottomRightY = obj.top + obj.height;
    });

    //calculate the center of the canvas
    const centerX = (topLeftX + bottomRightX) / 2;

    const centerY = (topLeftY + bottomRightY) / 2;

    //calculate the scale factor

    const scaleX = this.width / (bottomRightX - topLeftX);

    const scaleY = this.height / (bottomRightY - topLeftY);

    let scale = Math.round(Math.min(scaleX, scaleY) * 0.8 * 100);

    if (scale > 100) scale = 100;
    if (scale < 3) scale = 3;

    //zoom to cover all the objects on canvas

    this.zoomToCenterPoint({ x: centerX, y: centerY }, scale / 100);

    return scale;
  }

  //rewrite the function to make caching for pan process
  relativePan(point: XY) {
    setObjectCaching(this);

    return this.absolutePan(
      new Point(
        -point.x - this.viewportTransform[4],
        -point.y - this.viewportTransform[5]
      )
    );
  }

  /**
   * Sets zoom level of this canvas instance, the zoom centered around point
   * meaning that following zoom to point with the same point will have the visual
   * effect of the zoom originating from that point. The point won't move.
   * It has nothing to do with canvas center or visual center of the viewport.
   * @param {Point} point to zoom with respect to
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  zoomToPoint(point: Point, value: number) {
    // TODO: just change the scale, preserve other transformations
    const before = point,
      vpt: TMat2D = [...this.viewportTransform];
    const newPoint = transformPoint(point, invertTransform(vpt));
    vpt[0] = value;
    vpt[3] = value;
    const after = transformPoint(newPoint, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;
    this.setViewportTransform(vpt);
    //add the caching to zoom process
    setObjectCaching(this);
  }

  zoomToViewObjects(objs: any[]) {
    let topLeftX = 0;
    let topLeftY = 0;
    let bottomRightX = 0;
    let bottomRightY = 0;

    //calculate the top left and bottom right points for all the objects on canvas
    objs.forEach(
      (obj: { left: number; top: number; width: any; height: any }) => {
        if (topLeftX == null) {
          topLeftX = obj.left;

          topLeftY = obj.top;
        }

        if (obj.left < topLeftX) topLeftX = obj.left;

        if (obj.top < topLeftY) topLeftY = obj.top;

        if (bottomRightX == null) {
          bottomRightX = obj.left + obj.width;

          bottomRightY = obj.top + obj.height;
        }

        if (obj.left + obj.width > bottomRightX)
          bottomRightX = obj.left + obj.width;

        if (obj.top + obj.height > bottomRightY)
          bottomRightY = obj.top + obj.height;
      }
    );

    //calculate the center of the canvas
    const centerX = (topLeftX + bottomRightX) / 2;

    const centerY = (topLeftY + bottomRightY) / 2;

    //calculate the scale factor
    const scaleX = this.width / (bottomRightX - topLeftX);

    const scaleY = this.height / (bottomRightY - topLeftY);

    let scale = Math.round(Math.min(scaleX, scaleY) * 0.8 * 100);

    if (scale > 100) scale = 100;

    if (scale < 3) scale = 3;

    //zoom to cover all the objects on canvas
    this.zoomToCenterPoint({ x: centerX, y: centerY }, scale / 100);

    return scale;
  }

  findById(
    id: string
  ): FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  > | null {
    const canvas = this;
    const obj = canvas?.getObjects().filter((widget: any) => widget.id === id);
    if (obj.length === 0) return null;
    return obj[0];
  }

  removeById(id: string): void {
    // Save a reference to the current fabric.Canvas instance
    const self = this;

    // Loop through each object on the canvas
    self.getObjects().forEach((obj: any) => {
      // If the object's id (id) matches the target id
      if (obj.id === id) {
        // Remove that object from the canvas
        self.remove(obj);
      }
    });
  }

  selectAllWidgets(): void {
    const canvas: XCanvas = this;
    const objects = canvas.getObjects(); // Get all objects on the canvas

    const selectedObjects = objects.filter(
      (obj: any) =>
        obj.id !== undefined && !obj.locked && obj.objType !== 'common'
    );

    if (selectedObjects && selectedObjects.length > 0) {
      const activeSelection = new ActiveSelection(selectedObjects, {
        canvas: canvas,
      });

      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  resetCoordsOnScreen(): void {
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
  }

  // Adding a new method 'getAbsoluteCoords' to the fabric.XCanvas object
  // This method calculates the absolute coordinates of the given object based on the offset value of the canvas
  getAbsoluteCoords(object: any): { left: number; top: number } {
    return {
      left: object.left + this._offset.left,
      top: object.top + this._offset.top,
    };
  }

  getContentArea() {
    const self: XCanvas = this;

    // Discard the currently active object on the canvas
    self.discardActiveObject();

    // Get all the objects on the canvas that are not of type 'common' or 'XFile'
    const activeSelection = self
      .getObjects()
      .filter((o: any) => o.type !== 'common' && o.type !== 'XFile');

    // Create a new active selection
    const sel = new ActiveSelection(activeSelection, {
      canvas: self,
    });

    // Set the newly created active selection as the currently active selection in the canvas
    self.setActiveObject(sel as FabricObject);

    // Return the active selection
    return sel.aCoords;
  }

  toDataURLContent(multiplier: number): string {
    const self: XCanvas = this;

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
  }

  captureThumbnail(): string {
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
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });

    self.viewportTransform = originalTransform;

    // store.dispatch(handleSetCaptureThumbnail(dataUrl));

    // let name = store.getState().board.board.name;

    // store.dispatch(handleSetCaptureThumbnailBoardName(name));

    return dataUrl;
  }

  planNewLayout(objects: any[], numOfColumns: number): void {
    const canvas = this;
    const self = this;
    let _objects = objects;
    this._numOfColumns = numOfColumns;

    this._numOfColumns = parseInt(numOfColumns.toString(), 10);

    self.discardActiveObject();

    let leftOffset = 0;

    let topOffset = 0;

    const leftObject = getLeftObject(objects);

    const topObject = getTopObject(objects);

    const { left } = leftObject;

    let { top } = topObject;

    _objects = objects.sort((a, b) => a.zIndex - b.zIndex);

    _objects = objects.sort((a, b) =>
      a.backgroundColor.localeCompare(b.backgroundColor)
    );

    _objects = objects.sort((a, b) => a.objType.localeCompare(b.objType));

    objects.forEach((_obj, index) => {
      const index1 = index + 1;

      if (index1 % this._numOfColumns === 1 || this._numOfColumns === 1) {
        _obj.left = left;

        _obj.top = top;

        _obj.setCoords();

        topOffset = _obj.height * _obj.scaleY;

        leftOffset = leftOffset + (_obj.width / 2) * _obj.scaleX;

        if (this._numOfColumns === 1) {
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

        if (index1 % this._numOfColumns === this._numOfColumns) {
          leftOffset = 0;
        } else {
          leftOffset = leftOffset + _obj.width * _obj.scaleX + 10;
        }

        if (index1 % this._numOfColumns === 0) {
          top = top + topOffset + 10;

          topOffset = 0;

          leftOffset = 0;
        }
      }
    });

    const activeSelection = _objects;

    const sel = new ActiveSelection(); //canvas.getActiveSelection();

    sel.add(...activeSelection);

    self.setActiveObject(sel);
    //  self.getActiveObject().saveData('MOVED', ['left', 'top']);
  }
  clearData(): void {
    const self = this;

    if (self._objects) {
      for (let i = self._objects.length - 1; i >= 0; i--) {
        self.remove(self._objects[i]);
      }
    }
  }
  getNewPositionNextToActiveObject(direction: string): {
    x: number;
    y: number;
  } {
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
  }
  translateWidget(language: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async duplicateWidget(direction: string): Promise<void> {
    const canvas = this;
    let position = canvas.getNewPositionNextToActiveObject(direction);
    const activeObject: any = canvas.getActiveObject();
    const dataToPaste = activeObject?._objects
      ? activeObject?._objects.map((r: any) => r.getObject())
      : [activeObject.getObject()];

    canvas.discardActiveObject();

    //todo: add dupliate widget, need to implement duplicate widget
    //  await ClipboardService.pasteCallback(
    //    [],
    //    JSON.stringify({ data: dataToPaste, type: 'whiteboard' }),
    //    position,
    //    boardId,
    //    userId
    //  );
  }

  async animateToVpt(vpt: any, vpCenter: any): Promise<void> {
    const canvas = this;
    const self = canvas;

    const targetZoom = vpt[0]; // The desired zoom level

    const targetVpCenter = vpCenter; // The desired center of the viewport

    const currentZoom = canvas.getZoom(); // The current zoom level

    const currentVpCenter = canvas.getVpCenter(); // The current center of the viewport

    await util.animate({
      startValue: 1, // The start value for the animation

      endValue: 100, // The end value for the animation

      duration: 1000, // The duration of the animation in milliseconds

      onChange(value) {
        // Function to call on every animation frame.
        // It calculates the new viewport center and zoom level
        const newX =
          currentVpCenter.x +
          ((targetVpCenter.x - currentVpCenter.x) * value) / 100;

        const newY =
          currentVpCenter.y +
          ((targetVpCenter.y - currentVpCenter.y) * value) / 100;

        const newZoom =
          currentZoom + ((targetZoom - currentZoom) * value) / 100;

        self.zoomToCenterPoint(new Point(newX, newY), newZoom); // Sets the new zoom level and viewport center

        self.requestRenderAll(); // Asks for the canvas to be re-rendered
      },

      easing: util.ease.easeInOutQuad, // The easing function to use for the animation

      async onComplete() {
        // What to do when the animation is complete

        self._objects.forEach((o: any) => {
          if (o.isOnScreen()) {
            o.setCoords(); // Updates the coordinates of each object on the screen
          }
        });

        canvas.setZoom(targetZoom); // Sets the zoom level to the target zoom level
      },
    });
  }
  async zoomToObject(obj: FabricObject): Promise<void> {
    const canvas = this;
    const self = canvas;
    let object = obj ? obj : canvas.getActiveObject(); //sometimes object can't pass to this function

    if (!object) return;

    // Determine the correct zoom adjustment based on object and canvas dimensions
    const zoomAdjust =
      (canvas.width / object.width) * object.scaleX <
      (canvas.height / object.height) * object.scaleY
        ? (canvas.width / object.width) * object.scaleX
        : (canvas.height / object.height) * object.scaleY * 0.8;

    // Calculate the target zoom factor
    const targetZoom = zoomAdjust * 0.5;

    // Get the center point of the object to be zoomed
    let targetVpCenter: XY = object.getCenterPoint();

    // Get current zoom and viewport center
    const currentZoom = canvas.getZoom();

    const currentVpCenter = canvas.getVpCenter();

    targetVpCenter = {
      x: targetVpCenter.x,

      y: targetVpCenter.y + document.documentElement.clientHeight * 0.05,
    };

    // Dispatch action to hide widget menu
    // store.dispatch(handleWidgetMenuDisplay(false));

    // Animate the transition from the current viewport center and current zoom to the target center and zoom
    await util.animate({
      startValue: 1,

      endValue: 20,

      duration: 600,

      onChange(value) {
        // Compute the new viewport center x and y based on progress of the animation
        const newX =
          currentVpCenter.x +
          ((targetVpCenter.x - currentVpCenter.x) * value) / 20;

        const newY =
          currentVpCenter.y +
          ((targetVpCenter.y - currentVpCenter.y) * value) / 20;

        // Compute new zoom based on progress of the animation
        const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 20;

        // Zoom to the newly computed viewport center and zoom
        self.zoomToCenterPoint(new Point(newX, newY), newZoom);

        // Request a render of all the objects on the canvas
        self.requestRenderAll();
      },

      // Use quadratic ease-in-out for the animation
      easing: util.ease.easeInOutQuad,

      async onComplete() {
        // Show the menu once the animation is complete
        // showMenu(canvas);

        // Dispatch the action to set the zoom factor to target zoom value
        // store.dispatch(handleSetZoomFactor(targetZoom));
        canvas.setZoom(targetZoom);
      },
    });
  }
  zoomToCenterPoint(vpCenter: { x: number; y: number }, zoom: number): void {
    const canvas = this;
    const vpt: TMat2D = [
      zoom,
      0,
      0,
      zoom,
      -(vpCenter.x * zoom - canvas.width / 2),
      -(vpCenter.y * zoom - canvas.height / 2),
    ];
    canvas.setViewportTransform(vpt);
  }

  alignGroupObjects(
    curentObject: FabricObject,
    alignment: AlignmentType
  ): void {
    const self = this;

    const canvas: XCanvas = self;

    const currentActiveObjects = canvas.getActiveObjects();

    const objects: any[] = [];

    currentActiveObjects.forEach((obj: any) => {
      if (obj.objType !== 'XConnector') {
        objects.push(obj);
      }
    });

    canvas.discardActiveObject();

    canvas.requestRenderAll();

    const activeSelectionnoArrow = objects;

    const selnoArrow = new ActiveSelection(); // canvas.getActiveSelection();

    selnoArrow.add(...activeSelectionnoArrow);

    canvas.setActiveObject(selnoArrow);

    if (alignment === 'VLeft') {
      const leftObject = getLeftObject(objects);

      const { left } = leftObject;

      objects.forEach((obj: any) => {
        obj.left =
          left -
          (leftObject.width * leftObject.scaleX) / 2 +
          (obj.width * obj.scaleX) / 2;

        obj.setCoords();

        self.requestRenderAll();
      });

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'VRight') {
      const rightObject = getRightObject(objects);

      const right = rightObject.left;

      objects.forEach((obj: any) => {
        obj.left =
          right +
          (rightObject.width * rightObject.scaleX) / 2 -
          (obj.width * obj.scaleX) / 2;

        obj.setCoords();

        self.requestRenderAll();
      });

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'VCenter') {
      const rightObject = getRightObject(objects);

      const right = rightObject.left;

      const leftObject = getLeftObject(objects);

      const { left } = leftObject;

      objects.forEach((obj: any) => {
        obj.left = (right + left) / 2;
        obj.setCoords();
      });

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'DistrH') {
      const leftObject = getLeftObject(objects);

      const leftleft = leftObject.left;

      const leftId = leftObject.id;

      const lefthalfwidth = (leftObject.width * leftObject.scaleX) / 2;

      const rightObject = getRightObject(objects);

      const rightleft = rightObject.left;

      const rightId = rightObject.id;

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
        } else if (obj.id !== leftId) widthsum += obj.width * obj.scaleX;
      }

      if (!sameObjbool) {
        const space = (lrdistance - widthsum) / (sum - 1);

        const sortObjects = getHSortObjects(objects);

        let currPos = leftleft + lefthalfwidth + space;

        for (let i = 1; i < sortObjects.length - 1; i++) {
          const obj = sortObjects[i];

          if (obj.id !== leftId && obj.id !== rightId) {
            // adjust H location
            obj.left = currPos + (obj.width * obj.scaleX) / 2;

            obj.setCoords();

            self.requestRenderAll();

            currPos += obj.width * obj.scaleX + space;
          }
        }
      } else {
        const space = (lrdistance - widthsum) / sum;

        const sortObjects = getHSortObjects(objects);

        let currPos = leftleft - lefthalfwidth + space;

        for (let i = 0; i < sortObjects.length; i++) {
          const obj = sortObjects[i];

          if (obj.id !== leftId && obj.id !== rightId) {
            // adjust H location
            obj.left = currPos + (obj.width * obj.scaleX) / 2;

            obj.setCoords();

            self.requestRenderAll();

            currPos += obj.width * obj.scaleX + space;
          }
        }
      }

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'HTop') {
      const topObject = getTopObject(objects);

      const { top } = topObject;

      objects.forEach((obj: any) => {
        obj.top =
          top -
          (topObject.height * topObject.scaleY) / 2 +
          (obj.height * obj.scaleY) / 2;

        obj.setCoords();

        self.requestRenderAll();
      });

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'HBottom') {
      const bottomObject = getBottomObject(objects);

      const bottom = bottomObject.top;

      objects.forEach((obj: any) => {
        obj.top =
          bottom +
          (bottomObject.height * bottomObject.scaleY) / 2 -
          (obj.height * obj.scaleY) / 2;

        obj.setCoords();

        self.requestRenderAll();
      });

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'HCenter') {
      const bottomObject = getBottomObject(objects);

      const bottom = bottomObject.top;

      const topObject = getTopObject(objects);

      const { top } = topObject;

      objects.forEach((obj: any) => {
        obj.top = (bottom + top) / 2;
        obj.setCoords();
        self.requestRenderAll();
      });

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    if (alignment === 'DistrV') {
      const bottomObject = getBottomObject(objects);

      const bottom = bottomObject.top;

      const bottomhalfheight = (bottomObject.height * bottomObject.scaleY) / 2;

      const bottomId = bottomObject.id;

      const topObject = getTopObject(objects);

      const { top } = topObject;

      const tophalfheight = (topObject.height * topObject.scaleY) / 2;

      const topId = topObject.id;

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
        } else if (obj.id !== topId) heightsum += obj.height * obj.scaleX;
      }

      if (!sameObjbool) {
        const space = (tbdistance - heightsum) / (sum - 1);

        const sortObjects = getVSortObjects(objects);

        let currPos = top + tophalfheight + space;

        for (let i = 1; i < sortObjects.length - 1; i++) {
          const obj = sortObjects[i];

          if (obj.id !== topId && obj.id !== bottomId) {
            // adjust H location
            obj.top = currPos + (obj.height * obj.scaleX) / 2;

            obj.setCoords();

            self.requestRenderAll();

            currPos += obj.height * obj.scaleX + space;
          }
        }
      } else {
        const space = (tbdistance - heightsum) / sum;

        const sortObjects = getVSortObjects(objects);

        let currPos = top - tophalfheight + space;

        for (let i = 0; i < sortObjects.length; i++) {
          const obj = sortObjects[i];

          if (obj.id !== topId && obj.id !== bottomId) {
            // adjust H location
            obj.top = currPos + (obj.height * obj.scaleX) / 2;

            obj.setCoords();

            self.requestRenderAll();

            currPos += obj.height * obj.scaleX + space;
          }
        }
      }

      // selnoArrow.saveData('MOVED', ['left', 'top']);
    }

    self.discardActiveObject();

    const activeSelection = objects;

    const sel = new ActiveSelection(); //canvas.getActiveSelection();

    sel.add(...activeSelection);

    canvas.setActiveObject(sel);
  }

  getNextObjectByPoint(point: XY, width: number, height: number) {
    const self: XCanvas = this;
    // Convert the passed point from the board coordinate system to the canvas one
    const pointOnCanvas = self.getPositionOnCanvas(point.x, point.y);

    // Format the obtained coordinates a bit, making it more convenient to work with
    const pointOnCanvas2 = { x: pointOnCanvas.x, y: pointOnCanvas.y };

    // Retrieve all the objects that are located around the specified point on the canvas
    let objects = self.getObjectsAroundPointByDistance(pointOnCanvas2);

    // Filtering out unwanted object types
    objects = objects.filter(
      (o: any) =>
        o.objType === 'XRectNotes' ||
        o.objType === 'XCircleNotes' ||
        o.objType === 'WBTextbox' ||
        o.objType === 'WBText'
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
      objType: closeObject.objType,
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
  }
  getObjectsAroundPointByDistance(point: XY): FabricObject[] {
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
    const selectionX1Y1 = new Point(Math.min(x1, x2), Math.min(y1, y2));
    const selectionX2Y2 = new Point(Math.max(x1, x2), Math.max(y1, y2));

    // Iterate through all the objects on canvas, in reverse order.
    for (let i = compareObjects.length; i--; ) {
      // Get the current object.
      currentObject = compareObjects[i];

      /* Verify whether the object is eligible such as it must be an object, visible, 
    and not be of certain types or part of a group. */
      const notValid =
        !currentObject ||
        !currentObject.visible ||
        currentObject.objType === 'WBLine' ||
        currentObject.objType === 'XConnector' ||
        currentObject.objType === 'common' ||
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
  }
  getObjectsAroundObjectByDistance(object: FabricObject): any[] {
    // Get center point of the input object.
    const { x, y } = object.getCenterPoint();

    // Get id of the input object.
    //@ts-ignore
    const id = object.id;

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
    const selectionX1Y1 = new Point(Math.min(x1, x2), Math.min(y1, y2));
    const selectionX2Y2 = new Point(Math.max(x1, x2), Math.max(y1, y2));

    // Iterate through all the objects of canvas, in reverse order.
    for (let i = compareObjects.length; i--; ) {
      // Get currently looked object.
      currentObject = compareObjects[i];

      // Check whether the object is not disqualified based on its attributes.
      const notValid =
        !currentObject ||
        !currentObject.visible ||
        currentObject.objType === 'WBLine' ||
        currentObject.objType === 'XConnector' ||
        currentObject.objType === 'common' ||
        currentObject.group ||
        currentObject.id === id;

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
  }
  getPositionOnScreenFromCanvas(left: number, top: number): XY {
    // Stores a reference to the canvas instance
    const self = this;

    // Uses fabric's utility method 'transformPoint' to calculate the point's
    // position on screen by applying the canvas's viewportTransform on the point
    return util.transformPoint({ x: left, y: top }, self.viewportTransform);
  }
  getPositionOnCanvas(left: number, top: number): XY {
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
  }

  async bindGroup(objectArr: any, callback: any): Promise<void> {
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

      if (object && object.objType === 'XImage') {
        // If object is an image and its source contains '?', remove the query string
        if (object.src.indexOf('?') > -1) {
          [object.src] = object.src.split('?');
        }
      }

      // Add the crafted fabric object to the array
      objects.push(object);
    }

    // Create a new fabric.Group with the array of objects. Assign properties
    const group = new XGroup(objects, {
      objType: 'XGroup',
      lockRotation: true,
      originX: 'center',
      originY: 'center',

      zIndex: self.group_zIndex || Date.now() * 100,
    });

    self.group_zIndex = null;

    // If left and top coordinates were stored, set them to the newly created group
    if (left) group.left = left;

    if (top) group.top = top;

    // Call the callback with the newly created group as the argument
    return callback && callback(group);
  }

  async createWidgetAsync(options: any): Promise<any> {
    const self = this;

    let widget = null;

    if (!options) return;

    if (options.selectable === undefined) {
      options.selectable = true;
    }

    if (options.type) {
      delete options.type;
    }

    if (!options.objType && options.objects && options.objects.length > 1) {
      options.objType = 'XGroup';

      options.objectArr = options.objects;
    }

    options.objectCaching = true;

    options.hasControls = true;

    switch (options.objType) {
      case 'XURL':
        var url = '/fileIcons/weblink.png';

        if (options.src) {
          if (
            options.src !== '/fileIcons/weblink.png' &&
            options.src.indexOf('.svg') === -1 &&
            options.src.indexOf('.gif') === -1
          ) {
            url = `${options.src.split('?')[0]}`;
          }
        } else {
          url = options.src.split('?')[0];
        }

        options.lockUniScaling = true;

        const pugImg = new Image();

        let instance = await new XURL(options);

        return instance;

      // return new Promise((resolve, reject) => {
      //   instance.fromURL(url, options).then((urlImage: any) => {
      //     if (urlImage) {
      //       urlImage.set({
      //         rx: 40,
      //         ry: 40,
      //         clipTo(ctx: any) {
      //           ctx.arc(0, 0, 200, 200, Math.PI * 2, true);
      //         },
      //       });

      //       resolve(urlImage);
      //     } else {
      //       instance
      //         .fromURL('/fileIcons/weblink.png', options)
      //         .then((urlImage: any) => {
      //           urlImage.set({
      //             rx: 40,
      //             ry: 40,
      //             clipTo(ctx: any) {
      //               ctx.arc(0, 0, 200, 200, Math.PI * 2, true);
      //             },
      //           });

      //           resolve(urlImage);
      //         });
      //     }
      //   });
      // });

      case WidgetType.XPath:
        // Render the drawing path
        options.lockUniScaling = true;

        // Create a new fabric Path with given options
        widget = new Path(options.path, options);

        // Return the widget for further usage
        return widget;

      case WidgetType.XRectNotes:
        // Lock all scaling to the same proportion for rectangle notes
        options.lockUniScaling = true;
        options._forceClearCache = true;
        // Create a new rectangle notes using fabric.js library
        widget = new XRectNotes(options.text, options);

        // // Check if the last edit was made by Artificial Intelligence (AI)
        // if (widget.lastEditedBy === 'AI') {
        //   // Set widget's author to 'AI'
        //   widget.author = 'AI';
        // }

        // Return the configured widget
        return widget;

      case WidgetType.XCircleNotes:
        // Lock all scaling to the same proportion for circle notes
        options.lockUniScaling = true;

        // Enable splitting of text by graphemes
        options.splitByGrapheme = true;

        // Create a new circle notes using fabric.js library
        widget = new XCircleNotes(options.text, options);

        // Return the newly created widget
        return widget;

      case WidgetType.XShapeNotes:
        // Lock all scaling to the same proportion for shape notes
        options.lockUniScaling = true;

        // Set text alignment in the center
        options.textAlign = 'center';

        // Enable splitting of text by graphemes
        options.splitByGrapheme = true;

        // Create a new Shape Notes widget using fabric.js library
        widget = new XShapeNotes(options.text, options);

        // Return the newly created widget
        return widget;

      case WidgetType.XImage:
        // If source for image is empty, exit function
        if (options.src === '' || !options.src) return;

        // Replace 'smallPic/' with 'bigPic/' in source URL
        // options.src = options.src.replace('smallPic/', 'bigPic/');

        // Set original width, height and apply lock to uniform scaling
        options.oWidth = options.width;
        options.oHeight = options.height;
        options.lockUniScaling = true;

        widget = new XImage(options.src, options);
        await widget.setSrc(options.src);
        return widget;

      case WidgetType.XGroup:
        // // Lock the uniform scaling option to maintain proportional resizing
        options.lockUniScaling = true;

        // Allow rotation of the widget
        options.lockRotation = false;

        // Return a new promise that binds a group
        return new Promise((resolve, reject) => {
          // Bind a group with the specified objects
          self.bindGroup(options.objectArr, (widget: any) => {
            // Delete the original x-position of the widget
            delete options.originX;

            // Delete the original y-position of the widget
            delete options.originY;

            // Loop through the options
            for (const item in options) {
              // If the widget property is not the same as the corresponding option
              if (widget && widget[item] !== options[item]) {
                // Set the widget property to match the option
                widget.set(item, options[item]);
              }
            }

            // Unlock the rotation of the result widget, in case it has been modified by previous operations
            widget.lockRotation = false;

            // Set the control for rotate and scale at the middle top of object as invisible
            widget.setControlVisible('mtr', false);

            // Complete the promise and return the resulting widget
            resolve(widget);
          });
        });

      case 'WBLine':
        // Lock the uniform scaling option to maintain proportional resizing
        options.lockUniScaling = true;

        // Create a new line widget with the specified coordinates and options
        widget = new Line(
          [options.x1, options.y1, options.x2, options.y2],
          options
        );

        // Return the newly created line widget
        return widget;

      // Case when the widget type is XConnector
      case WidgetType.XConnector:
      // // Lock the uniform scaling option to maintain proportional resizing
      // options.lockUniScaling = true;

      // // Create a new arrow widget with the specified coordinates and options
      // widget = new XConnector(
      //   [options.x1, options.y1, options.x2, options.y2],
      //   options
      // );

      // // Return the newly created arrow widget
      // return widget;

      case 'sticker':
      // // Lock the uniform scaling option to maintain proportional resizing
      // options.lockUniScaling = true;

      // // Return a new promise that creates a sticker
      // return new Promise((resolve, reject) => {
      //   Image.fromURL(
      //     // Details of the source of the image
      //     options.src,
      //     (img) => {
      //       HTMLFormControlsCollection.l;
      //       // Extend the details of the image with the options passed
      //       _.extend(img, options);

      //       // Complete the promise and return the image
      //       resolve(img);
      //     },
      //     options
      //   );
      // });

      // Case when the widget type is WBTextbox
      case 'XTextbox':
        // Split string where the grapheme cluster break is allowed
        options.splitByGrapheme = true;

        // Set the origin of the Textbox widget to its center
        options.originX = 'center';
        options.originY = 'center';

        // Allow user modification on the Textbox widget
        options.locked = false;
        options.editable = true;

        // Allow multiline Textbox widget
        options.oneLine = false;

        // Create a new Textbox widget with the specified text and options
        widget = new XTextbox(options.text, options);

        // Return the newly created widget
        return widget;

      // Case when the widget type is WBText
      case 'XText':
        // Set the origin of the Text widget to its center
        options.originX = 'center';
        options.originY = 'center';

        // Split string where the grapheme cluster break is allowed
        options.splitByGrapheme = true;

        // Allow user modification on the Text widget
        options.editable = true;

        // Allow multiline widget
        options.oneLine = false;

        // Create a new Text widget with the specified text and options
        widget = new XTextbox(options.text, options);
        // widget.resetResizeControls();
        // Return the newly created widget
        return widget;

      // Case when the widget type is XFile
      case WidgetType.XFile:
        // Lock the uniform scaling option to maintain proportional resizing
        options.lockUniScaling = true;

        // Allows images from third-party sites that allow cross-origin access to be used with canvas
        options.crossOrigin = 'anonymous';

        const preImg = new Image();

        // Return a new promise that creates a XFile

        let file = await new XFile(options);

        // // Create a new file widget from the URL specified in options
        // instance.fromURL(options).then((file) => {
        // Complete the promise and return the file
        return file;

      default:
        break;
    }
  }
  /**
   * Creates a deep clone of an object.
   * @param {object} obj - The object to be cloned.
   * @returns {object} - A deep clone of the input object.
   */
  deepClone(obj: any) {
    // Check if the input object is falsy (null, undefined, etc.), and return it as is.
    if (!obj) return obj;

    // Convert the object to a JSON string and then parse it back into an object.
    return JSON.parse(JSON.stringify(obj));
  }

  async renderWidgetAsync(data2: any, lockByDefault: boolean): Promise<any> {
    // Get the id from the data
    const id = data2.id;
    // Reference to the current Canvas Instance
    const self = this;
    // Finds an object with a corresponding id on the canvas
    const existObject = await self.findById(id);
    // Deep clones the data using WidgetService
    const data = this.deepClone(data2);
    // Checks if the object doesn't already exist or if there is no id
    if (!existObject || !id) {
      // Creates a Widget from the data
      const widget = await self.createWidgetAsync(data);
      // If a widget is not created, return
      if (!widget) return;
      // If lockByDefault is set, lock all movements and scaling for the widget
      if (lockByDefault) {
        widget.lockMovementX = true;
        widget.lockMovementY = true;
        widget.lockRotation = true;
        widget.lockScalingX = true;
        widget.lockScalingY = true;
        widget.locked = true;
        widget.dirty = true;
      }
      // If the data has an id, set the widget id with it
      if (data2.id) {
        widget.id = data2.id;
      }
      // Set widget's index as the length of the canvas objects
      widget.index = self._objects.length;
      // Add the widget to the canvas
      self.add(widget);
      // Set anyChanges to true, indicating there has been changes on the canvas
      self.anyChanges = true;
      // Request the canvas to re-render all objects
      self.requestRenderAll();
      // Return the newly created widget
      return widget;
    }
    // If the object already exists, update its properties with new data
    existObject.set(data);
    // Set dirty to true, indicating that the object needs to be re-rendered
    existObject.dirty = true;
    // Set anyChanges to true, indicating there has been changes on the canvas
    self.anyChanges = true;
    // Request the canvas to re-render all objects
    self.requestRenderAll();
    // Return the updated object
    return existObject;
  }
  sortByZIndex() {
    const self = this;

    // Sorting all objects on the canvas based on their z-index
    self._objects.sort((a, b) => a.zIndex - b.zIndex);

    // Rendering all changes
    self.requestRenderAll();
  }
  async renderImageAsync(data: any, callback: any) {
    // Define 'this' context for later references
    const self = this;

    // Default setup for a new image object
    const widgetData = {
      objType: '',
      scaleX: 0,
      left: 0,
      top: 0,
      scaleY: 0,
      strokeWidth: 0,
      stroke: 0,
      id: '',
      userId: '',
    };

    // Variable to store an existing image object
    let existedObj = null;

    // Flag to check if the current user is the creator of the image object
    let isCurrentUser = false;

    // Assign object type from the provided data
    widgetData.objType = data.objType;

    // Add properties from the provided data into widgetData
    Object.assign(widgetData, data);

    // If the object type is not 'WBLine' and not 'XArrow', set its position and scale
    if (widgetData.objType !== 'XLine' && widgetData.objType !== 'XArrow') {
      if (widgetData.scaleX) {
        widgetData.left = data.left;
        widgetData.scaleX = data.scaleX;
      }

      if (widgetData.scaleY) {
        widgetData.top = data.top;
        widgetData.scaleY = data.scaleY;
      }
    } else if (widgetData.objType === 'XArrow') {
      // If it's a 'XArrow', set its stroke width and color
      widgetData.strokeWidth = widgetData.strokeWidth
        ? widgetData.strokeWidth
        : data.strokeWidth;
      widgetData.stroke = widgetData.stroke ? widgetData.stroke : data.stroke;
    }

    // Loop through all objects in the canvas
    self &&
      self.forEachObject((obj, index) => {
        // If an object's id matches the new image object's id
        if (obj.id === widgetData.id) {
          // Store the existing object
          existedObj = obj;

          // If the user id matches or if both are null, set the flag to true
          if (
            (widgetData.userId && widgetData.userId === null) ||
            (!widgetData.userId && existedObj.userId === null)
          ) {
            isCurrentUser = true;
            return false;
          }

          return false;
        }
      });

    // If the flag is true, end this function
    if (isCurrentUser) return;

    // Create a new widget with the data
    const widget = await self.createWidgetAsync(widgetData);

    // Set its index
    widget.index = self._objects.length;

    // Add it to the canvas
    self.add(widget);

    // Render all objects in the canvas
    self.requestRenderAll();

    // Re-order all objects by their zIndex
    self.sortByZIndex();

    // Return the new object
    return widget;
  }

  lockObject(o: FabricObject) {
    // Start locking the object by calling many set methods on it.
    // Set isEditing property false which prevent object to be edited
    // Set other lock properties true to lock the object movement, scaling, skewing and rotation.
    // Set editable property false to protect the object from any edits
    o.set('isEditing', false)
      .set('lockMovementX', true)
      .set('lockMovementY', true)
      .set('locked', true)
      .set('lockScalingX', true)
      .set('lockScalingY', true)
      .set('lockSkewingX', true)
      .set('lockSkewingY', true)
      .set('lockRotation', true)
      .set('editable', false);
  }

  // Add a method for fabric.Canvas to unlock an object
  unLockObject(o: FabricObject) {
    // Start unlocking the object by calling many set methods on it.
    // Set lock properties false to allow object movement, scaling, skewing and rotation.
    // Set selectable property true to allow object to be selected.
    // Set editable property true to make the object editable.
    o.set('lockMovementX', false)
      .set('lockMovementY', false)
      .set('locked', false)
      .set('lockScalingX', false)
      .set('lockScalingY', false)
      .set('lockSkewingX', false)
      .set('lockSkewingY', false)
      .set('lockRotation', false)
      .set('selectable', true)
      .set('editable', true);
  }

  lockObjectsInCanvas() {
    const canvas = this;
    // If the canvas or its objects are undefined or null, just return
    if (!this || !this.getObjects()) return;

    // Otherwise, for each object in the canvas...
    this.getObjects().forEach((o) => {
      // If the object is of type 'common', or a temporary widget, or an arrow connector, skip it
      if (o.objType === 'common' || o === canvas.connectorArrow) {
        return;
      }
      // Lock all other objects
      else {
        o.set({
          lockMovementX: true,

          lockMovementY: true,

          lockRotation: true,

          lockScalingX: true,

          lockScalingY: true,

          locked: true,

          editable: false,

          selectable: false,
        });
      }
    });
  }
}

///////////////////////********************************************* */
const getLeftObject = function (objects: any) {
  objects.sort((a: any, b: any) => a.aCoords.tl.x - b.aCoords.tl.x);
  return objects[0];
};

const getHSortObjects = function (objects: any) {
  objects.sort((a: any, b: any) => a.aCoords.tl.x - b.aCoords.tl.x);
  return objects;
};

const getVSortObjects = function (objects: any) {
  objects.sort((a: any, b: any) => a.aCoords.tl.y - b.aCoords.tl.y);
  return objects;
};

const getTopObject = function (objects: any) {
  objects.sort((a: any, b: any) => a.aCoords.tl.y - b.aCoords.tl.y);
  return objects[0];
};

const getBottomObject = function (objects: any) {
  objects.sort((a: any, b: any) => b.aCoords.bl.y - a.aCoords.bl.y);

  return objects[0];
};

const getRightObject = function (objects: any) {
  objects.sort((a: any, b: any) => b.aCoords.tr.x - a.aCoords.tr.x);

  return objects[0];
};

let timeoutHandler: any;

//set all visible objects in canvas to caching true, and set a timerout, after 1 second, set all objects to caching false
//this will make the canvas render faster
//this is a hack, because the canvas is not rendering fast enough
function setObjectCaching(canvas: any) {
  if (!timeoutHandler) {
    canvas.forEachObject(function (obj: any) {
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
    canvas.forEachObject(function (obj: any) {
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
