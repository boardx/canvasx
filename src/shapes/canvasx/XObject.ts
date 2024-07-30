//**Fabric */
//@ts-nocheck
// import { FabricObject } from '../Object/FabricObject';
import { XCanvas } from '../../../fabric';
import { XY, Point } from '../../Point';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';

//**Utils */
export class FabricObject2 {
  // statefullCache = false;
  // noScaleCache = true;
  // borderScaleFactor = 2;
  // padding = 0;
  // prototypeselectable = true;
  // isRemoteEditing = false;
  // RemoteUserWhoEditing = '';
  // NUM_FRACTION_DIGITS = 2;

  // borderColor = 'red';
  // cornerSize = 12;
  // hasRotatingPoint = false;
  // minScaleLimit = 0.01;
  // cornerColor = 'black';
  // cornerStrokeColor = 'black';
  // cornerStyle = 'circle';
  // id = '';
  // idsInGroup: string[] = [];
  // selectable = true;
  // activeSelectWithoutArrow: any[] = [];
  // activeSelectionWithArrow: any[] = [];

  transformPointToCanvas(point: XY): Point {
    const self = this;
    const toTransformPoint = new Point(point);
    const transformedPoint = toTransformPoint.transform(
      self.calcTransformMatrix()
    );
    return transformedPoint;
  }

  transformPointFromCanvas(point: XY): Point {
    const self = this;
    const toTransformPoint = new Point(point);
    const transformedPoint = toTransformPoint.transform(
      invertTransform(self.calcTransformMatrix())
    );
    return transformedPoint;
  }

  transformPointToViewport(point: XY) {
    const self = this;
    const toTransformPoint = new Point(point);

    const mCanvas = self.canvas?.viewportTransform;
    const mObject = self.calcTransformMatrix();
    const matrix = mCanvas
      ? multiplyTransformMatrices(mCanvas, mObject)
      : mObject;

    const transformedPoint = toTransformPoint.transform(matrix);
    return transformedPoint;
  }

  text: string = '';

  getText() {
    if (this.text) return this.text;
    else return '';
  }

  saveData(action: string, fields: string[]) {}

  // containsPointNew(point, ismouseup, isFrom) {
  //   const self = this;

  //   let objContains = false;

  //   if (!self || self === undefined) return objContains;

  //   if (ismouseup) {
  //     const insideObj = this.extContainsPoint(point);

  //     if (insideObj) {
  //       objContains = true;
  //     } else {
  //       const Apoint = self.convertACoordToRCoord(point.x, point.y);

  //       const currZoom = canvas.getZoom();

  //       const edgeoff = 0.25;

  //       const condition1 =
  //         Math.abs(Apoint.x) > 0.5 &&
  //         Math.abs(Apoint.x) < 0.5 + edgeoff &&
  //         Math.abs(Apoint.y) <= 0.5;

  //       const condition2 =
  //         Math.abs(Apoint.y) > 0.5 &&
  //         Math.abs(Apoint.y) < 0.5 + edgeoff &&
  //         Math.abs(Apoint.x) <= 0.5;

  //       if (condition1) {
  //         objContains = true;
  //       } else if (condition2) {
  //         objContains = true;
  //       }

  //       // if consider the four middle controls, we can add conditions here
  //       // using the following values: self.cornerSize, self.controls.xxx.offsetX/offsetY,
  //       const corSize = self.cornerSize + 10;

  //       let offX;

  //       let offY;

  //       const Lpoint = self.convertRCoordToACoord(-0.6, 0.0);

  //       const Rpoint = self.convertRCoordToACoord(0.6, 0.0);

  //       const Tpoint = self.convertRCoordToACoord(0.0, -0.6);

  //       const Bpoint = self.convertRCoordToACoord(0.0, 0.6);

  //       offX = self.controls.mla.offsetX;

  //       const mlxmin = Lpoint.x + (offX - 0.5 * corSize) / currZoom;

  //       const mlxmax = Lpoint.x + (offX + 0.5 * corSize) / currZoom;

  //       const mlrymin = Lpoint.y + (-0.5 * corSize) / currZoom;

