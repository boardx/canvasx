//**Redux Store */
import store from "../redux/store";
import {
    handleSetIsPanMode,
    handleSetConnectorMode,
    handleSetArrowMode,
    handleSetDrawToCreateWidget,
} from "../redux/features/board.slice";
import { UtilityService } from "./";

export default class DrawingService {
  public _iconId: any;
  public height: any;
  static service: DrawingService;

  static getInstance(): DrawingService {
    if (DrawingService.service == null) {
      DrawingService.service = new DrawingService();
    }
    return DrawingService.service;
  }

  constructor() {
    this._iconId = null;
  }

  getIconId() {
    return this._iconId;
  }

  setIconId(iconId: any) {
    this._iconId = iconId;
  }

  widgetTypeToDraw = null;

  getReadyToDrawShape(iconId: any, canvas: any) {
    store.dispatch(handleSetIsPanMode(false));
    canvas.discardActiveObject();
    canvas.setCursor("crosshair");
    this.setIconId(iconId);
    canvas.requestRenderAll();
    store.dispatch(handleSetDrawToCreateWidget("XShapeNotes"));
    store.dispatch(handleSetArrowMode(false));
    store.dispatch(handleSetConnectorMode(false));
  }

  getReadyToDrawWidget(cursor: any, widgetType: any, canvas: any) {
    this.getReadyToDraw(cursor, widgetType, canvas);
  }

  getReadyToDraw(cursor: any, widgetType: any, canvas: any) {
    store.dispatch(handleSetIsPanMode(false));
    canvas.setCursor(cursor);
    canvas.hoverCursor = cursor;
    canvas.defaultCursor = cursor;
    store.dispatch(handleSetDrawToCreateWidget(widgetType));
  }

