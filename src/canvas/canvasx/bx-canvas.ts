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
import { StaticCanvas } from '../StaticCanvas';
import { Pattern } from '../../Pattern';
import { Path } from '../../shapes/Path';
import { XRectNotes } from '../../shapes/canvasx/XRectNotes';
import { Line } from '../../shapes/Line';

import { ActiveSelection } from '../../shapes/ActiveSelection';
import { Canvas } from '../Canvas';
import { AlignmentType, BXCanvasInterface } from './bx-canvas-interface';
import { XGroup } from '../../shapes/canvasx/XGroup';
import { Point } from '../../Point';
import * as util from '../../util';
import { Circle } from '../../shapes/Circle';
import { invertTransform, transformPoint } from '../../util';
import { XURL } from '../../shapes/canvasx/XURL';
import { WidgetType } from '../../shapes/canvasx/types';
import { Textbox } from '../../shapes/Textbox';
import { XFile } from '../../shapes/canvasx/XFile';
import { XCircleNotes, XShapeNotes } from '../../shapes/canvasx';
import { isActiveSelection } from '../../util/typeAssertions';
import { Rect } from '../../shapes/Rect';

let selectedObject: any;

export class XCanvas extends Canvas implements BXCanvasInterface {
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

  defaultNote = {}; // default sticky note

  boundHandlerMouseMove: any = null;
  dockingWidget: any = null;
  instanceOfConnector: any = null;
  startPointOfConnector: any = null;
  endPointOfConnector: any = null;
  inConnectingMode: boolean = false;

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