  //       const mlrymax = Lpoint.y + (0.5 * corSize) / currZoom;

  //       if (
  //         point.x > mlxmin &&
  //         point.x < mlxmax &&
  //         point.y > mlrymin &&
  //         point.y < mlrymax
  //       ) {
  //         // the mouse up at mla
  //         if (isFrom) {
  //           canvas.arrowStartObject = self;

  //           canvas.arrowStartRx = -0.5;

  //           canvas.arrowStartRy = 0.0;
  //         } else {
  //           canvas.arrowEndObject = self;

  //           canvas.arrowEndRx = -100;

  //           canvas.arrowEndRy = 100;
  //         }

  //         objContains = true;
  //       }

  //       // mra
  //       offX = self.controls.mra.offsetX;

  //       const mrxmin = Rpoint.x + (offX - 0.5 * corSize) / currZoom;

  //       const mrxmax = Rpoint.x + (offX + 0.5 * corSize) / currZoom;

  //       if (
  //         point.x > mrxmin &&
  //         point.x < mrxmax &&
  //         point.y > mlrymin &&
  //         point.y < mlrymax
  //       ) {
  //         // the mouse up at mra
  //         if (isFrom) {
  //           canvas.arrowStartObject = self;

  //           canvas.arrowStartRx = 0.5;

  //           canvas.arrowStartRy = 0.0;
  //         } else {
  //           canvas.arrowEndObject = self;

  //           canvas.arrowEndRx = 0.5;

  //           canvas.arrowEndRy = 0.0;
  //         }

  //         objContains = true;
  //       }

  //       // mta
  //       offY = self.controls.mta.offsetY;

  //       const mtbxmin = Tpoint.x + (-0.5 * corSize) / currZoom;

  //       const mtbxmax = Tpoint.x + (+0.5 * corSize) / currZoom;

  //       const mtymin = Tpoint.y + (offY - 0.5 * corSize) / currZoom;

  //       const mtymax = Tpoint.y + (offY + 0.5 * corSize) / currZoom;

  //       if (
  //         point.x > mtbxmin &&
  //         point.x < mtbxmax &&
  //         point.y > mtymin &&
  //         point.y < mtymax
  //       ) {
  //         // the mouse up at mta
  //         if (isFrom) {
  //           canvas.arrowStartObject = self;
  //           canvas.arrowStartRx = 0.0;
  //           canvas.arrowStartRy = -0.5;
  //         } else {
  //           canvas.arrowEndObject = self;
  //           canvas.arrowEndRx = 0.0;
  //           canvas.arrowEndRy = -0.5;
  //         }

  //         objContains = true;
  //       }

  //       // mba
  //       offY = self.controls.mba.offsetY;
  //       const mbymin = Bpoint.y + (offY - 0.5 * corSize) / currZoom;
  //       const mbymax = Bpoint.y + (offY + 0.5 * corSize) / currZoom;

  //       if (
  //         point.x > mtbxmin &&
  //         point.x < mtbxmax &&
  //         point.y > mbymin &&
  //         point.y < mbymax
  //       ) {
  //         // the mouse up at mba
  //         if (isFrom) {
  //           canvas.arrowStartObject = self;
  //           canvas.arrowStartRx = 0.0;
  //           canvas.arrowStartRy = 0.5;
  //         } else {
  //           canvas.arrowEndObject = self;
  //           canvas.arrowEndRx = 0.0;
  //           canvas.arrowEndRy = 0.5;
  //         }

  //         objContains = true;
  //       }
  //     }
  //   } else {
  //     objContains = this.extContainsPoint(point);
  //   }

  //   return objContains;
  // }

  // frameExtentContainsPoint(point) {
  //   const self = this;

  //   let minx;

  //   let maxx;

  //   let miny;

  //   let maxy;

