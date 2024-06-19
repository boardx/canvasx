//@ts-nocheck
import { Point } from '../../Point';
import { EventNames } from './EventNames';

//**import Services */

export class alignmentGuideLines {
  canvas: any = null;
  ctx: any = null;
  aligningLineOffset: number = 0;
  masterMargin: number = 4;
  margin: number = 4;
  aligningLineWidth: number = 1;
  aligningLineColor: any = '#3FB2FF';
  viewportTransform: any = null;
  zoom: number = 1;
  verticalLines: any = [];
  horizontalLines: any = [];
  isScaling: any = null;
  mouseDownPoint: any = null;
  activeObject: any = null;
  offsetX: number = 30;
  offsetY: number = 30;
  padding: number = 0;
  candidateObjects: any = [];
  hCandidateObjects: any = [];
  vCandidateObjects: any = [];
  horizontalInTheRange: boolean = false;
  verticalInTheRange: boolean = false;
  scalePoint: any = null;
  debug: boolean = false;
  mouseMovePoint: any = null;
  timoutHandler: any;

  constructor(canvas: any) {
    this.canvas = canvas;
    this.ctx = this.canvas.getSelectionContext();
  }

  onObjectMoving(e: any) {
    this.isScaling = false;
    this.moveHandler(e);
  }

  onObjectScaling(e: any) {
    this.isScaling = true;
    this.scaleHandler(e);
  }

  //todo: clear context caused the bug that the selection blue rect stop showing, there should be better way to clear the context
  //as it clear verything including the selection rect
  onBeforeRender() {
    this.canvas.clearContext(this.ctx);
    this.canvas.renderTopLayer(this.ctx);
  }

  onAfterRender() {
    if (this.activeObject) {
      this.ctx.font = '10px Arial';
      if (this.isScaling && this.debug) {
        const x = this.scalePoint.x * this.zoom + this.viewportTransform[4];
        const y = this.scalePoint.y * this.zoom + this.viewportTransform[5];
        this.ctx.fillText(
          JSON.stringify(this.scalePoint) + JSON.stringify(this.activeObject),
          x,
          y
        );
        if (this.canvas.getActiveObject().parent)
          this.ctx.fillText(JSON.stringify(this.activeObject), x, y + 20);
      }
      if (this.debug) {
        const x =
          this.activeObject.getCenterPoint().x * this.zoom +
          this.viewportTransform[4];
        const y =
          this.activeObject.getCenterPoint().y * this.zoom +
          this.viewportTransform[5];
        this.ctx.fillText(
          JSON.stringify(this.activeObject.getCenterPoint()),
          x,
          y
        );
      }
    }

    if (this.verticalLines)
      this.verticalLines.forEach((vline: any) => {
        this.drawVerticalLine(vline);
      });
    if (this.horizontalLines)
      this.horizontalLines.forEach((hline: any) => {
        this.drawHorizontalLine(hline);
      });
  }

  onMouseUpRenderCanvas() {
    this.verticalLines.length = this.horizontalLines.length = 0;
    if (this.activeObject && !this.activeObject.isEditing)
      this.activeObject.hasControls = true;

    this.canvas.requestRenderAll();
  }

  onMouseDown({ pointer }: { pointer: any }) {
    this.mouseDownPoint = { ...pointer };
    this.zoom = this.canvas.getZoom();
    this.viewportTransform = this.canvas.viewportTransform;
  }

  initializeEvents() {
    // const esi = EventService.getInstance();
    this.canvas.off(EventNames.OBJECT_MOVING, this.onObjectMoving.bind(this));
    this.canvas.off(EventNames.OBJECT_SCALING, this.onObjectScaling.bind(this));
    this.canvas.off(EventNames.BEFORE_RENDER, this.onBeforeRender.bind(this));
    this.canvas.off(EventNames.AFTER_RENDER, this.onAfterRender.bind(this));
    this.canvas.off('mouse:up', this.onMouseUpRenderCanvas.bind(this));
    this.canvas.off('mouse:down', this.onMouseDown.bind(this));

    // const esi = EventService.getInstance();
    this.canvas.on(EventNames.OBJECT_MOVING, this.onObjectMoving.bind(this));
    this.canvas.on(EventNames.OBJECT_SCALING, this.onObjectScaling.bind(this));
    this.canvas.on(EventNames.BEFORE_RENDER, this.onBeforeRender.bind(this));
    this.canvas.on(EventNames.AFTER_RENDER, this.onAfterRender.bind(this));
    this.canvas.on('mouse:up', this.onMouseUpRenderCanvas.bind(this));

    this.canvas.on('mouse:down', this.onMouseDown.bind(this));
  }