  /**
   * This method of fabric.Canvas prototype is used to create multiple sticky notes by location.
   * It takes an array of sticky notes text and a target widget as parameters.
   * The method creates new notes with settings like zIndex, text, backgroundColor, fill, lastEditedBy, width, height, emoji, textAlign, obj_type, left, _id, originX, and originY.
   * After creating each note, it adds this new note to the canvas and to an array newNotes.
   * After all notes have been created, it pushes all states to canvas's newState array and inserts new notes to the database via WidgetService.
   * If array stickyNotes is not empty, it adds all sticky notes to the active selection and sets it as the active object on the canvas.
   *
   * @param {Array<String>} stickyNotsArray - Array of strings, each representing the text of a sticky note.
   * @param {Object} targetWidget - Target widget object in which new sticky notes will be added.
   * @async
   * @function
   * @returns {Array} Returns an array of stickyNotes.
   */
  async createMutipleStickyNotesByLocation(
    stickyNotsArray: any,
    targetWidget: any
  ) {
    const self = this;
    const canvas = self;
    const stickyNotes = [];

    if (targetWidget.isEditing) targetWidget.exitEditing();

    let newState: any = [];
    let newNotes: any = [];
    for (let i = 0; i < stickyNotsArray.length; i++) {
      const textOfNote = stickyNotsArray[i];
      const newNote = targetWidget.toObject();

      newNote.zIndex = Date.now() * 100;
      newNote.text = textOfNote;
      newNote.backgroundColor = '#d3f4f4';
      newNote.fill = '#555555';
      newNote.lastEditedBy = 'AI';
      newNote.width = 230;
      newNote.height = 138;
      newNote.emoji = [0, 0, 0, 0, 0];
      newNote.textAlign = 'center';
      newNote.objType = 'XRectNotes';
      newNote.left =
        newNote.left +
        (i + 1) *
          (targetWidget.objType === 'WBTextbox'
            ? 240
            : targetWidget.getScaledWidth() + 30);
      newNote.id = Math.random().toString(36).substr(2, 9);
      newNote.originX = 'center';
      newNote.originY = 'center';

      const widget = await self.createWidgetAsync(newNote);

      // newState = newState.concat(widget.getUndoRedoState('ADDED'));

      self.add(widget);

      stickyNotes.push(widget);
      newNotes.push(newNote);
    }
    // canvas.pushNewState(newState);
    // await WidgetService.getInstance().insertWidgetArr(newNotes);

    if (stickyNotes && stickyNotes.length > 0) {
      const selectedObject = new ActiveSelection(); //canvas.getActiveSelection();
      selectedObject.add(...stickyNotes);
      canvas.requestRenderAll();
      canvas.setActiveObject(selectedObject);
    }
    return stickyNotes;
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

  zoomToViewObjects(objs: any[]): void {}
  recoverViewportTransformation(baordId: string): void {}
  gobackToPreviousViewport(): void {}
  updateViewportToLocalStorage(vpt: TMat2D): void {}

  async InitializeCanvas(): Promise<void> {
    const self = this;
    self.set('isEnablePanMoving', false);

    self.resetBackgoundImage();

    // self.resetUndoRedoStatus();

    // this.recoverViewportTransformation(store.getState().board.boardId);

    self.mouse = {
      x: 0,
      y: 0,
      down: false,
      w: 0,
      delta: new Point(0, 0),
      e: null,
      zoomUpdate: false,
      mouseMoveUpdate: false,
    };

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
      objType: 'XRectNotes',
    });
  }
  previousViewportTransform: TMat2D;
  async animateToRectWithOffset(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    widthOffset: number,
    heightOffset: number
  ): Promise<void> {
    const self = this;
    const canvas: XCanvas = self;
    // Calculate canvas width and height by subtracting the respective computed margins
    const canvasWidth = canvas.width - width;
    const canvasHeight = canvas.height - heightOffset;

    // Adjust zoom based on the ratio between the calculated canvas dimensions and given width, height
    const zoomAdjust =
      canvasWidth / width < canvasHeight / height
        ? (canvasWidth / width) * 0.85
        : (canvasHeight / height) * 0.85;

    // Calculate target zoom and viewport center by applying the zoom adjustment to the given viewport and center
    const targetZoom = vpt[0] * zoomAdjust;
    const targetVpCenter = {
      x: vpCenter.x + 135 / zoomAdjust / vpt[0],
      y: vpCenter.y + 15 / zoomAdjust / vpt[0],
    };

    // Fetch the current zoom level and viewport center
    const currentZoom = canvas.getZoom();
    const currentVpCenter = canvas.getVpCenter();

    // Flag to handle animator abort
    canvas.stopAnimateToRectStatus = false;

    await util.animate({
      startValue: 1,
      byValue: 60,
      endValue: 60,
      duration: 1000,
      // This function is called for every animation frame
      onChange(value) {
        // Calculate new X, Y coordinates and zoom level for each frame
        const newX =
          currentVpCenter.x +
          ((targetVpCenter.x - currentVpCenter.x) * value) / 60;
        const newY =
          currentVpCenter.y +
          ((targetVpCenter.y - currentVpCenter.y) * value) / 60;
        const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 60;

        // Apply new zoom and center for this frame
        self.zoomToCenterPoint(new Point(newX, newY), newZoom);

        self.requestRenderAll();
      },
      // Provide a function that checks whether the animation should be aborted
      abort() {
        return canvas.stopAnimateToRectStatus;
      },
      // Easing function to make the animation feel more natural
      easing: util.ease.easeInSine,
      // Callback to be executed once animation is complete
      async onComplete() {
        // Set object coordinates for the elements that are in the viewport
        self._objects.forEach((o: any) => {
          if (o.isOnScreen()) {
            o.setCoords();
          }
        });

        // Update viewport after animation
        self.updateViewport();

        // Reset the abort animation flag
        canvas.stopAnimateToRectStatus = false;

        canvas.setZoom(targetZoom);
      },
    });
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

  toUpdateNewObjectRemote: any[];
  toUpdateRemovedObjectRemote: any[];
  syncObjectChangeToRemote(id: string, data: any): void {
    throw new Error('Method not implemented.');
  }
  syncRemovedObjectToRemote(id: string): void {
    throw new Error('Method not implemented.');
  }
  syncNewObjectToRemote(data: any): void {
    throw new Error('Method not implemented.');
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
  getCenterPointOfScreen(): { x: number; y: number } {
    throw new Error('Method not implemented.');
  }
  getAbsoluteCoords(object: any): { left: number; top: number } {
    return {
      left: object.left + this._offset.left,
      top: object.top + this._offset.top,
    };
  }
  getCurCanvasSize() {
    const size = this.viewportTransform;
    return size;
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
    self.setActiveObject(sel);

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
  getObjectByID(id: string) {
    throw new Error('Method not implemented.');
  }
  getMyLastAddedObject(objType: string) {
    throw new Error('Method not implemented.');
  }
  loadData(widgets: any[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  planNewLayout(objects: any[], numOfColumns: number): void {
    const canvas = this;
    const self = this;

    let _objects = objects;

    let _numOfColumns = numOfColumns;

    _numOfColumns = parseInt(numOfColumns.toString(), 10);

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

  anyChanges: boolean;
  thumbnail: string;
  toUpdateObjectRemote: any[];
  lastMouseData: any;
  animateToRectForSlide(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any
  ): void {
    throw new Error('Method not implemented.');
  }
  async animateObjectToPosition(
    currentObj: any,
    left: number,
    top: number
  ): Promise<void> {
    const canvas = this;
    canvas.stopAnimateObjectToPositionStatus = false; // Flag used to potentially stop the animation

    let animating = false; // Initially, there is no animation

    // Using Fabric.js utility function to animate
    await util.animate({
      startValue: 1, // We start at this value

      byValue: 30, // Each frame, the value changes by this amount

      endValue: 30, // The animation will stop when reaching this value

      duration: 500, // The animation will run for 500ms

      onChange(value) {
        // This function will be called on every animation frame
        // Calculate new left and top values based on the interpolation between current and target values
        const newLeft =
          currentObj.left + ((left - currentObj.left) * value) / 30;

        const newTop = currentObj.top + ((top - currentObj.top) * value) / 30;

        currentObj.set({ left: newLeft, top: newTop }); // Update object's position.

        currentObj.dirty = true; // Mark the object as needing to be re-rendered

        // Request a render of the canvas on the next frame
        if (!animating) {
          animating = true;

          requestAnimationFrame(() => {
            canvas.requestRenderAll();

            animating = false;
          });
        }
      },

      // If this function returns true, the animation will abort.
      abort() {
        return canvas.stopAnimateObjectToPositionStatus;
      },

      // A predefined easing function from Fabric.js is used for the animation
      easing: util.ease.easeInSine,

      onComplete() {
        // This will be called when the animation is completed
        canvas.stopAnimateObjectToPositionStatus = false;
        // Ensure the object is in the correct position at the end of the animation
        if (currentObj) currentObj.set({ left, top });
      },
    });
  }
  stopAnimateObjectToPosition(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    canvas: XCanvas
  ): void {
    throw new Error('Method not implemented.');
  }
  async animateToRect(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any
  ): Promise<void> {
    const canvas = this;
    const self = canvas;
    const zoomAdjust =
      canvas.width / width < canvas.height / height
        ? canvas.width / width
        : (canvas.height / height) * 0.9;

    const targetZoom = vpt[0] * zoomAdjust;

    const targetVpCenter = vpCenter;

    const currentZoom = canvas.getZoom();

    const currentVpCenter = canvas.getVpCenter();

    canvas.stopAnimateToRectStatus = false;

    await util.animate({
      startValue: 1,
      byValue: 60,
      endValue: 60,
      duration: 1000,
      onChange(value: any) {
        const newX =
          currentVpCenter.x +
          ((targetVpCenter.x - currentVpCenter.x) * value) / 60;
        const newY =
          currentVpCenter.y +
          ((targetVpCenter.y - currentVpCenter.y) * value) / 60;
        const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 60;
        self.zoomToCenterPoint(new Point(newX, newY), newZoom);
        self.requestRenderAll();
      },
      abort() {
        return canvas.stopAnimateToRectStatus;
      },
      easing: util.ease.easeInSine,
      async onComplete() {
        self._objects.forEach((o: any) => {
          if (o.isOnScreen()) {
            o.setCoords();
          }
        });
        self.updateViewport();
        canvas.stopAnimateToRectStatus = false;
        canvas.setZoom(targetZoom);
      },
    });
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
  updateViewport(): void {}
  onObjectModifiedUpdateArrowsSave(object: FabricObject, canvas: XCanvas): void;
  onObjectModifiedUpdateArrowsSave(object: FabricObject, canvas: XCanvas): void;
  onObjectModifiedUpdateArrowsSave(object: unknown, canvas: unknown): void {
    throw new Error('Method not implemented.');
  }
  onRefreshArrowAfterScale(arrowId: string): FabricObject;
  onRefreshArrowAfterScale(arrowId: string, canvas: XCanvas): void;
  onRefreshArrowAfterScale(arrowId: string, canvas: XCanvas): void;
  onRefreshArrowAfterScale(
    arrowId: unknown,
    canvas?: unknown
  ): void | FabricObject {
    throw new Error('Method not implemented.');
  }
  resetConnector(object: FabricObject, canvas: XCanvas): void {
    throw new Error('Method not implemented.');
  }

  onObjectModifyUpdateArrows(object: FabricObject): void {
    throw new Error('Method not implemented.');
  }
  onObjectMoveUpdateArrowsSave(object: FabricObject): void {
    throw new Error('Method not implemented.');
  }
  updateConnectorsRemovedWidget(obj: FabricObject): void {
    throw new Error('Method not implemented.');
  }
  updateWhiteboardThumbnail(): void {
    throw new Error('Method not implemented.');
  }
  zindexArrBetween(lowz: number, highz: number, size: number): number[] {
    throw new Error('Method not implemented.');
  }
  createUniqueZIndex(inputZindex: number, tohigher: number): number {
    throw new Error('Method not implemented.');
  }
  createTopZIndex(): number {
    throw new Error('Method not implemented.');
  }
  sortByZIndex(): void {
    throw new Error('Method not implemented.');
  }
  _getIntersectedObjects(object: FabricObject): FabricObject[] {
    throw new Error('Method not implemented.');
  }
  getTopObjectByPointer(
    point: XY,
    ismouseup: boolean,
    isFrom: string
  ): FabricObject | null {
    throw new Error('Method not implemented.');
  }
  uploadFilesToWhiteboard(
    files: FileList,
    left: number,
    top: number,
    useFileName: string
  ): void {
    throw new Error('Method not implemented.');
  }
  async ungroup(object: XGroup): Promise<void> {
    const self = this;

    // // check if the object to ungroup is a 'WBGroup' and it has an ID
    // if (object.type === 'WBGroup' && object.id) {
    //   // get all objects(or widgets) from the object(group) to ungroup
    //   const objects = object.getObjects();

    //   // arrays to hold ungrouped widgets, their IDs, and states
    //   const widgets = [];
    //   const objIdArr = [];
    //   const toInsertWidgets = [];

    //   let stateList: any[] = [];

    //   // discard previous active object
    //   self.discardActiveObject();

    //   // loop through each object in the group
    //   for (let i = 0; i < objects.length; i++) {
    //     const obj = objects[i];

    //     // if the object doesn't have an ID, return without doing anything
    //     if (!obj.id) return;

    //     // adjust the object's position and scale relative to the group's scale
    //     obj.left = object.left + obj.left * object.scaleX;
    //     obj.top = object.top + obj.top * object.scaleY;
    //     obj.scaleX *= object.scaleX;
    //     obj.scaleY *= object.scaleY;

    //     // // set the property for user and whiteboard details
    //     // obj.userId = store.getState().user.userInfo.userId;
    //     // obj.whiteboardId = store.getState().board.board.id;

    //     // make the object selectable in user interface
    //     obj.selectable = true;

    //     // handle special cases for 'WBImage' type
    //     if (obj.objType === 'WBImage') {
    //       if (obj.src.indexOf('?') > -1) [obj.src] = obj.src.split('?');
    //     }

    //     // handle special cases for 'XConnector' type
    //     if (obj.objType === 'XConnector') {
    //       objIdArr.push(obj.id);
    //     }

    //     // create the widget from the object and add it to the canvas
    //     const widget = await self.createWidgetAsync(obj.getObject());

    //     if (obj.lines && obj.lines.length > 0) {
    //       widget.lines = obj.lines;
    //     }

    //     self.add(widget);

    //     // add this widget to final list
    //     widgets.push(widget);
    //     toInsertWidgets.push(widget.getObject());

    //     // update the coordinates of widget
    //     widget.setCoords();

    //     // record the state of operation for undo/redo functionality
    //     const state = widget.getUndoRedoState('ADDED');

    //     // push state to the state list
    //     stateList = stateList.concat(state);

    //     // rerender the canvas
    //     self.requestRenderAll();
    //   }

    //   // Database operation: Insert array of widgets into database
    //   WidgetService.getInstance().insertWidgetArr(toInsertWidgets);

    //   // get and push to stateList the deleted state of the object(group)
    //   const state2 = self.findById(object.id).getUndoRedoState('REMOVED');
    //   stateList = stateList.concat(state2);

    //   // push the new state list to the undo/redo stack
    //   self.pushNewState(stateList);

    //   // Database operation: Remove the 'group' object from the database
    //   WidgetService.getInstance().removeWidget(object.id);

    //   // reset all the arrow objects in group, if there are any
    //   if (objIdArr) {
    //     for (let j = 0; j < objIdArr.length; j++) {
    //       const connObj = self.findById(objIdArr[j]);
    //       if (!connObj) return;
    //       connObj.getresetArrowaftermoving();
    //     }
    //   }

    //   // create and set the new Active selection with all the ungrouped widgets
    //   const sel = canvas.getActiveSelection();
    //   sel.add(...widgets);
    //   self.setActiveObject(sel);

    //   // remove the original 'group' object from the canvas
    //   self.remove(object);

    //   // rerender the canvas
    //   self.requestRenderAll();
    // }
  }
  async group(group: ActiveSelection): Promise<void> {
    // const self = this; // canvas
    // const canvas = self;
    // let stateList: any = []; // state list for undo/redo functionality
    // const arrowtogroup: any = []; // array to hold arrow objects in group
    // if (group) {
    //   // if the object to group is a 'WBGroup' and it has an ID
    //   group.scaleX = group.scaleX || 1;
    //   group.scaleY = group.scaleY || 1;
    //   const objectArr: any = [];
    //   const objIdArr = [];
    //   group._objects.sort((a: any, b: any) => a.zIndex - b.zIndex);
    //   for (const obj of group.getObjects() as any[]) {
    //     if (!obj.id) {
    //       // if the object doesn't have an ID, return without doing anything
    //       return;
    //     }
    //     if (obj.locked) {
    //       // if the object is locked, show the message and return without doing anything
    //       canvas.discardActiveObject();
    //       canvas.requestRenderAll();
    //       return;
    //     }
    //     const newObj = obj.getObject(); // get the object
    //     const point = Util.getPointOnCanvasInGroup(obj); // get the point on canvas
    //     newObj.left = point.x; // set the left coordinate
    //     newObj.top = point.y; // set the top coordinate
    //     newObj.scaleX = obj.scaleX * obj.group.scaleX; // set the scaleX
    //     newObj.scaleY = obj.scaleY * obj.group.scaleY; // set the scaleY
    //     objectArr.push(newObj); // add the object to the array
    //     objIdArr.push(obj.id); // add the object ID to the array
    //   }
    //   for (const obj of objectArr) {
    //     // handle special cases for 'WBImage' type
    //     if (obj.lines && obj.lines.length > 0) {
    //       for (let i = 0; i < obj.lines.length; i++) {
    //         const line = obj.lines[i];
    //         const lineWidget: any = canvas.findById(line.id);
    //         if (!lineWidget) return; // if the line widget doesn't exist, return
    //         if (lineWidget.connectorStart) {
    //           // if the line widget has a connector start
    //           if (objIdArr.lastIndexOf(lineWidget?.connectorStart?.id) < 0) {
    //             // modified lines
    //             // const state0 = canvas
    //             //   .findById(lineWidget?.connectorStart?.id)
    //             //   ?.getUndoRedoState('MODIFIED', { fields: ['lines'] });
    //             stateList = stateList.concat(state0);
    //           }
    //         }
    //         if (lineWidget.connectorEnd) {
    //           // if the line widget has a connector end
    //           if (objIdArr.lastIndexOf(linewidget.connectorEnd?.id) < 0) {
    //             // modified lines
    //             const state0 = canvas
    //               .findById(linewidget.connectorEnd?.id)
    //               .getUndoRedoState('MODIFIED', { fields: ['lines'] });
    //             stateList = stateList.concat(state0);
    //           }
    //         }
    //         if (objIdArr.lastIndexOf(line.id) < 0) {
    //           // if the line widget is not in the group
    //           if (lineWidget.connectorEnd && lineWidget.connectorStart) {
    //             if (
    //               objIdArr.lastIndexOf(lineWidget?.connectorEnd?.id) >= 0 &&
    //               objIdArr.lastIndexOf(lineWidget?.connectorStart?.id) >= 0
    //             ) {
    //               // add this arrow to the group
    //               if (!arrowtogroup.includes(line.id))
    //                 arrowtogroup.push(line.id);
    //             }
    //           } else {
    //             // remove the arrow
    //             // const state0 = canvas
    //             //   .findById(line.id)
    //             //   .getUndoRedoState('REMOVED');
    //             // stateList = stateList.concat(state0);
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if (arrowtogroup.length > 0) {
    //     // if there are arrows in the group
    //     for (let i = 0; i < arrowtogroup.length; i++) {
    //       const objId = arrowtogroup[i];
    //       const obj = canvas.findById(objId);
    //       if (!obj) return;
    //       const newObj = obj.toObject();
    //       const point = Util.getPointOnCanvasInGroup(obj);
    //       newObj.left = point.x;
    //       newObj.top = point.y;
    //       objectArr.push(newObj);
    //     }
    //   }
    //   self.bindGroup(objectArr, async (tempGroup) => {
    //     // bind the group
    //     const groupId = await WidgetService.getInstance().insertWidget({
    //       angle: 0,
    //       width: tempGroup.width,
    //       height: tempGroup.height,
    //       left: tempGroup.left,
    //       top: tempGroup.top,
    //       lockRotation: false,
    //       locked: false,
    //       selectable: true,
    //       lockMovementX: false,
    //       lockMovementY: false,
    //       scaleX: 1,
    //       scaleY: 1,
    //       objType: 'WBGroup',
    //       objectArr,
    //       userId: store.getState().user.userInfo.userId,
    //       whiteboardId: store.getState().board.board.id,
    //       timestamp: Date.now(),
    //       zIndex: self.createTopZIndex,
    //     });
    //     tempGroup.id = groupId && groupId.data ? groupId.data : groupId; // set the ID of the group
    //     tempGroup.userId = store.getState().user.userInfo.userId; // set the user ID
    //     tempGroup.whiteboardId = store.getState().board.board.id; // set the whiteboard ID
    //     tempGroup.lockRotation = false; // set the lock rotation
    //     self.add(tempGroup); // add the group to the canvas
    //     tempGroup.setCoords(); //  set the coordinates of the group
    //     const state = tempGroup.getUndoRedoState('ADDED'); // get the state of the group
    //     stateList = stateList.concat(state); // push the state to the state list
    //     tempGroup.setControlVisible('mtr', false); // set the control visible
    //     self.setActiveObject(tempGroup); // set the group as the active object
    //     const arrowIds = []; // array to hold arrow IDs
    //     const noneArrowIds = []; // array to hold non-arrow IDs
    //     for (const obj of objectArr) {
    //       if (obj.objType === 'XConnector') {
    //         // if the object is an arrow, push it to the arrow IDs array
    //         arrowIds.push(obj.id);
    //       }
    //       if (obj.objType !== 'XConnector' && obj.objType !== 'common') {
    //         // if the object is not an arrow, push it to the non-arrow IDs array
    //         noneArrowIds.push(obj.id);
    //       }
    //     }
    //     for (const aid of arrowIds) {
    //       if (!canvas.findById(aid)) break;
    //       const state2 = canvas.findById(aid).getUndoRedoState('REMOVED'); // get the state of the arrow
    //       stateList = stateList.concat(state2); // push the state to the state list
    //       WidgetService.getInstance().removeWidget(aid); // remove the arrow from the database
    //       self.removeById(aid); // remove the arrow from the canvas
    //     }
    //     for (const naid of noneArrowIds) {
    //       // loop through each non-arrow object
    //       if (!canvas.findById(naid)) break;
    //       const state2 = canvas.findById(naid).getUndoRedoState('REMOVED'); // get the state of the object
    //       stateList = stateList.concat(state2); // push the state to the state list
    //       WidgetService.getInstance().removeWidget(naid); // remove the object from the database
    //       self.removeById(naid); // remove the object from the canvas
    //     }
    //     canvas.pushNewState(stateList); // push the state list to the undo/redo stack
    //     self.requestRenderAll(); //  rerender the canvas
    //   });
    // }
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
  async bindGroup(objectArr: [], callback: () => any): Promise<any> {
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
      return callback && callback();
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

      if (object && object.objType === 'WBImage') {
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
      lockRotation: true,
      originX: 'center',
      originY: 'center',
      zIndex: Date.now() * 100,
    });

    // If left and top coordinates were stored, set them to the newly created group
    if (left) group.left = left;

    if (top) group.top = top;

    // Call the callback with the newly created group as the argument
    return callback && callback();
  }
  resetBackgoundImage(): void {
    const self = this;

    let zoom = self.getZoom();

    // Adjust pattern and dot size based on zoom to maintain clarity
    let patternSize = 15;
    let dotSize = 1; // Increase dot size for better visibility at high zoom
    let scaledPatternSize = patternSize / zoom;
    let scaledDotSize = dotSize / zoom;

    // Consider using a higher resolution for the pattern canvas
    let patternSourceCanvas = new StaticCanvas(undefined, {
      width: scaledPatternSize,
      height: scaledPatternSize,
    });

    if (zoom > 0.3 && zoom < 2) {
      // Adjust dot properties to ensure it remains sharp at higher zoom levels
      let dot = new Circle({
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
    const backgroundColor = new Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: 'repeat',
      crossOrigin: 'anonymous',
    });

    // Set the generated pattern as the background
    self.set({
      backgroundColor: backgroundColor,
    });
    self.requestRenderAll();
  }
  checkIfResetBackground(): void {
    const self = this;
    //todo : need to recheck
    let currentZoom = 1;
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
  changeDefaulNote(note: any) {
    const self = this;
    const defaultNote = {
      width: note.width,
      height: note.height,
      fontSize: note.fontSize,
      fontFamily: note.fontFamily,
      fontWeight: note.fontWeight,
      fill: note.fill,
      textAlign: note.textAlign,
      backgroundColor: note.backgroundColor,
      scaleX: note.scaleX,
      scaleY: note.scaleY,
      type: note.type,
      locked: note.locked,
      lockMovementX: note.locked,
      lockMovementY: note.locked,
      lockRotation: note.locked,
      lockScalingX: note.locked,
      lockScalingY: note.locked,
    };
    self.defaultNote = defaultNote;
  }

  addDraw(e: any) {
    const canvas = this;
    // let canvas = BoardService.getInstance().getBoard();
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
    data.objType = 'XPath';

    // // Get the user's id
    // data.userId = store.getState().user.userInfo.userId;

    // // Get the id of the current whiteboard
    // data.whiteboardId = store.getState().board.board.id;

    // Set the timestamp to the current time
    data.timestamp = Date.now();

    // Make the object selectable
    data.selectable = true;

    // Set the zIndex to the current time, multiplied by 100
    data.zIndex = Date.now() * 100;

    // Set the origin points to the center
    data.originX = 'center';

    data.originY = 'center';

    //todo: implement to add drawing path
    // // Generate a unique id for the widget
    // data.id = UtilityService.getInstance().generateWidgetID();

    // // Insert the widget into the service
    // await WidgetService.getInstance().insertWidget(data);

    // // Render the widget on the canvas
    // const newPath = await canvas.renderWidgetAsync(data);

    // // Remove the original object from the canvas
    // canvas.remove(obj);

    // // Unlock all of the objects in the canvas
    // canvas.unlockObjectsInCanvas();

    // // Get the new state of the canvas after the object has been added
    // const newState = newPath.getUndoRedoState('ADDED');

    // // Push the new state to the canvas
    // canvas.pushNewState(newState);
  }

  onObjectModified() {
    const self = this;
    self.anyChanges = true;
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
      // // If source for image is empty, exit function
      // if (options.src === '' || !options.src) return;

      // // Replace 'smallPic/' with 'bigPic/' in source URL
      // options.src = options.src.replace('smallPic/', 'bigPic/');

      // // Set original width, height and apply lock to uniform scaling
      // options.oWidth = options.width;
      // options.oHeight = options.height;
      // options.lockUniScaling = true;

      // // Return a new promise
      // return new Promise((resolve, reject) => {
      //   // Create a new Image object
      //   const pugImg = new Image();
      //   pugImg.crossOrigin = 'anonymous';

      //   pugImg.onload = function (img) {
      //     // Create a '@/x-canvas/fabric' Image object and set its coords
      //     const pug = new Image(pugImg, options);
      //     pug.setCoords();

      //     // Resolve the promise with the created image
      //     resolve(pug);
      //   };

      //   // Set the source of the image to be the URL from the function getImageResizedURL
      //   // pugImg.src = getImageResizedURL(
      //   //   options,
      //   //   store.getState().board.zoomFactor
      //   // );
      // });

      case WidgetType.XGroup:
      // // Lock the uniform scaling option to maintain proportional resizing
      // options.lockUniScaling = true;

      // // Allow rotation of the widget
      // options.lockRotation = false;

      // // Return a new promise that binds a group
      // return new Promise((resolve, reject) => {
      //   // Bind a group with the specified objects
      //   self.bindGroup(options.objectArr, (widget: any) => {
      //     // Delete the original x-position of the widget
      //     delete options.originX;

      //     // Delete the original y-position of the widget
      //     delete options.originY;

      //     // Loop through the options
      //     for (const item in options) {
      //       // If the widget property is not the same as the corresponding option
      //       if (widget && widget[item] !== options[item]) {
      //         // Set the widget property to match the option
      //         widget.set(item, options[item]);
      //       }
      //     }

      //     // Unlock the rotation of the result widget, in case it has been modified by previous operations
      //     widget.lockRotation = false;

      //     // Set the control for rotate and scale at the middle top of object as invisible
      //     widget.setControlVisible('mtr', false);

      //     // Complete the promise and return the resulting widget
      //     resolve(widget);
      //   });
      // });

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
      case 'WBTextbox':
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
        widget = new Textbox(options.text, options);

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
        widget = new Textbox(options.text, options);
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

  async renderWidgetAsync(data2: any, lockByDefault: boolean) {
    //   // Get the id from the data
    //   const id = data2.id;
    //   // Reference to the current Canvas Instance
    //   const self = this;
    //   // Finds an object with a corresponding id on the canvas
    //   const existObject = await self.findById(id);
    //   // Deep clones the data using WidgetService
    //   const data = WidgetService.getInstance().deepClone(data2);
    //   // Checks if the object doesn't already exist or if there is no id
    //   if (!existObject || !id) {
    //     // Creates a Widget from the data
    //     const widget = await self.createWidgetAsync(data);
    //     // If a widget is not created, return
    //     if (!widget) return;
    //     // If lockByDefault is set, lock all movements and scaling for the widget
    //     if (lockByDefault) {
    //       widget.lockMovementX = true;
    //       widget.lockMovementY = true;
    //       widget.lockRotation = true;
    //       widget.lockScalingX = true;
    //       widget.lockScalingY = true;
    //       widget.locked = true;
    //       widget.dirty = true;
    //     }
    //     // If the data has an id, set the widget id with it
    //     if (data2.id) {
    //       widget.id = data2.id;
    //     }
    //     // Set widget's index as the length of the canvas objects
    //     widget.index = self._objects.length;
    //     // Add the widget to the canvas
    //     self.add(widget);
    //     // Set anyChanges to true, indicating there has been changes on the canvas
    //     self.anyChanges = true;
    //     // Request the canvas to re-render all objects
    //     self.requestRenderAll();
    //     // Return the newly created widget
    //     return widget;
    //   }
    //   // If the object already exists, update its properties with new data
    //   existObject.set(data);
    //   // Set dirty to true, indicating that the object needs to be re-rendered
    //   existObject.dirty = true;
    //   // Set anyChanges to true, indicating there has been changes on the canvas
    //   self.anyChanges = true;
    //   // Request the canvas to re-render all objects
    //   self.requestRenderAll();
    //   // Return the updated object
    //   return existObject;
  }

  createWidgetArr = async function (idArr: any, widgetArr: any, callback: any) {
    // // Reference to the current Canvas Instance
    // const self = this;
    // // If the second parameter is actually the callback function, reset the parameters correctly
    // if (typeof widgetArr === 'function') {
    //   callback = widgetArr;
    //   widgetArr = [];
    // }
    // // If the widgetArr is not provided, initialize it as an empty array
    // if (!widgetArr) {
    //   widgetArr = [];
    // }
    // // If the id array is not provided or is empty, execute the callback with the widget array and end function execution
    // if (!idArr || idArr.length === 0) {
    //   return callback && callback(widgetArr);
    // }
    // // Remove the first id from the array
    // const id = idArr.splice(0, 1)[0];
    // // Use the id to find the corresponding widget data
    // const data = WidgetService.getInstance().getWidgetFromWidgetList(id);
    // // If the widget data exists
    // if (data) {
    //   // If the data type is a 'WBLine' or a 'XConnector', set initial coordinates
    //   if (data.objType === 'WBLine' || data.objType === 'XConnector') {
    //     data.initX1 = data.x1;
    //     data.initX2 = data.x2;
    //     data.initY1 = data.y1;
    //     data.initY2 = data.y2;
    //   } else {
    //     // Else set initial position
    //     data.initLeft = data.left;
    //     data.initTop = data.top;
    //   }
    //   // If the data is not locked, explicitly set 'locked' to false
    //   if (!data.locked) {
    //     data.locked = false;
    //   }
    //   // Lock or unlock movements, rotation and scaling based on 'locked' property
    //   data.lockMovementX = data.locked;
    //   data.lockMovementY = data.locked;
    //   data.lockRotation = data.locked;
    //   data.lockScalingX = data.locked;
    //   data.lockScalingY = data.locked;
    //   // Set controls and borders based on 'locked' property
    //   data.hasControls = !data.locked;
    //   data.hasBorders = !data.locked;
    //   // Set origin to center
    //   data.originX = 'center';
    //   data.originY = 'center';
    //   // Create a widget with the provided data asynchronously
    //   const widget = await self.createWidgetAsync(data);
    //   // Add the newly created widget to the widget array
    //   widgetArr.push(widget);
    //   // Recursively call the function with updated idArr and widgetArr
    //   self.createWidgetArr(idArr, widgetArr, callback);
    // } else {
    //   // If no data is found for the id, call the function again recursively (skip this id)
    //   self.createWidgetArr(idArr, widgetArr, callback);
    // }
  };

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
      userid: '',
    };

    // Variable to store an existing image object
    let existedObj = null;

    // Flag to check if the current user is the creator of the image object
    let isCurrentUser = false;

    // Assign object type from the provided data
    widgetData.objType = data.objType;

    // Add properties from the provided data into widgetData
    Object.assign(widgetData, data);

    // If the object type is not 'WBLine' and not 'XConnector', set its position and scale
    if (
      widgetData.objType !== 'WBLine' &&
      widgetData.objType !== 'XConnector'
    ) {
      if (widgetData.scaleX) {
        widgetData.left = data.left;
        widgetData.scaleX = data.scaleX;
      }

      if (widgetData.scaleY) {
        widgetData.top = data.top;
        widgetData.scaleY = data.scaleY;
      }
    } else if (widgetData.objType === 'XConnector') {
      // If it's a 'XConnector', set its stroke width and color
      widgetData.strokeWidth = widgetData.strokeWidth
        ? widgetData.strokeWidth
        : data.strokeWidth;
      widgetData.stroke = widgetData.stroke ? widgetData.stroke : data.stroke;
    }

    // Loop through all objects in the canvas
    // self &&
    //   self.forEachObject((obj, index) => {
    //     // If an object's id matches the new image object's id
    //     if (obj.id === widgetData.id) {
    //       // Store the existing object
    //       existedObj = obj;

    //       // If the user id matches or if both are null, set the flag to true
    //       if (
    //         (widgetData.userid && widgetData.userid === null) ||
    //         (!widgetData.userid && existedObj.userid === null)
    //       ) {
    //         isCurrentUser = true;
    //         return false;
    //       }

    //       return false;
    //     }
    //   });

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

  async switchNoteType(
    objects: any,
    type: string,
    skipSaving: boolean
  ): Promise<void> {
    // const self: XCanvas = this;
    // const canvas = self;
    // const selectedObj = [];
    // // if (self.getActiveObject() && self?.getActiveObject()?.isEditing) {
    // //   self.getActiveObject()?.exitEditing();
    // // }
    // // await Util.sleep(200);
    // for (const object of objects) {
    //   if (type === '33') {
    //     const widget = WidgetService.getInstance().getWidgetFromWidgetList(
    //       object.id
    //     );
    //     widget.objType = 'XRectNotes';
    //     widget.noteType = 'square';
    //     widget.text = object.text;
    //     widget.fontSize = object.fontSize;
    //     widget.width = 138;
    //     widget.height = 138;
    //     widget.maxHeight = 138;
    //     widget.fontFamily = 'Inter';
    //     widget.originX = 'center';
    //     widget.originY = 'center';
    //     if (
    //       !widget.backgroundColor ||
    //       widget.backgroundColor === 'transparent' ||
    //       widget.backgroundColor === 'rgba(0, 0, 0, 0)'
    //     ) {
    //       widget.backgroundColor = '#FCEC8A';
    //     }
    //     self.discardActiveObject();
    //     self.remove(object);
    //     const objWidget = await self.renderWidgetAsync(widget);
    //     selectedObj.push(objWidget);
    //   }
    //   if (type === '53') {
    //     const widget = WidgetService.getInstance().getWidgetFromWidgetList(
    //       object.id
    //     );
    //     widget.objType = 'XRectNotes';
    //     widget.noteType = 'rect';
    //     widget.text = object.text;
    //     widget.fontSize = object.fontSize;
    //     widget.fill = object.fill;
    //     widget.width = 230;
    //     widget.height = 138;
    //     widget.maxHeight = 138;
    //     widget.fontFamily = 'Inter';
    //     widget.originX = 'center';
    //     widget.originY = 'center';
    //     if (
    //       !widget.backgroundColor ||
    //       widget.backgroundColor === 'transparent' ||
    //       widget.backgroundColor === 'rgba(0, 0, 0, 0)'
    //     ) {
    //       widget.backgroundColor = '#FCEC8A';
    //     }
    //     self.discardActiveObject();
    //     self.remove(object);
    //     const objWidget = await self.renderWidgetAsync(widget);
    //     selectedObj.push(objWidget);
    //   }
    //   if (type === 'circle') {
    //     const widget = WidgetService.getInstance().getWidgetFromWidgetList(
    //       object.id
    //     );
    //     widget.objType = 'XCircleNotes';
    //     widget.noteType = 'circle';
    //     widget.text = object.text;
    //     widget.fontSize = object.fontSize;
    //     widget.fill = object.fill;
    //     widget.width = 138;
    //     widget.height = 138;
    //     widget.maxHeight = 138;
    //     widget.fontFamily = 'Inter';
    //     widget.originX = 'center';
    //     widget.originY = 'center';
    //     if (
    //       !widget.backgroundColor ||
    //       widget.backgroundColor === 'transparent' ||
    //       widget.backgroundColor === 'rgba(0, 0, 0, 0)'
    //     ) {
    //       widget.backgroundColor = '#FCEC8A';
    //     }
    //     self.discardActiveObject();
    //     self.remove(object);
    //     const objWidget = await self.renderWidgetAsync(widget);
    //     selectedObj.push(objWidget);
    //   }
    //   if (type === 'textbox') {
    //     const widget = WidgetService.getInstance().getWidgetFromWidgetList(
    //       object.id
    //     );
    //     widget.objType = 'WBTextbox';
    //     widget.text = object.text;
    //     widget.fontSize = object.fontSize;
    //     self.discardActiveObject();
    //     self.remove(object);
    //     const objWidget = await self.renderWidgetAsync(widget);
    //     selectedObj.push(objWidget);
    //   }
    //   if (type === 'text') {
    //     const widget = WidgetService.getInstance().getWidgetFromWidgetList(
    //       object.id
    //     );
    //     widget.objType = 'WBText';
    //     widget.text = object.text;
    //     widget.originX = 'center';
    //     widget.originY = 'center';
    //     widget.textAlign = 'left';
    //     widget.fontSize = object.fontSize;
    //     /* special handling for Roboto */
    //     if (object.fontFamily === 'Inter') {
    //       widget.width = object.width + 5;
    //     }
    //     if (object.text !== '') {
    //       widget.backgroundColor = 'transparent';
    //     } else {
    //       widget.backgroundColor = '#FCEC8A';
    //     }
    //     widget.fill = '#555555';
    //     self.discardActiveObject();
    //     self.remove(object);
    //     const objWidget = await self.renderWidgetAsync(widget);
    //     selectedObj.push(objWidget);
    //     canvas.requestRenderAll();
    //   }
    // }
    // if (!skipSaving) {
    //   if (selectedObj && selectedObj.length > 2) {
    //     const sel = canvas.getActiveSelection();
    //     sel.add(...selectedObj);
    //     canvas.setActiveObject(sel);
    //     canvas.requestRenderAll();
    //     sel.saveData('MODIFIED', [
    //       'objType',
    //       'width',
    //       'height',
    //       'fill',
    //       'text',
    //       'fontsize',
    //       'originX',
    //       'originY',
    //       'type',
    //       'backgroundColor',
    //       'fontFamily',
    //     ]);
    //   } else {
    //     const obj = selectedObj[0];
    //     canvas.setActiveObject(obj);
    //     canvas.requestRenderAll();
    //     obj.saveData('MODIFIED', [
    //       'objType',
    //       'width',
    //       'height',
    //       'fill',
    //       'text',
    //       'fontsize',
    //       'originX',
    //       'originY',
    //       'left',
    //       'top',
    //       'noteType',
    //       'backgroundColor',
    //       'fontFamily',
    //     ]);
    //   }
    // }
  }

  removeWidget(target: any) {
    const self = this;
    const toDeleteWidgetArr = [];
    // If no target is provided, end the function
    if (!target) return;
    // Check if the target is an active selection of objects
    if (isActiveSelection(target)) {
      let newState = [];
      let containLockedObj = false;
      // Look at each object in the selection
      for (const obj of target._objects) {
        // If the object is locked, record it
        if (obj.locked) {
          containLockedObj = true;
        }
      }
      // // For every object in the selection
      // for (const obj of target._objects) {
      //   // Get their undo/redo state and add it to our array of new States.
      //   // Assigning a state of 'REMOVED' to each of them
      //   newState = newState.concat(obj.getUndoRedoState('REMOVED'));
      //   // Add the id of the object to the array of widgets to be deleted
      //   toDeleteWidgetArr.push(obj.id);
      // }
      // // Push this newState into the fabric.js states for handling undo/redo
      // canvas.pushNewState(newState);
      // Remove each of the objects in the selection from canvas
      for (const obj of target._objects) {
        self.remove(obj);
      }
      // Deselect the group of objects, since they've just been removed
      self.discardActiveObject();
    } else {
      // If the target is just a single object, get its undo/redo state as well
      // const newState = target.getUndoRedoState('REMOVED');
      // // Push this new state to the fabric.js states
      // canvas.pushNewState(newState);
      // Remove the single object from the canvas
      self.remove(target);
    }
    // Remove the target from the canvas (again, to ensure removal in case it was missed earlier)
    self.remove(target);
    // Request the canvas to re-render itself, now that objects have been removed
    self.requestRenderAll();
  }

  async AddMultipleStickyNoteToBoardByText(text: any) {
    // const newText = text;
    // let textArray = newText.split('\n');
    // textArray = textArray.filter((item: any) => item !== '');
    // let newState = [];
    // let newNotes = [];
    // const stickyNotes = [];
    // let positionOfScreen = canvas.getCenterPointOfScreen();
    // let position = canvas.getPositionOnCanvas(
    //   positionOfScreen.x,
    //   positionOfScreen.y
    // );
    // const self = this;
    // for (let i = 0; i < textArray.length; i++) {
    //   const textOfNote = textArray[i];
    //   let data = {
    //     id: UtilityService.getInstance().generateWidgetID(),
    //     angle: 0,
    //     backgroundColor: '#d3f4f4',
    //     width: 230,
    //     height: 138,
    //     scaleX: 1,
    //     scaleY: 1,
    //     fontSize: 25,
    //     fontFamily: 'Inter',
    //     fontWeight: 400,
    //     originX: 'center',
    //     originY: 'center',
    //     left: position.x + i * 245,
    //     top: position.y,
    //     selectable: true,
    //     emoji: [0, 0, 0, 0, 0],
    //     text: textOfNote,
    //     textAlign: 'center',
    //     fill: '#000',
    //     objType: 'XRectNotes',
    //     userid: store.getState().user.userInfo.userId,
    //     whiteboardId: store.getState().board.board.id,
    //     timestamp: Date.now(),
    //     zIndex: Date.now() * 100,
    //     path: '',
    //     fixedStrokeWidth: 1,
    //     icon: 0,
    //     lineWidth: 0,
    //     shapeScaleX: 1,
    //     shapeScaleY: 1,
    //     lastEditedBy: 'AI',
    //   };
    //   const widget = await self.createWidgetAsync(data);
    //   newState = newState.concat(widget.getUndoRedoState('ADDED'));
    //   self.add(widget);
    //   stickyNotes.push(widget);
    //   newNotes.push(data);
    // }
    // self.pushNewState(newState);
    // await WidgetService.getInstance().insertWidgetArr(newNotes);
    // const selectedObject = self.getActiveSelection();
    // selectedObject.add(...stickyNotes);
    // self.requestRenderAll();
    // self.setActiveObject(selectedObject);
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

  recoverLockStatusFromCollection(o: any) {
    //   // Get the instance of the widget using it's id from the widget service
    //   // const widget =  //WidgetService.getInstance().getWidgetFromWidgetList(o.id);
    //   // // If widget is not found return
    //   // if (!widget) return;
    //   // // Set the properties of the object o with the respective properties of the found widget
    //   // o.lockMovementX = widget.lockMovementX;
    //   // o.lockMovementY = widget.lockMovementY;
    //   // o.lockRotation = widget.lockRotation;
    //   // o.lockScalingX = widget.lockScalingX;
    //   // o.lockScalingY = widget.lockScalingY;
    //   // // Set the locked status. If not available in widget set it as false
    //   // o.locked = widget.locked ? widget.locked : false;
    //   // // Set the editable status. If not available in widget set it as false
    //   // o.editable = widget.editable ? widget.editable : false;
    //   // o.selectable = widget.selectable ? widget.selectable : false;
    //   // // Set the dirty status as true to indicate that the object has been modified
    //   // o.dirty = true;
    //   // If object is locked, set the cursor icon as lock else set it to default
    //   // if (o.locked === true) {
    //   //   o.hoverCursor = `url("${cursorLock}") 0 0, auto`;
    //   // } else {
    //   //   o.hoverCursor = 'default';
    //   // }
  }

  // Adding a function to fabric.Canvas to unlock all objects in the canvas
  unlockObjectsInCanvas() {
    const self = this;

    // If the canvas or its objects are undefined or null, just return
    if (!self || !self.getObjects()) return;

    // Otherwise, for each object in the canvas...
    self.getObjects().forEach((o) => {
      // If the object is of type 'common', skip it
      if (o.objType === 'common') return;

      // Unlock the object, restoring its status from the Collection
      // self.recoverLockStatusFromCollection(o);

      o.lockMovementX = false;
      o.lockMovementY = false;
      o.lockRotation = false;
      o.lockScalingX = false;
      o.lockScalingY = false;
      o.locked = false;
      // o.editable = true;
      o.selectable = true;
      // Mark the object as dirty (requiring a re-render)
      o.dirty = true;

      // Change the cursor to the default style`
      self.hoverCursor = 'default';
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

function setObjectCaching(canvas: any) {
  //set all visible objects in canvas to caching true, and set a timerout, after 1 second, set all objects to caching false
  //this will make the canvas render faster
  //this is a hack, because the canvas is not rendering fast enough

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