  //   if (self.group) {
  //     const point1 = Boardx.Util.getOnePointOnCanvasInGroupFrame(self, {
  //       x: self.aCoords.tl.x,
  //       y: self.aCoords.tl.y,
  //     });
  //     const point2 = Boardx.Util.getOnePointOnCanvasInGroupFrame(self, {
  //       x: self.aCoords.br.x,
  //       y: self.aCoords.br.y,
  //     });
  //     minx = point1.x;
  //     maxx = point2.x;
  //     miny = point1.y;
  //     maxy = point2.y;
  //   } else {
  //     minx = self.aCoords.tl.x;
  //     maxx = self.aCoords.br.x;
  //     miny = self.aCoords.tl.y;
  //     maxy = self.aCoords.br.y;
  //   }
  //   if (
  //     point.x >= minx &&
  //     point.x <= maxx &&
  //     point.y >= miny &&
  //     point.y <= maxy
  //   ) {
  //     return true;
  //   }

  //   return false;
  // }

  convertACoordToRCoord(ax: any, ay: any) {
    const target = this;
    const canvas = this.canvas as XCanvas;

    const obj = canvas?.findById(target.id);

    if (!obj) return null;

    const { left, top, width, height, scaleX, scaleY, angle } = obj;

    // be sure, the origin is at center
    const angleT = (angle * Math.PI) / 180;

    const deltaX = ax - left;

    const deltaY = ay - top;

    const rx =
      (deltaX * Math.cos(angleT) + deltaY * Math.sin(angleT)) /
      (width * scaleX);

    const ry =
      (-deltaX * Math.sin(angleT) + deltaY * Math.cos(angleT)) /
      (height * scaleY);

    return {
      x: parseFloat(rx.toFixed(3)),
      y: parseFloat(ry.toFixed(3)),
    };
  }

  convertRCoordToACoord1(rx: number, ry: number) {
    const target = this;
    const canvas = this.canvas as XCanvas;
    const obj = canvas.findById(target.id);

    if (!obj) return null;

    const { left, top, width, height, scaleX, scaleY, angle } = obj;

    const angle1 = (angle * Math.PI) / 180;

    let offsetX = 0;

    let offsetY = 0;

    if (rx <= 0 && ry <= 0) {
      if (rx < ry) {
        rx = -0.5;
        ry = 0;
        offsetX = 0;
      } else {
        rx = 0;
        ry = -0.5;
        offsetY = 0;
      }
    }

    if (rx <= 0 && ry >= 0) {
      if (Math.abs(rx) > ry) {
        rx = -0.5;
        ry = 0;
        offsetX = 0;
      } else {
        rx = 0;
        ry = 0.5;
        offsetY = 0;
      }
    }

    if (rx >= 0 && ry >= 0) {
      if (rx > ry) {
        rx = 0.5;
        ry = 0;
        offsetX = 0;
      } else {
        rx = 0;
        ry = 0.5;
        offsetY = 0;
      }
    }

    if (rx >= 0 && ry <= 0) {
      if (rx > Math.abs(ry)) {
        rx = 0.5;
        ry = 0;
        offsetX = 0;
      } else {
        rx = 0;
        ry = -0.5;
        offsetY = 0;
      }
    }

    const ax =
      (rx * Math.cos(angle1) + ry * Math.sin(angle1)) * (width * scaleX) +
      left +
      offsetX;

    const ay =
      (-rx * Math.sin(angle1) + ry * Math.cos(angle1)) * (height * scaleY) +
      top +
      offsetY;

    return {
      x: parseFloat(ax.toFixed(3)),
      y: parseFloat(ay.toFixed(3)),
    };
  }

  convertRCoordToACoord(rx: number, ry: number) {
    const target = this;
    const canvas = this.canvas as XCanvas;
    const obj = canvas.findById(target.id);
    if (!obj) return null;

    const { left, top, width, height, scaleX, scaleY, angle } = obj;

    const angle1 = (angle * Math.PI) / 180;

    const ax =
      (rx * Math.cos(angle1) + ry * Math.sin(angle1)) * (width * scaleX) + left;

    const ay =
      (-rx * Math.sin(angle1) + ry * Math.cos(angle1)) * (height * scaleY) +
      top;

    return {
      x: parseFloat(ax.toFixed(3)),
      y: parseFloat(ay.toFixed(3)),
    };
  }