  snapLine(aLine: any) {
    this.activeObject.setPositionByOrigin(
      new Point(aLine.x, aLine.y),
      aLine.xalign,
      aLine.yalign
    );
  }

  drawVerticalLine(coords: { x: any; y1: any; y2: any; type: string }) {
    let padding: number = 0;
    if (coords.type.substring(2, 3) === 'l') padding = -this.padding;
    if (coords.type.substring(2, 3) === 'c') padding = 0;
    if (coords.type.substring(2, 3) === 'r') padding = this.padding;
    let x1 = coords.x! + this.padding,
      y1 = coords.y1! > coords.y2! ? coords.y2! : coords.y1!,
      x2 = coords.x! + this.padding,
      y2 = coords.y2! > coords.y1! ? coords.y2! : coords.y1!;
    this.zoom = this.canvas.getZoom();
    this.viewportTransform = this.canvas.viewportTransform;
    if (this.viewportTransform) {
      x1 = x1 * this.zoom + this.viewportTransform[4];
      y1 =
        y1 * this.zoom + this.viewportTransform[5] - this.offsetY * this.zoom;
      x2 = x2 * this.zoom + this.viewportTransform[4];
      y2 =
        y2 * this.zoom + this.viewportTransform[5] + this.offsetY * this.zoom;
      const lineColorMap: any = { l: 'red', c: 'yellow', r: 'green' };
      const lineColor = lineColorMap[coords.type.substring(1, 2)];
      this.drawLine(x1, y1, x2, y2, lineColor);
    }
  }

  drawHorizontalLine(coords: { x1: any; x2: any; y: any; type: string }) {
    let padding: number = 0;
    if (coords.type.substring(2, 3) === 't') padding = -this.padding;
    if (coords.type.substring(2, 3) === 'c') padding = 0;
    if (coords.type.substring(2, 3) === 'b') padding = this.padding;
    let x1 = coords.x1! > coords.x2! ? coords.x2! : coords.x1!,
      y1 = coords.y! + padding,
      x2 = coords.x2! > coords.x1! ? coords.x2! : coords.x1!,
      y2 = coords.y! + padding;
    this.zoom = this.canvas.getZoom();
    //let offset = this.canvas.getPositionOnCanvas(0, 0);
    this.viewportTransform = this.canvas.viewportTransform;
    if (this.viewportTransform) {
      x1 =
        x1 * this.zoom + this.viewportTransform[4] - this.offsetX * this.zoom;
      y1 = y1 * this.zoom + this.viewportTransform[5];
      x2 =
        x2 * this.zoom + this.viewportTransform[4] + this.offsetX * this.zoom;
      y2 = y2 * this.zoom + this.viewportTransform[5];
      const lineColorMap: any = { t: 'red', c: 'yellow', b: 'green' };
      const lineColor = lineColorMap[coords.type.substring(1, 2)];
      this.drawLine(x1, y1, x2, y2, lineColor);
    }
  }

