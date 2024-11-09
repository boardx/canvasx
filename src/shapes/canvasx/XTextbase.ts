import { TClassProperties, TOriginX, TOriginY } from '../../typedefs';
import { IText } from '../IText/IText';
import { classRegistry } from '../../ClassRegistry';
import { createTextboxDefaultControls } from '../../controls/X_commonControls';
import { EventName, Origin } from './types';
import { Textbox } from '../Textbox';

import { WidgetType } from './type/widget.type';
import { WidgetTextboxInterface, EntityKeys } from './type/widget.entity.textbox';


import { Point } from '../../Point';
import { XConnector } from './XConnector';
import { FabricObject } from '../Object/Object';


// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const textboxDefaultValues: Partial<TClassProperties<XTextbase>> = {
  minWidth: 20,
  dynamicMinWidth: 2,
  // _wordJoiners: /[ \t\r]/,
  splitByGrapheme: false,
  cornerColor: 'white',
  cornerSize: 10,
  cornerStyle: 'circle',
  transparentCorners: false,
  cornerStrokeColor: 'gray',
  connectors: [],
};

class Connector {
  connectorId: string;
  connectorType: string;
  point: Point;
}

export const XTextbaseProps: Partial<TClassProperties<XTextbase>> = {};

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export class XTextbase
  extends Textbox
  implements WidgetTextboxInterface {
  static type: WidgetType = 'XTextbase';
  static objType: WidgetType = 'XTextbase';
  /**
   * Minimum width of textbox, in pixels.
   * @type Number
   * @default
   */
  declare minWidth: number;

  declare tempTop: number;

  declare hasNoText: boolean;

  /**
   * Minimum calculated width of a textbox, in pixels.
   * fixed to 2 so that an empty textbox cannot go to 0
   * and is still selectable without text.
   * @type Number
   * @default
   */
  declare dynamicMinWidth: number;

  declare oneLine: boolean;

  declare fromCopy: boolean;
  declare originX: TOriginX;
  declare originY: TOriginY;
  declare connectors: Connector[];
  /**
   * Use this boolean property in order to split strings that have no white space concept.
   * this is a cheap way to help with chinese/japanese
   * @type Boolean
   * @since 2.6.0
   */
  declare splitByGrapheme: boolean;

  static textLayoutProperties = [...IText.textLayoutProperties, 'width'];

  static ownDefaults: Record<string, any> = textboxDefaultValues;



  static getDefaults() {
    return {
      ...super.getDefaults(),
      controls: createTextboxDefaultControls(),
      ...XTextbase.ownDefaults,
    };
  }



  constructor(text: string, options: any) {

    options.oneLine = options.oneLine || true;
    options.connectors = options.connectors || [];
    options.originX = options.originX || 'center';
    options.originY = options.originY || 'center';
    options.minWidth = options.minWidth || 20;
    options.dynamicMinWidth = options.dynamicMinWidth || 2;
    options.splitByGrapheme = options.splitByGrapheme || false;
    options.fixedScaleChange = options.fixedScaleChange || false;
    options.boardId = options.boardId || '';

    options.userId = options.userId || '';
    options.zIndex = options.zIndex || 0;
    options.version = options.version || '';
    options.updatedAt = options.updatedAt || Date.now();
    options.lastEditedByName = options.lastEditedByName || '';
    options.createdByName = options.createdByName || '';
    options.objType = 'XTextbase';


    super(text, options);
    this.initializeEvent();
    delete options.height;
    Object.assign(this, options);


    // this.resetResizeControls();
  }
  updatedBy: string;
  updatedByName: string;

  createdByName: string;
  maxHeight: number;
  fixedScaleChange: boolean;
  boardId: string;
  objType: WidgetType;
  userId: string;
  zIndex: number;
  version: string;
  updatedAt: number;

  createdAt: number;
  createdBy: string;
  /* boardx extend function */

  updateConnector(point: any, connector: XConnector, type: string) {
    const controlPoint = this.calculateControlPoint(
      new Point(point.x, point.y)
    );

    //recalculate the startpoint or endpoint of the connector, and also the ControlPoint
    if (type === 'from') {
      connector.update({
        fromPoint: point,
        control1: controlPoint,
      });
    }
    if (type === 'to') {
      connector.update({
        toPoint: point,
        control2: controlPoint,
      });
    }
  }

  moveOrScaleHandler(e: any) {
    //if there is a connector, move the connector
    if (this.connectors?.length === 0) return;
    this.connectors?.forEach((connector: any) => {
      const pointConnector = connector.point;

      //get canvas point of the connector point
      const point = new Point(pointConnector.x, pointConnector.y);
      //@ts-ignore
      const transformedPoint = this.transformPointToCanvas(point);

      //use the connectorId to find the connector and then update the connector
      //@ts-ignore
      const connectorObj = this.canvas?.findById(connector.connectorId);

      if (!connectorObj) return;

      if (
        this.id === connectorObj.fromObjectId &&
        connector.connectorType === 'from'
      ) {
        this.updateConnector(transformedPoint, connectorObj, 'from');
      }

      if (
        this.id === connectorObj.toObjectId &&
        connector.connectorType === 'to'
      ) {
        this.updateConnector(transformedPoint, connectorObj, 'to');
      }
    });
  }

  calculateControlPoint(connectingPoint: Point): Point {
    const boundingBox = this.getBoundingRect();
    let left = boundingBox.left;
    let top = boundingBox.top;

    const width = boundingBox.width;
    const height = boundingBox.height;

    const right = left + width;
    const bottom = top + height;

    const connectingX = connectingPoint.x;
    const connectingY = connectingPoint.y;

    let controlX: number = 0;
    let controlY: number = 0;

    // Find the nearest border and calculate the control point outside the bounding box
    const distances = [
      { side: 'left', distance: Math.abs(connectingX - left) },
      { side: 'right', distance: Math.abs(connectingX - right) },
      { side: 'top', distance: Math.abs(connectingY - top) },
      { side: 'bottom', distance: Math.abs(connectingY - bottom) },
    ];

    const nearestBorder = distances.reduce((min, current) =>
      current.distance < min.distance ? current : min
    );

    switch (nearestBorder.side) {
      case 'left':
        controlX = left - 220 * this.scaleX;
        controlY = connectingY;
        break;
      case 'right':
        controlX = right + 220 * this.scaleX;
        controlY = connectingY;
        break;
      case 'top':
        controlX = connectingX;
        controlY = top - 220 * this.scaleY;
        break;
      case 'bottom':
        controlX = connectingX;
        controlY = bottom + 220 * this.scaleY;
        break;
    }

    return new Point(controlX, controlY);
  }



  /**
   * Generate an object that translates the style object so that it is
   * broken up by visual lines (new lines and automatic wrapping).
   * The original text styles object is broken up by actual lines (new lines only),
   * which is only sufficient for Text / IText
   * @private
   */
  _generateStyleMap(textInfo: any) {
    let realLineCount = 0,
      realLineCharCount = 0,
      charCount = 0;
    const map: any = {};

    for (let i = 0; i < textInfo.graphemeLines.length; i++) {
      if (textInfo.graphemeText[charCount] === '\n' && i > 0) {
        realLineCharCount = 0;
        charCount++;
        realLineCount++;
      } else if (
        !this.splitByGrapheme &&
        this._reSpaceAndTab.test(textInfo.graphemeText[charCount]) &&
        i > 0
      ) {
        // this case deals with space's that are removed from end of lines when wrapping
        realLineCharCount++;
        charCount++;
      }

      map[i] = { line: realLineCount, offset: realLineCharCount };

      charCount += textInfo.graphemeLines[i].length;
      realLineCharCount += textInfo.graphemeLines[i].length;
    }

    return map;
  }

  /**
   * Returns true if object has a style property or has it on a specified line
   * @param {Number} lineIndex
   * @return {Boolean}
   */
  styleHas(property: any, lineIndex: number): boolean {
    if (this._styleMap && !this.isWrapping) {
      const map = this._styleMap[lineIndex];
      if (map) {
        lineIndex = map.line;
      }
    }
    return super.styleHas(property, lineIndex);
  }

  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex: number): boolean {
    if (!this.styles) {
      return true;
    }
    let offset: number = 0,
      nextLineIndex = lineIndex + 1,
      nextOffset: any,
      shouldLimit = false;
    const map = this._styleMap[lineIndex],
      mapNextLine = this._styleMap[lineIndex + 1];
    if (map) {
      lineIndex = map.line;
      offset = map.offset;
    }
    if (mapNextLine) {
      nextLineIndex = mapNextLine.line;
      shouldLimit = nextLineIndex === lineIndex;
      nextOffset = mapNextLine.offset;
    }
    const obj =
      typeof lineIndex === 'undefined'
        ? this.styles
        : { line: this.styles[lineIndex] };
    for (const p1 in obj as any) {
      for (const p2 in obj[p1] as any) {
        if (Number(p2) >= offset && (!shouldLimit || Number(p2) < nextOffset)) {
          // eslint-disable-next-line no-unused-vars
          for (const p3 in obj[p1][p2]) {
            return false;
          }
        }
      }
    }
    return true;
  }



  // _wrapLine(
  //   _line: any,
  //   lineIndex: number,
  //   desiredWidth: number,
  //   reservedSpace = 0
  // ): any {
  //   const additionalSpace = this._getWidthOfCharSpacing(),
  //     splitByGrapheme = this.splitByGrapheme,
  //     graphemeLines = [],
  //     words: any = splitByGrapheme
  //       ? this.graphemeSplitForRectNotes(_line)
  //       : this.wordSplit(_line),
  //     infix = splitByGrapheme ? '' : ' ';

  //   let lineWidth = 0,
  //     line: any[] = [],
  //     // spaces in different languages?
  //     offset = 0,
  //     infixWidth = 0,
  //     largestWordWidth = 0,
  //     lineJustStarted = true;
  //   // fix a difference between split and graphemeSplit
  //   if (words.length === 0) {
  //     words.push([]);
  //   }
  //   desiredWidth -= reservedSpace;
  //   // measure words
  //   const data = words.map((word: any) => {
  //     // if using splitByGrapheme words are already in graphemes.
  //     word = splitByGrapheme ? word : this.graphemeSplitForRectNotes(word);
  //     const width = this._measureWord(word, lineIndex, offset);
  //     largestWordWidth = Math.max(width, largestWordWidth);
  //     offset += word.length + 1;
  //     return { word: word, width: width };
  //   });
  //   const maxWidth = Math.max(
  //     desiredWidth,
  //     largestWordWidth,
  //     this.dynamicMinWidth
  //   );
  //   // layout words
  //   offset = 0;
  //   let i;
  //   for (i = 0; i < words.length; i++) {
  //     const word = data[i].word;
  //     const wordWidth = data[i].width;
  //     offset += word.length;

  //     lineWidth += infixWidth + wordWidth - additionalSpace;
  //     if (lineWidth > maxWidth && !lineJustStarted) {
  //       graphemeLines.push(line);
  //       line = [];
  //       lineWidth = wordWidth;
  //       lineJustStarted = true;
  //     } else {
  //       lineWidth += additionalSpace;
  //     }

  //     if (!lineJustStarted && !splitByGrapheme) {
  //       line.push(infix);
  //     }
  //     if (word.length > 1) {
  //       line = line.concat(word.split(''));
  //     } else {
  //       line = line.concat(word);
  //     }

  //     infixWidth = splitByGrapheme
  //       ? 0
  //       : this._measureWord([infix], lineIndex, offset);
  //     offset++;
  //     lineJustStarted = false;
  //   }

  //   i && graphemeLines.push(line);

  //   if (largestWordWidth + reservedSpace > this.dynamicMinWidth) {
  //     this.dynamicMinWidth = largestWordWidth - additionalSpace + reservedSpace;
  //   }
  //   return graphemeLines;
  // }

  /**
   * Detect if the text line is ended with an hard break
   * text and itext do not have wrapping, return false
   * @param {Number} lineIndex text to split
   * @return {Boolean}
   */
  isEndOfWrapping(lineIndex: number): boolean {
    if (!this._styleMap[lineIndex + 1]) {
      // is last line, return true;
      return true;
    }
    if (this._styleMap[lineIndex + 1].line !== this._styleMap[lineIndex].line) {
      // this is last line before a line break, return true;
      return true;
    }
    return false;
  }

  /**
   * Detect if a line has a linebreak and so we need to account for it when moving
   * and counting style.
   * @return Number
   */
  missingNewlineOffset(lineIndex: number) {
    if (this.splitByGrapheme) {
      return this.isEndOfWrapping(lineIndex) ? 1 : 0;
    }
    return 1;
  }



  getMinWidth() {
    return Math.max(this.minWidth, this.dynamicMinWidth);
  }

  controlMousedownProcess(transformData: any, rx: any, ry: any) {
    return;
  }

  getObject() {
    const entityKeys: string[] = EntityKeys;
    const result: Record<string, any> = {};

    entityKeys.forEach((key) => {
      if (key in this) {
        result[key] = (this as any)[key];
      }
    });

    return result;
  }


  // toObject(propertiesToInclude: Array<any>): object {
  //   return super.toObject(
  //     ['minWidth', 'splitByGrapheme'].concat(propertiesToInclude)
  //   );
  // }
  /**extend function for fronted */
  checkTextboxChange() { }
  initializeEvent() {
    const self = this;
    const canvas = this.canvas;

    self.on(EventName.EDITINGENTERED, () => {
      // Set originX based on textAlign
      // self.originX = self.textAlign as TOriginX;

      // Adjust left position to maintain visual consistency
      // if (self.textAlign === TextAlign.LEFT) {
      //   self.left -= (self.width * self.scaleX) / 2;
      // }

      // if (self.textAlign === TextAlign.RIGHT) {
      //   // Corrected adjustment: Subtract instead of Add
      //   self.left -= (self.width * self.scaleX) / 2;
      // }

      if (self.objType === 'XTextbase') {
        self.originY = 'top';

        self.top -= (self.height * self.scaleY) / 2;

        self.tempTop = self.top;

        if (self.text === 'Type here...') {
          self.selectAll();

          self.text = '';

          self.dirty = true;

          self.fill = 'rgb(0, 0, 0)';

          canvas?.requestRenderAll();
        }
      }
    });

    self.on(EventName.EDITINGEXITED, () => {
      // Revert originX and originY to center
      self.originX = Origin.Center;
      self.originY = Origin.Center;

      // // Reverse the left adjustment based on textAlign
      // if (self.textAlign === TextAlign.LEFT) {
      //   self.left += (self.width * self.scaleX) / 2;
      // }

      // if (self.textAlign === TextAlign.RIGHT) {
      //   // Reverse the corrected adjustment: Add back
      //   self.left += (self.width * self.scaleX) / 2;
      // }

      if (self.objType === 'XTextbase') {
        self.top = self.tempTop + (self.height * self.scaleY) / 2;
        self.tempTop = self.top;
      }
    });


    this.on('moving', (e: any) => {
      this.moveOrScaleHandler(e);
    });

    this.on('scaling', (e: any) => {
      this.moveOrScaleHandler(e);
    });
    self.on(EventName.MODIFIED, () => {
      self.checkTextboxChange();

      // canvas.requestRenderAll();
    });
    self.on(EventName.CHANGED, () => {
      if (self.styles[0]) {
        self.styles = {};

        // self.canvas.requestRenderAll();
      }
    });


    // Other event listeners remain unchanged...
  }





  drawObject(ctx: CanvasRenderingContext2D) {
    super.drawObject(ctx);
    // console.log('!@@ drawObject', this.canvas?.dockingWidget, this);
    //@ts-ignore
    if (this == this.canvas?.dockingWidget) {
      this.renderDockingControls(ctx);
    }
  }

  renderDockingControls(ctx: CanvasRenderingContext2D) {
    console.log('!!@renderDockingControls');
    const self = this;
    const canvas = self.canvas;
    const controls = self.controls;

    let cornerColor = 'white';

    if (!canvas) return;

    for (const controlKey in controls) {
      const control = controls[controlKey];
      if (
        !(
          controlKey === 'mbaStart' ||
          controlKey === 'mlaStart' ||
          controlKey === 'mraStart' ||
          controlKey === 'mtaStart'
        )
      )
        continue;

      if (
        //@ts-ignore
        this.canvas!.hoveringControl &&
        //@ts-ignore
        this.canvas!.hoveringControl === controlKey
      ) {
        cornerColor = '#F21D6B';
      } else {
        cornerColor = 'white';
      }

      //render 4 controls, mbaStart, mlaStart, mraStart, mtaStart

      this._renderControl(
        ctx,
        control.x * self.width,
        control.y * self.height,
        { cornerStyle: 'circle', cornerColor },
        self
      );
    }
  }

  _renderControl(
    ctx: any,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: FabricObject
  ) {
    console.log('!!@  _renderControl', left, top);
    let color = styleOverride.cornerColor || 'white';

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.arc(left, top, 6, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }



  resetResizeControls() {
    const self = this;
    const textAlign = self.textAlign;

    if (
      self.objType === 'XTextbase' &&
      (textAlign === 'left' || textAlign === 'center')
    ) {
      self.setControlVisible('ml', false);
      self.setControlVisible('mr', true);
    }

    if (self.objType === 'XText' && textAlign === 'right') {
      self.setControlVisible('ml', true);
      self.setControlVisible('mr', false);
    }
    if (self.canvas) self.canvas.requestRenderAll();
  }
}

classRegistry.setClass(XTextbase);
// classRegistry.getSVGClass(Textbox);