  convertRCoordToACoordPartialAS(rx: number, ry: number) {
    const target = this;
    const canvas = this.canvas as XCanvas;
    const obj = canvas.findById(target.id);

    if (obj && obj.group) {
      const angle = ((canvas?.findById(target.id)?.angle ?? 0) * Math.PI) / 180;

      const scaleY =
        (canvas?.findById(target.id)?.scaleY ?? 0) * obj.group.scaleY;

      if (rx < -0.5) rx = -0.5;

      if (ry < -0.5) ry = -0.5;

      if (rx > 0.5) rx = 0.5;

      if (ry > 0.5) ry = 0.5;

      const ax =
        (rx * Math.cos(angle) + ry * Math.sin(angle)) *
          (this.width * this.scaleX) +
        this.left;

      const ay =
        (-rx * Math.sin(angle) + ry * Math.cos(angle)) *
          (this.height * scaleY) +
        this.top;

      const aax = parseFloat(ax.toFixed(3)); // this reduces digits after decimal not working

      const aay = parseFloat(ay.toFixed(3));

      const point = {
        x: aax,
        y: aay,
      };

      return point;
    }
  }

  // async saveData(action, fields) {
  //   const target = this;

  //   const context = {};

  //   context.fields = fields;

  //   this.idsInGroup = [];

  //   ASnoarrow = [];

  //   ASarrow = [];

  //   if (
  //     target.objType === 'WBRectNotes' ||
  //     target.objType === 'XCircleNotes'
  //   ) {
  //     target.lastEditedBy = store.getState().user.userInfo.userId;
  //   }

  //   canvas.requestRenderAll();

  //   // update group
  //   if (target.parent) {
  //     let newState = [];

  //     for (const obj of target.getObjects()) {
  //       if (obj.id) {
  //         this.idsInGroup.push(obj.id);

  //         if (obj.objType === 'XConnector') {
  //           this.activeSelectionWithArrow.push(obj.id);
  //         }

  //         if (obj.objType !== 'XConnector') {
  //           this.activeSelectWithoutArrow.push(obj.id);
  //         }

  //         if (
  //           obj.objType === 'WBRectNotes' ||
  //           obj.objType === 'XCircleNotes'
  //         ) {
  //           obj.lastEditedBy = store.getState().user.userInfo.userId;
  //         }
  //       }
  //     }
  //     if (action === 'SCALED') {
  //       for (let i = 0; i < this.activeSelectWithoutArrow.length; i++) {
  //         const obj = canvas.findById(this.activeSelectWithoutArrow[i]);

  //         if (obj.objType === 'WBShapeNotes') {
  //           const state = obj.getModifiedObject([
  //             'width',
  //             'height',
  //             'left',
  //             'top',
  //             'shapeScaleX',
  //             'scaleX',
  //             'scaleY',
  //             'flipX',
  //             'flipY',
  //             'maxHeight',
  //             'fixedScaleChange',
  //           ]);

  //           newState = newState.concat(state);
  //         } else {
  //           const state = obj.getUndoRedoState(action, context);

  //           newState = newState.concat(state);
  //         }
  //       }
  //       // update arrow
  //       for (let i = 0; i < this.activeSelectionWithArrow.length; i++) {
  //         const obj = canvas.findById(this.activeSelectionWithArrow[i]);

  //         const state = obj.getUndoRedoState(action, context);

  //         newState = newState.concat(state);
  //       }

  //       canvas.pushNewState(newState);

  //       const objArras = [];

  //       let obj = null;

  //       for (let i = 0; i < this.activeSelectionWithArrow.length; i++) {
  //         obj = canvas.findById(this.activeSelectionWithArrow[i]);

  //         obj.resetStrokeAfterScaling();

  //         objArras.push(obj);
  //       }
  //       for (let i = 0; i < this.activeSelectWithoutArrow.length; i++) {
  //         obj = canvas.findById(this.activeSelectWithoutArrow[i]);
  //         objArras.push(obj);
  //       }
  //     } else if (action === 'MOVED') {
  //       for (let i = 0; i < this.activeSelectWithoutArrow.length; i++) {
  //         const obj = canvas.findById(this.activeSelectWithoutArrow[i]);
  //         const state = obj.getUndoRedoState(action, context);
  //         newState = newState.concat(state);
  //       }