  drawLine(x1: any, y1: any, x2: any, y2: any, lineColor: any) {
    this.ctx.save();
    this.ctx.lineWidth = this.aligningLineWidth;
    this.ctx.strokeStyle = this.aligningLineColor;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  isInRange(value1: number, value2: number) {
    return Math.abs(value1 - value2) <= this.margin * this.zoom;
  }

  skipActiveObject() {
    this.viewportTransform = this.canvas.viewportTransform;
    if (
      !this.activeObject ||
      !this.viewportTransform ||
      this.activeObject.objType === 'WBRectPanel' ||
      this.activeObject.objType === 'common' ||
      this.activeObject.angle !== 0 ||
      this.activeObject.isPanelTitle
    )
      return true;
    else return false;
  }

  skipCandidateObject(currentObject: any) {
    if (
      !currentObject ||
      !currentObject.visible ||
      currentObject.objType === 'WBLine' ||
      currentObject.objType === 'XConnector' ||
      currentObject.objType === 'common' ||
      currentObject.group ||
      currentObject === this.activeObject ||
      currentObject.id === this.activeObject.id ||
      !currentObject.isOnScreen()
    ) {
      return true;
    }
    return false;
  }

  findCandidateObjects() {
    this.zoom = this.canvas.getZoom();
    this.margin = this.masterMargin / this.zoom;
    var canvasObjects = this.canvas.getObjects();
    this.candidateObjects = [];
    for (let i = canvasObjects.length; i--; ) {
      const candidateObject = canvasObjects[i];
      if (this.skipCandidateObject(candidateObject)) continue;
      this.candidateObjects.push(candidateObject);
    }

    const leftBoundary = this.activeObject.left - this.margin * this.zoom * 2,
      rightBoundary =
        this.activeObject.left +
        this.activeObject.width +
        this.margin * this.zoom * 2,
      topBoundary = this.activeObject.top - this.margin * this.zoom * 2,
      bottomBoundary =
        this.activeObject.top +
        this.activeObject.height +
        this.margin * this.zoom * 2;

    this.hCandidateObjects = this.candidateObjects;
    this.vCandidateObjects = this.candidateObjects;
  }

  findUniqueGuideLines() {
    const compareABS = (property: any) => (a: any, b: any) =>
      Math.abs(a[property]) - Math.abs(b[property]);
    const vLineIDs = ['vl', 'vc', 'vr', 'vs'];
    const newVLines: any[] = [];
    vLineIDs.map((id: string) => {
      let Lines = this.verticalLines.filter(
        (l: any) => l.type.substring(0, 2) === id
      );
      if (Lines.length > 0) {
        const l = Lines.sort(compareABS('distance'))[0];
        newVLines.push(l);
      }
    });
    const hLineIDs = ['ht', 'hc', 'hb', 'hs'];
    const newHLines: any[] = [];
    hLineIDs.map((id: string) => {
      let Lines = this.horizontalLines.filter(
        (l: any) => l.type.substring(0, 2) === id
      );
      if (Lines.length > 0) {
        const l = Lines.sort(compareABS('distance'))[0];
        newHLines.push(l);
      }
    });

    this.verticalLines = newVLines;
    this.horizontalLines = newHLines;
  }

  snap() {
    this.verticalLines.forEach((l: any) => {
      this.snapLine(l);
    });
    this.horizontalLines.forEach((l: any) => {
      this.snapLine(l);
    });
  }

  scaleSnap() {
    //to be done later
  }

  findGuideLines() {
    this.verticalLines = [];
    this.horizontalLines = [];
    this.horizontalInTheRange = false;
    this.verticalInTheRange = false;

    for (let i = this.vCandidateObjects.length; i--; ) {
      let cObject = this.vCandidateObjects[i];

      const aOKeyPoints = [
        {
          yt: this.activeObject.aCoords.tl.y,
          yb: this.activeObject.aCoords.bl.y,
          yc: this.activeObject.getCenterPoint().y,
          x: this.activeObject.getCenterPoint().x,
          type: 'center',
        },
        {
          yt: this.activeObject.aCoords.tl.y,
          yb: this.activeObject.aCoords.bl.y,
          yc: this.activeObject.getCenterPoint().y,
          x: this.activeObject.aCoords.tl.x,
          type: 'left',
        },
        {
          yt: this.activeObject.aCoords.tl.y,
          yb: this.activeObject.aCoords.bl.y,
          yc: this.activeObject.getCenterPoint().y,
          x: this.activeObject.aCoords.tr.x,
          type: 'right',
        },
      ];
      const cOKeyPoints = [
        {
          yt: cObject.aCoords.tl.y,
          yb: cObject.aCoords.bl.y,
          yc: cObject.getCenterPoint().y,
          x: cObject.getCenterPoint().x,
          type: 'center',
        },
        {
          yt: cObject.aCoords.tl.y,
          yb: cObject.aCoords.bl.y,
          yc: cObject.getCenterPoint().y,
          x: cObject.aCoords.tl.x,
          type: 'left',
        },
        {
          yt: cObject.aCoords.tl.y,
          yb: cObject.aCoords.bl.y,
          yc: cObject.getCenterPoint().y,
          x: cObject.aCoords.tr.x,
          type: 'right',
        },
      ];
      for (let p1 in aOKeyPoints)
        for (let p2 in cOKeyPoints) {
          this.findVerticalLine(aOKeyPoints[p1], cOKeyPoints[p2], cObject);
        }
    }

    for (let i = this.hCandidateObjects.length; i--; ) {
      let cObject = this.hCandidateObjects[i];
      const aOKeyPoints = [
        {
          xl: this.activeObject.aCoords.tl.x,
          xr: this.activeObject.aCoords.tr.x,
          xc: this.activeObject.getCenterPoint().x,
          y: this.activeObject.getCenterPoint().y,
          type: 'center',
        },
        {
          xl: this.activeObject.aCoords.tl.x,
          xr: this.activeObject.aCoords.tr.x,
          xc: this.activeObject.getCenterPoint().x,
          y: this.activeObject.aCoords.tl.y,
          type: 'top',
        },
        {
          xl: this.activeObject.aCoords.tl.x,
          xr: this.activeObject.aCoords.tr.x,
          xc: this.activeObject.getCenterPoint().x,
          y: this.activeObject.aCoords.bl.y,
          type: 'bottom',
        },
      ];
      const cOKeyPoints = [
        {
          xl: cObject.aCoords.tl.x,
          xr: cObject.aCoords.tr.x,
          xc: cObject.getCenterPoint().x,
          y: cObject.getCenterPoint().y,
          type: 'center',
        },
        {
          xl: cObject.aCoords.tl.x,
          xr: cObject.aCoords.tr.x,
          xc: cObject.getCenterPoint().x,
          y: cObject.aCoords.tl.y,
          type: 'top',
        },
        {
          xl: cObject.aCoords.tl.x,
          xr: cObject.aCoords.tr.x,
          xc: cObject.getCenterPoint().x,
          y: cObject.aCoords.bl.y,
          type: 'bottom',
        },
      ];

      for (let p1 in aOKeyPoints)
        for (let p2 in cOKeyPoints) {
          this.findHorizontalLine(aOKeyPoints[p1], cOKeyPoints[p2], cObject);
        }
    }
    if (!this.horizontalInTheRange) {
      this.horizontalLines.length = 0;
    }
    if (!this.verticalInTheRange) {
      this.verticalLines.length = 0;
    }
  }

  findScaleGuideLines(e: any) {
    this.verticalLines = [];
    this.horizontalLines = [];
    this.horizontalInTheRange = false;
    this.verticalInTheRange = false;

    // Which point must be crossed
    switch (e.transform.corner) {
      case 'bl':
        this.scalePoint = {
          x: this.activeObject.aCoords.bl.x,
          y: this.activeObject.aCoords.bl.y,
        };
        break;
      case 'br':
        this.scalePoint = {
          x: this.activeObject.aCoords.br.x,
          y: this.activeObject.aCoords.br.y,
        };
        break;
      case 'tl':
        this.scalePoint = {
          x: this.activeObject.aCoords.tl.x,
          y: this.activeObject.aCoords.tl.y,
        };
        break;
      case 'tr':
        this.scalePoint = {
          x: this.activeObject.aCoords.tr.x,
          y: this.activeObject.aCoords.tr.y,
        };
        break;
    }

    for (let i = this.vCandidateObjects.length; i--; ) {
      let cObject = this.vCandidateObjects[i];
      const aOKeyPoints = [
        {
          yt: this.activeObject.aCoords.tl.y,
          yb: this.activeObject.aCoords.bl.y,
          yc: this.activeObject.getCenterPoint().y,
          x: this.scalePoint?.x,
          type: 'scale',
        },
      ];
      const cOKeyPoints = [
        {
          yt: cObject.aCoords.tl.y,
          yb: cObject.aCoords.bl.y,
          yc: cObject.getCenterPoint().y,
          x: cObject.aCoords.tl.x,
          type: 'left',
        },
        {
          yt: cObject.aCoords.tl.y,
          yb: cObject.aCoords.bl.y,
          yc: cObject.getCenterPoint().y,
          x: cObject.aCoords.tr.x,
          type: 'right',
        },
        {
          yt: cObject.aCoords.tl.y,
          yb: cObject.aCoords.bl.y,
          yc: cObject.getCenterPoint().y,
          x: cObject.getCenterPoint().x,
          type: 'center',
        },
      ];
      for (let p1 in aOKeyPoints)
        for (let p2 in cOKeyPoints) {
          this.findVerticalLine(aOKeyPoints[p1], cOKeyPoints[p2], cObject);
        }
    }

    for (let i = this.hCandidateObjects.length; i--; ) {
      let cObject = this.hCandidateObjects[i];
      const aOKeyPoints = [
        {
          xl: this.activeObject.aCoords.tl.x,
          xr: this.activeObject.aCoords.tr.x,
          xc: this.activeObject.getCenterPoint().x,
          y: this.scalePoint?.y,
          type: 'scale',
        },
      ];
      const cOKeyPoints = [
        {
          xl: cObject.aCoords.tl.x,
          xr: cObject.aCoords.tr.x,
          xc: cObject.getCenterPoint().x,
          y: cObject.aCoords.tl.y,
          type: 'top',
        },
        {
          xl: cObject.aCoords.tl.x,
          xr: cObject.aCoords.tr.x,
          xc: cObject.getCenterPoint().x,
          y: cObject.aCoords.bl.y,
          type: 'bottom',
        },
        {
          xl: cObject.aCoords.tl.x,
          xr: cObject.aCoords.tr.x,
          xc: cObject.getCenterPoint().x,
          y: cObject.getCenterPoint().y,
          type: 'center',
        },
      ];

      for (let p1 in aOKeyPoints)
        for (let p2 in cOKeyPoints) {
          this.findHorizontalLine(aOKeyPoints[p1], cOKeyPoints[p2], cObject);
        }
    }
    if (!this.horizontalInTheRange) {
      this.horizontalLines.length = 0;
    }
    if (!this.verticalInTheRange) {
      this.verticalLines.length = 0;
    }
  }

  findHorizontalLine(aO: any, cO: any, cObj: any) {
    if (this.isInRange(aO.y, cO.y)) {
      this.horizontalInTheRange = true;
      const aLine = {
        y: cO.y,
        x1: cO.xl < aO.xl ? cO.xl : aO.xl,
        x2: cO.xr < aO.xr ? aO.xr : cO.xr,
        x: aO.xc,
        xalign: 'center',
        yalign: aO.type,
        type: 'h' + aO.type.substring(0, 1) + cO.type.substring(0, 1),
        difference: cO.y - aO.y,
        distance: cO.xc - aO.xc,
        obj: cObj,
      };
      const el = this.horizontalLines.find((l: any) => {
        l.type.substring(0, 2) === aLine.type.substring(0, 2);
      });
      if (!el) {
        this.horizontalLines.push(aLine);
      } else if (Math.abs(el.distance) > Math.abs(aLine.distance)) {
        this.horizontalLines = this.horizontalLines.filter(function (l: any) {
          return l.type.substring(0, 2) !== aLine.type.substring(0, 2);
        });
        this.horizontalLines.push(aLine);
      } else if (
        Math.abs(el.distance) === Math.abs(aLine.distance) &&
        Math.abs(el.difference) >= Math.abs(aLine.difference)
      ) {
        this.horizontalLines = this.horizontalLines.filter(function (l: any) {
          return l.type.substring(0, 2) !== aLine.type.substring(0, 2);
        });
        this.horizontalLines.push(aLine);
      }
    }
  }

  findVerticalLine(aO: any, cO: any, cObj: any) {
    if (this.isInRange(aO.x, cO.x)) {
      this.verticalInTheRange = true;
      const aLine = {
        x: cO.x,
        y1: cO.yt < aO.yt ? cO.yt : aO.yt,
        y2: cO.yb < aO.yb ? aO.yb : cO.yb,
        y: aO.yc,
        xalign: aO.type,
        yalign: 'center',
        type: 'v' + aO.type.substring(0, 1) + cO.type.substring(0, 1),
        difference: cO.x - aO.x,
        distance: cO.yc - aO.yc,
        obj: cObj,
      };

      const el = this.verticalLines.find((l: any) => {
        l.type.substring(0, 2) === aLine.type.substring(0, 2);
      });
      if (!el) {
        this.verticalLines.push(aLine);
      } else if (
        Math.abs(el.distance) > Math.abs(aLine.distance) ||
        (Math.abs(el.distance) === Math.abs(aLine.distance) &&
          Math.abs(el.difference) >= Math.abs(aLine.difference))
      ) {
        this.verticalLines = this.verticalLines.filter(function (l: any) {
          return l.type.substring(0, 2) !== aLine.type.substring(0, 2);
        });
        this.verticalLines.push(aLine);
      }
    }
  }

  scaleHandler(e: any) {
    this.activeObject = e.target;
    //this.activeObject.dirty = true;
    //this.canvas.requestRenderAll();
    if (this.skipActiveObject()) return;
    this.activeObject.setCoords();
    //let offset = this.canvas.getPositionOnCanvas(0, 0);
    this.findCandidateObjects();
    this.findScaleGuideLines(e);
    this.findUniqueGuideLines();
    //this.scaleSnap();
  }

  moveHandler(e: any) {
    this.activeObject = e.target;
    if (this.skipActiveObject()) return;
    //this.activeObject.dirty = true;
    //this.canvas.requestRenderAll();
    //let offset = this.canvas.getPositionOnCanvas(0, 0);
    this.activeObject.hasControls = false;
    this.activeObject.setCoords();
    this.findCandidateObjects();
    this.findGuideLines();
    this.findUniqueGuideLines();
    this.snap();
  }
}