  async drawToCreateWidget(tl: any, br: any, canvas: any) {
    /*
     * four cases, to change the tl and br
     * 1: move mouse ↘
     *      do nothing
     * 2. move mouse ↖
     *      switch tl and br
     * 3. move mouse ↙
     *      tl = {br.x, tl.y}, br = {tl.x, br.y}
     * 4. move mouse ↗
     *      tl = {tl.x, br.y}, br = {br.x, tl.y}
     */
    if (tl.x < br.x && tl.y < br.y) {
    } else if (tl.x > br.x && tl.y > br.y) {
      const temp = tl;
      tl = br;
      br = temp;
    } else if (tl.x > br.x && tl.y <= br.y) {
      const tlx = tl.x;
      const tly = tl.y;
      const brx = br.x;
      const bry = br.y;
      let x = brx;
      let y = tly;
      const new_tl = { x, y };
      tl = new_tl;
      (x = tlx), (y = bry);
      const new_br = { x, y };
      br = new_br;
    } else if (tl.x <= br.x && tl.y > br.y) {
      const tlx = tl.x;
      const tly = tl.y;
      const brx = br.x;
      const bry = br.y;
      let x = tlx;
      let y = bry;
      const new_tl = { x, y };
      tl = new_tl;
      (x = brx), (y = tly);
      const new_br = { x, y };
      br = new_br;
    }

    const left = tl.x;
    const top = tl.y;

    let width = br.x - tl.x;
    let height = br.y - tl.y;

    if (width === 0) width = 1;
    if (height === 0) height = 1;

    if (!canvas.drawTempWidget) {
      const widget: any = {
        angle: 0,
        width,
        height,
        scaleX: 1,
        scaleY: 1,
        left,
        top,
        locked: false,
        selectable: true,
        fill: null,
        stroke: "#555555",
        strokeWidth: 4,
        objType: store.getState().board.drawToCreateWidget,
        userid: store.getState().user.userInfo.userId,
        whiteboardId: store.getState().board.board.id,
        timestamp: Date.now(),
        zIndex: Date.now() * 100,
        isPanel: false,
        lockMovementX: false,
        lockMovementY: false,
        icon: this.getIconId(),
        text: "",
      };
      if (widget.objType === "WBCircle") {
        widget.radius = 1;
      }

      if (widget.objType === "WBRectPanel") {
        const text = this.getPanelText(canvas);
        widget.text = text;
        widget.stroke = "#555555";
        widget.fill = "white";
        widget.strokeWidth = 0.2;
        widget.isPanel = true;
      }

      if (widget.objType === "XTextbox") {
        widget.text = "Type here...";
        widget.fontFamily = "Inter";
        widget.fontSize = 20;
        widget.strokeWidth = 0;
      }

      if (widget.objType === "XText") {
        widget.text = "Type here...";
        widget.fontFamily = "Inter";
        widget.fontSize = 20;
        widget.strokeWidth = 0;
      }

      if (widget.objType === "XShapeNotes") {
        widget.fontFamily = "Inter";
        widget.stroke = "#555555";
        widget.fill = "#555555";
        widget.maxHeight = this.height;
        widget.strokeWidth = 0.2;
        widget.fixedStrokeWidth = 1;
        widget.textAlign = "center";
        widget.backgroundColor = "rgba(255, 255, 255, 1)";
        widget.fontSize = 26;
        widget.text = "";
        widget.lineWidth = 2;
        widget.fixedLineWidth = 2;
        widget.isPanel = false;
        widget.maxHeight = 138;
        widget.verticalAlign = "middle";
      }

      widget.id = UtilityService.getInstance().generateWidgetID();
      const newObject = await canvas.createWidgetAsync(widget);
      canvas.drawTempWidget = newObject;
      canvas.add(newObject).requestRenderAll();
    } else {
      const widget: any = {
        angle: 0,
        width: Math.abs(width),
        height: Math.abs(height),
        scaleX: 1,
        scaleY: 1,
        left: left + Math.abs(width / 2),
        top: top + Math.abs(height / 2),
        selectable: true,
        fill: null,
        stroke: "#555555",
        strokeWidth: 4,
        objType: store.getState().board.drawToCreateWidget,
        userid: store.getState().user.userInfo.userId,
        whiteboardId: store.getState().board.board.id,
        timestamp: Date.now(),
        zIndex: Date.now() * 100,
        locked: false,
        lockMovementX: false,
        lockMovementY: false,
        icon: this.getIconId(),
      };
      if (widget.objType !== "WBRectPanel") {
        widget.text = "";
      }

      if (widget.objType === "WBCircle") {
        widget.radius = Math.abs(width / 2);
      }

      if (widget.objType === "XTextbox") {
        widget.fill = "#555555";
        widget.text = "Type here...";
        widget.fontSize = 20;
        widget.strokeWidth = 0;
      }

      if (widget.objType === "XText") {
        widget.fill = "#555555";
        widget.text = "Type here...";
        widget.fontSize = 20;
        widget.strokeWidth = 0;
      }

      if (widget.objType === "WBRectPanel") {
        widget.stroke = null;
        widget.fill = "white";
        widget.strokeWidth = null;
        widget.isPanel = true;
        widget.hasBorders = false;
      }

      /**
       * add placehold to XTextbox
       */
      if (widget.objType === "XTextbox" && widget.text === "Type here...") {
        widget.fill = "rgba(0, 0, 0, 0.48)";
        widget.dirty = true;
      }

      if (widget.objType === "XText" && widget.text === "Type here...") {
        widget.fill = "rgba(0, 0, 0, 0.48)";
        widget.dirty = true;
      }

      if (widget.objType === "XShapeNotes") {
        widget.strokeWidth = 0;
        widget.fill = "#555555";
        widget.stroke = "#555555";
        widget.backgroundColor = "rgba(255, 255, 255, 1)";
        widget.maxHeight = height;
        widget.height = height;
        widget.fixedLineWidth = 2;
        widget.lineWidth = 2;
        widget.strokeWidth = 0.2;
        if (widget.icon === 5) widget.verticalAlign = "bottom";
      }
      widget.lockMovementX = false;
      widget.lockMovementY = false;
      widget.selectable = true;
      widget.locked = false;
      canvas.drawTempWidget.set(widget);
      canvas.setActiveObject(canvas.drawTempWidget);
      if (widget.objType === "XTextbox") {
        canvas.drawTempWidget.initDimensions();
        canvas.drawTempWidget.dirty = true;
      }
      if (widget.objType === "XText") {
        canvas.drawTempWidget.initDimensions();
        canvas.drawTempWidget.dirty = true;
      }
      if (widget.objType === "WBRectPanel") {
        canvas.drawTempWidget.titlebox.text = canvas.drawTempWidget.text || "";
        canvas.drawTempWidget.setTitleboxText();
      }
      canvas.requestRenderAll();
    }
  }

  getPanelText(canvas: any) {
    let number = 1;
    canvas.getObjects().forEach((o: any) => {
      if (
        o.objType === "WBRectPanel" &&
        o.text &&
        o.text.indexOf("Frame") == 0
      ) {
        let numbertemp = Number(o.text.replace("Frame", ""));
        if (!isNaN(numbertemp)) {
          numbertemp += 1;
          if (numbertemp > number) {
            number = numbertemp;
          }
        }
      }
    });
    return `Frame${number}`;
  }

  drawXText(canvas: any, options?: any) {
    canvas.hoverCursor = "default";
    canvas.defaultCursor = "default";
    canvas.createWidgetatCurrentLocationByType("XText", {
      position: {
        left: options.x,
        top: options.y,
      },
    });
  }

  drawXRectNotes(canvas: any) {
    canvas.hoverCursor = "default";
    canvas.defaultCursor = "default";
    canvas.createWidgetatCurrentLocationByType("XRectNotes");
  }
}