  //       for (let i = 0; i < this.activeSelectionWithArrow.length; i++) {
  //         const obj = canvas.findById(this.activeSelectionWithArrow[i]);
  //         const state = obj.getUndoRedoState(action, context);
  //         newState = newState.concat(state);
  //       }

  //       canvas.pushNewState(newState);
  //     } else {
  //       for (let i = 0; i < this.idsInGroup.length; i++) {
  //         const obj = canvas.findById(this.idsInGroup[i]);
  //         const state = obj.getUndoRedoState(action, context);
  //         newState = newState.concat(state);
  //       }

  //       canvas.pushNewState(newState);
  //     }
  //   } else if (
  //     target.objType &&
  //     target.objType !== 'common' &&
  //     !target.isPanelTitle
  //   ) {
  //     if (
  //       target.objType === 'WBRectPanel' &&
  //       fields &&
  //       fields.length === 1 &&
  //       fields[0] === 'zIndex'
  //     ) {
  //       const frameSubs = target.subIdList();
  //       if (frameSubs < 1) {
  //         const newState = target.getUndoRedoState(action, context);
  //         canvas.pushNewState(newState);
  //       } else {
  //         let newState = [];
  //         const fmState = target.getUndoRedoState(action, context);
  //         newState = newState.concat(fmState);
  //         for (let i = 0; i < frameSubs.length; i++) {
  //           const obj = canvas.findById(frameSubs[i]);
  //           const state = obj.getUndoRedoState(action, context);
  //           newState = newState.concat(state);
  //         }
  //         canvas.pushNewState(newState);
  //       }
  //       // } else if (action === 'SCALED' && target.objType === 'WBShapeNotes') {
  //       //   // skip, already handled in other place
  //     } else {
  //       const newState = target.getUndoRedoState(action, context);
  //       canvas.pushNewState(newState);
  //     }

  //     if (
  //       target.objType === 'WBRectNotes' ||
  //       target.objType === 'XCircleNotes'
  //     ) {
  //       canvas.changeDefaulNote(target);
  //       target.styles = {};
  //     }
  //   }
  // }

  // initialize(options) {
  //   const self = this;
  //   this.guides = {};
  //   if (options) {
  //     this.setOptions(options);
  //   }
  //   self.on('mouseover', (e) => {
  //     if (
  //       store.getState().board.drawingEraseMode ||
  //       store.getState().mode.type !== 'default'
  //     ) {
  //       return;
  //     }
  //     if (
  //       store.getState().board.isPanMode ||
  //       e.e.which === 2 ||
  //       e.e.which === 3
  //     ) {
  //       self.hoverCursor = 'grab';
  //       self.dirty = true;
  //       canvas.requestRenderAll();
  //       return;
  //     }

  //     if (self.selectable === false) {
  //       if (store.getState().modal.interactionMode === 'mouse') {
  //         // if switch between mouse & trackpad mode,
  //         // user may need to refresh the page to have it functioning correctly
  //         if (store.getState().board.drawingEraseMode) {
  //           self.hoverCursor =
  //             "url(\"data:image/svg+xml,%3Csvg width='20' height='17' viewBox='0 0 20 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.9596 14.1754L17.6647 8.94993L15.4332 6.94073L10.6822 12.1248L12.9596 14.1754ZM13.9469 5.60242L11.9887 3.83931C9.52618 1.62201 5.73239 1.82083 3.51509 4.28339L2.82482 5.05001L9.19585 10.7865L13.9469 5.60242ZM11.6214 15.6617C12.4422 16.4008 13.7068 16.3345 14.4459 15.5137L19.151 10.2882C19.8901 9.46734 19.8238 8.20274 19.0029 7.46364L13.327 2.35302C10.0436 -0.603384 4.9852 -0.338289 2.0288 2.94513L1.33853 3.71175C0.59943 4.53261 0.665705 5.7972 1.48656 6.5363L11.6214 15.6617Z' fill='%23232930'/%3E%3C/svg%3E\") 0 0, auto";
  //         } else if (self.locked === true) {
  //           const isPan = store.getState().board.isPanMode;
  //           if (isPan) {
  //             self.hoverCursor = 'grab';
  //           } else {
  //             const cursorLock =
  //               "data:image/svg+xml,%3Csvg width='10' height='13' viewBox='0 0 10 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.832 0.755L5 0.75C5.70029 0.749965 6.37421 1.01709 6.8843 1.49689C7.39439 1.97669 7.70222 2.63302 7.745 3.332L7.75 3.5V4H8.5C8.89782 4 9.27936 4.15804 9.56066 4.43934C9.84196 4.72064 10 5.10218 10 5.5V11.5C10 11.8978 9.84196 12.2794 9.56066 12.5607C9.27936 12.842 8.89782 13 8.5 13H1.5C1.10218 13 0.720644 12.842 0.43934 12.5607C0.158035 12.2794 0 11.8978 0 11.5V5.5C0 5.10218 0.158035 4.72064 0.43934 4.43934C0.720644 4.15804 1.10218 4 1.5 4H2.25V3.5C2.24997 2.79971 2.51709 2.12579 2.99689 1.6157C3.47669 1.10561 4.13302 0.797781 4.832 0.755L5 0.75L4.832 0.755ZM5 7.5C4.73478 7.5 4.48043 7.60536 4.29289 7.79289C4.10536 7.98043 4 8.23478 4 8.5C4 8.76522 4.10536 9.01957 4.29289 9.20711C4.48043 9.39464 4.73478 9.5 5 9.5C5.26522 9.5 5.51957 9.39464 5.70711 9.20711C5.89464 9.01957 6 8.76522 6 8.5C6 8.23478 5.89464 7.98043 5.70711 7.79289C5.51957 7.60536 5.26522 7.5 5 7.5ZM5.128 2.256L5 2.25C4.69054 2.24986 4.39203 2.36451 4.16223 2.57177C3.93244 2.77903 3.78769 3.06417 3.756 3.372L3.75 3.5V4H6.25V3.5C6.25014 3.19054 6.13549 2.89203 5.92823 2.66223C5.72097 2.43244 5.43583 2.28769 5.128 2.256L5 2.25L5.128 2.256Z' fill='%23232930'/%3E%3C/svg%3E";
  //             self.hoverCursor = `url("${cursorLock}") 0 0, auto`;
  //           }
  //         } else {
  //           self.hoverCursor = 'default';
  //         }
  //       } else {
  //         self.hoverCursor = 'default';
  //       }
  //     } else if (self.objType === 'WBUrlImage') {
  //       self.hoverCursor = 'pointer';
  //     } else {
  //       self.hoverCursor = 'default';
  //     }
  //   });
  //   self.on('moving', (e) => {
  //     console.log(e);
  //   });
  // }

  // getCloneWidget() {
  //   const widget = _.clone(this.getObject());
  //   if (widget.connectorStart)
  //     widget.connectorStart = { id: this.connectorStart.id };
  //   if (widget.connectorEnd)
  //     widget.connectorEnd = { id: this.connectorEnd.id };
  //   delete widget.id;
  //   delete widget.emoji;
  //   widget.isPanel = null;
  //   if (this.getObject().lines) {
  //     widget.lines = this.getObject().lines;
  //   } else {
  //     widget.lines = null;
  //   }
  //   widget.panelObj = null;
  //   widget.relationship = null;
  //   widget.selectable = true;
  //   widget.userEmoji = null;
  //   widget.zIndex = Date.now() * 100;
  //   return widget;
  // }

  // bringObjToFront() {
  //   const obj = this;
  //   const intersectingObjects = canvas._getIntersectedObjects(obj);
  //   if (obj.panelObj) {
  //     /* overlap with frame */
  //     const parentPanel = intersectingObjects.filter(
  //       (o) => o.id === obj.panelObj
  //     )[0];
  //     if (parentPanel) {
  //       /* bring front on a frame is to the top on the frame */
  //       canvas.toFrameTop(parentPanel, obj);
  //     } else {
  //       const newIndex = canvas.createTopZIndex();
  //       obj.zIndex = newIndex;
  //       canvas.sortByZIndex();
  //       obj.saveData('MODIFIED', ['zIndex']);
  //       /* question: how about stick note with arrow,
  //     what happens when bring front the note: shall also update arrow zindex */
  //     }
  //   } else {
  //     const newIndex = canvas.createTopZIndex();
  //     obj.zIndex = newIndex;
  //     obj.dirty = true;
  //     canvas.sortByZIndex();
  //     obj.saveData('MODIFIED', ['zIndex']);
  //   }
  // }

  // sendObjToBack() {
  //   const obj = this;
  //   let newIndex;
  //   const intersectingObjects = canvas._getIntersectedObjects(obj);
  //   if (intersectingObjects.length === 1) {
  //     /* no overlap */
  //     const nexZIndex = canvas._objects[0].zIndex;
  //     newIndex = nexZIndex - 100;
  //     obj.zIndex = newIndex;
  //     canvas.sortByZIndex();
  //     obj.saveData('MODIFIED', ['zIndex']);
  //   } else if (obj.panelObj) {
  //     /* overlap with frame */
  //     const parentPanel = intersectingObjects.filter(
  //       (o) => o.id === obj.panelObj
  //     )[0];
  //     if (parentPanel) {
  //       /* send back on a frame is to the bottom on the frame */
  //       canvas.toFrameBottom(parentPanel, obj);
  //     }
  //   } else {
  //     /* with overlap, but not on a frame */
  //     const nexZIndex = canvas._objects[0].zIndex;
  //     newIndex = nexZIndex - 100;
  //     obj.zIndex = newIndex;
  //     obj.dirty = true;
  //     canvas.sortByZIndex();
  //     obj.saveData('MODIFIED', ['zIndex']);
  //   }
  // }

  // bringObjForward() {
  //   const obj = this;
  //   const intersectingObjects = canvas._getIntersectedObjects(obj);
  //   if (intersectingObjects.length > 1) {
  //     intersectingObjects.sort((a, b) => a.zIndex - b.zIndex);
  //     const index = intersectingObjects.indexOf(obj);
  //     if (index < intersectingObjects.length - 1) {
  //       if (obj.panelObj) {
  //         const parentPanel = intersectingObjects.filter(
  //           (o) => o.id === obj.panelObj
  //         )[0];
  //         if (parentPanel) {
  //           /* bring forward on a frame is to the bottom on the frame */
  //           canvas.onFrameForward(parentPanel, obj);
  //           /* question: onFrameForward only handling the frame's subOBj, what happens
  //           if need bring over an object not in the frame */
  //         }
  //       } else {
  //         const newIndex = canvas.createUniqueZIndex(
  //           intersectingObjects[index + 1].zIndex,
  //           true
  //         );
  //         obj.zIndex = newIndex;
  //         canvas.sortByZIndex();
  //         obj.dirty = true;
  //         obj.saveData('MODIFIED', ['zIndex']);
  //       }
  //     }
  //   }
  // }

  // sendObjBackwards() {
  //   const obj = this;
  //   const intersectingObjects = canvas._getIntersectedObjects(obj);
  //   intersectingObjects.sort((a, b) => a.zIndex - b.zIndex);
  //   const index = intersectingObjects.indexOf(obj);
  //   if (intersectingObjects.length > 1) {
  //     if (index > 0) {
  //       if (obj.panelObj) {
  //         const parentPanel = intersectingObjects.filter(
  //           (o) => o.id === obj.panelObj
  //         )[0];
  //         if (parentPanel) {
  //           /* send back on a frame is to the bottom on the frame */
  //           canvas.onFrameBackward(parentPanel, obj);
  //         }
  //       } else {
  //         const newIndex = canvas.createUniqueZIndex(
  //           intersectingObjects[index - 1].zIndex,
  //           false
  //         );
  //         obj.zIndex = newIndex;
  //         obj.dirty = true;
  //         canvas.sortByZIndex();
  //         obj.saveData('MODIFIED', ['zIndex']);
  //       }
  //     }
  //   }
  // }

  // reSetControl() {
  //   const obj = this;
  //   if (obj && obj.controls && obj.objType !== 'XConnector') {
  //     if (obj.controls.mlaStart) {
  //       obj.controls.mlaStart.offsetX = -20 * canvas.getZoom() * obj.scaleX;
  //       obj.controls.mraStart.offsetX = 20 * canvas.getZoom() * obj.scaleX;
  //       obj.controls.mtaStart.offsetY = -20 * canvas.getZoom() * obj.scaleY;
  //       obj.controls.mbaStart.offsetY = 20 * canvas.getZoom() * obj.scaleY;
  //     }
  //   }
  // }

  // drawBordersInGroup(ctx, options, styleOverride) {
  //   styleOverride = styleOverride || {};

  //   var bbox = fabric.util.sizeAfterTransform(this.width, this.height, options),
  //     strokeWidth = this.strokeWidth,
  //     strokeUniform = this.strokeUniform,
  //     borderScaleFactor = this.borderScaleFactor,
  //     width =
  //       bbox.x +
  //       strokeWidth * (strokeUniform ? this.canvas.getZoom() : options.scaleX) +
  //       borderScaleFactor,
  //     height =
  //       bbox.y +
  //       strokeWidth * (strokeUniform ? this.canvas.getZoom() : options.scaleY) +
  //       borderScaleFactor;
  //   ctx.save();
  //   this._setLineDash(
  //     ctx,
  //     styleOverride.borderDashArray || this.borderDashArray
  //   );
  //   let color = '#B3CDFD80';
  //   ctx.strokeStyle = color;
  //   ctx.strokeRect(-width / 2, -height / 2, width, height);
  //   ctx.restore();
  //   return this;
  // }

  // /**
  //  * Draws borders of an object's bounding box.
  //  * Requires public properties: width, height
  //  * Requires public options: padding, borderColor
  //  * @param {CanvasRenderingContext2D} ctx Context to draw on
  //  * @param {Object} styleOverride object to override the object style
  //  * @return {FabricObject} thisArg
  //  * @chainable
  //  */
  // drawBorders (ctx, styleOverride) {
  //   styleOverride = styleOverride || {};
  //   var wh = this._calculateCurrentDimensions(),
  //     strokeWidth = this.borderScaleFactor,
  //     width = wh.x + strokeWidth,
  //     height = wh.y + strokeWidth,
  //     hasControls =
  //       typeof styleOverride.hasControls !== 'undefined'
  //         ? styleOverride.hasControls
  //         : this.hasControls,
  //     shouldStroke = false;
  //   ctx.save();
  //   ctx.strokeStyle = styleOverride.borderColor || this.borderColor;
  //   this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray);
  //   ctx.strokeRect(-width / 2, -height / 2, width, height);
  //   if (hasControls) {
  //     ctx.beginPath();
  //     this.forEachControl(function (control, key, fabricObject) {
  //       if (control.actionName === 'rotate') return;
  //       // in this moment, the ctx is centered on the object.
  //       // width and height of the above function are the size of the bbox.
  //       if (control.withConnection && control.getVisibility(fabricObject, key)) {
  //         // reset movement for each control
  //         shouldStroke = true;
  //         ctx.moveTo(control.x * width, control.y * height);
  //         ctx.lineTo(
  //           control.x * width + control.offsetX,
  //           control.y * height + control.offsetY
  //         );
  //       }
  //     });
  //     if (shouldStroke) {
  //       ctx.stroke();
  //     }
  //   }
  //   ctx.restore();
  //   return this;
  // };
  // isActiveSelection() {
  //   const obj = this;

  //   if (
  //     obj.objType === 'WBGroup' &&
  //     obj._objects &&
  //     obj._objects.length > 0 &&
  //     !obj.id
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  // isGroup() {
  //   const obj = this;

  //   if (
  //     obj.objType === 'WBGroup' &&
  //     obj._objects &&
  //     obj._objects.length > 0 &&
  //     obj.id
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
