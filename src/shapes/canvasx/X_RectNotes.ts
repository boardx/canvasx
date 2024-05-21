//@ts-nocheck

import { classRegistry } from '../../ClassRegistry';
import { Textbox } from './X_Textbox';
import { createRectNotesDefaultControls } from '../../controls/X_commonControls';
import type { TBBox, TClassProperties } from '../../typedefs';
import { Point } from '../../Point';
import { X_Connector } from './X_Connector';
import { invertTransform } from '../../util';

// this will be a separated effort
export const rectNotesDefaultValues: Partial<TClassProperties<RectNotes>> = {
  minWidth: 20,
  dynamicMinWidth: 2,
  lockScalingFlip: true,
  noScaleCache: false,
  _wordJoiners: /[ \t\r]/,
  splitByGrapheme: true,
  height: 138,
  maxHeight: 138,
  originX: 'center',
  originY: 'center',
  width: 230,
  cornerStrokeColor: 'gray',
  cornerStyle: 'circle',
  cornerColor: 'white',
  transparentCorners: false,
};

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export class RectNotes extends Textbox {
  /**selectable
   * Minimum width of textbox, in pixels.
   * @type Number
   * @default
   */
  declare minWidth: number;

  declare locked: boolean;

  declare verticalAlign: string;

  declare zIndex: number;
  declare maxHeight: number;
  declare connectors: object[];
  declare id: string;

  public extendPropeties = [
    'obj_type',
    'whiteboardId',
    'userId',
    'timestamp',
    'zIndex',
    'locked',
    'verticalAlign',
    'lines',
    '_id',
    'zIndex',
    'relationship',
    'emoj',
    'userEmoji',
  ];
  /**
   * Minimum calculated width of a textbox, in pixels.
   * fixed to 2 so that an empty textbox cannot go to 0
   * and is still selectable without text.
   * @type Number
   * @default
   */
  declare dynamicMinWidth: number;

  /**
   * Use this boolean property in order to split strings that have no white space concept.
   * this is a cheap way to help with chinese/japanese
   * @type Boolean
   * @since 2.6.0
   */
  declare splitByGrapheme: boolean;

  static textLayoutProperties = [...Textbox.textLayoutProperties, 'width'];

  static ownDefaults: Record<string, any> = rectNotesDefaultValues;

  static getDefaults() {
    return {
      ...super.getDefaults(),
      controls: createRectNotesDefaultControls(),
      ...RectNotes.ownDefaults,
    };
  }
  constructor(
    text: string,
    options: Partial<TClassProperties<RectNotes>> = {}
  ) {
    super(text, options);
    this.initializeEvent();
  }

  findById(id: string) {
    const canvas = this.canvas;
    const obj = canvas?.getObjects().filter((widget: any) => widget.id === id);
    if (obj.length === 0) return null;
    return obj[0];
  }

  calculateControlPoint(boundingBox: TBBox, connectingPoint: Point): Point {
    const left = boundingBox.left;
    const top = boundingBox.top;
    const width = boundingBox.width;
    const height = boundingBox.height;

    const right = left + width;
    const bottom = top + height;

    const connectingX = connectingPoint.x;
    const connectingY = connectingPoint.y;

    let controlX: number;
    let controlY: number;

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
        controlX = left - 220;
        controlY = connectingY;
        break;
      case 'right':
        controlX = right + 220;
        controlY = connectingY;
        break;
      case 'top':
        controlX = connectingX;
        controlY = top - 220;
        break;
      case 'bottom':
        controlX = connectingX;
        controlY = bottom + 220;
        break;
    }

    return { x: controlX, y: controlY };
  }

  updateConnector(point, connector: X_Connector, type: string) {
    const controlPoint = this.calculateControlPoint(
      this.getBoundingRect(),
      new Point(point.x, point.y)
    );

    //if the connector is from the object, then the startpoint should be updated
    //if the connector is to the object, then the endpoint should be updated

    //recalculate the startpoint or endpoint of the connector, and also the ControlPoint
    if (type === 'from') {
      connector.startPoint = point;
      connector.control1 = controlPoint;
      connector.update({
        fromPoint: point,
        control1: controlPoint,
      });
    }
    if (type === 'to') {
      connector.endPoint = point;
      connector.control2 = controlPoint;
      connector.update({
        toPoint: point,
        control2: controlPoint,
      });
    }
  }

  initializeEvent() {
    this.on('moving', function (e) {
      //get the canvas point accordin gto the event
      const canvas = this.canvas;

      //if there is a connector, move the connector
      if (this.connectors?.length === 0) return;
      this.connectors.forEach((connector) => {
        const pointConnector = connector.point;

        //get canvas point of the connector point
        const point = new Point(pointConnector.x, pointConnector.y);

        const transformedPoint = TransformPointFromObjectToCanvas(this, point);

        //use the connectorId to find the connector and then update the connector
        const connectorObj = this.findById(connector.connectorId);
        console.log(
          '!!point currentWidget:',
          this.id,
          'connector',
          connector,
          'target Connector:',
          connectorObj.id,
          'from:',
          connectorObj.fromId,
          'to',
          connectorObj.toId,
          pointConnector,
          transformedPoint
        );

        if (!connectorObj) return;
        console.log('connectorObj', connectorObj);

        if (this.id === connectorObj.fromId) {
          this.updateConnector(transformedPoint, connectorObj, 'from');
        }

        if (this.id === connectorObj.toId) {
          this.updateConnector(transformedPoint, connectorObj, 'to');
        }
      });

      console.log('moving', e);
      console.log('moving', this);
    });
  }

  /**
   * Unlike superclass's version of this function, Textbox does not update
   * its width.
   * @private
   * @override
   */
  initDimensions() {
    if (!this.initialized) {
      return;
    }
    this.isEditing && this.initDelayedCursor();
    this._clearCache();
    // clear dynamicMinWidth as it will be different after we re-wrap line
    this.dynamicMinWidth = 0;
    // wrap lines
    this._styleMap = this._generateStyleMap(this._splitText());
    // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
    if (this.dynamicMinWidth > this.width) {
      this.set('fontSize', this.fontSize - 2);
      this._splitTextIntoLines(this.text);
      return;
    }
    if (this.textAlign.indexOf('justify') !== -1) {
      // once text is measured we need to make space fatter to make justified text.
      this.enlargeSpaces();
    }
    // clear cache and re-calculate height
    const height = this.calcTextHeight();
    if (height > this.maxHeight && this.fontSize > 6) {
      this.set('fontSize', this.fontSize - 2);
      this._splitTextIntoLines(this.text);
      return;
    }
    if (height > 130 && this.fontSize === 6) {
      const prenum = 125 / height;
      const newText = this.text.substring(0, this.text.length * prenum - 5);
      this.set('text', newText + '...');
    }
    this.height = this.maxHeight;
    return this.height;
  }

  /**
   * Generate an object that translates the style object so that it is
   * broken up by visual lines (new lines and automatic wrapping).
   * The original text styles object is broken up by actual lines (new lines only),
   * which is only sufficient for Text / IText
   * @private
   */
  _generateStyleMap(textInfo: any) {
    let realLineCount = 0;
    let realLineCharCount = 0;
    let charCount = 0;
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

      map[i] = {
        line: realLineCount,
        offset: realLineCharCount,
      };

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
    let offset = 0,
      nextLineIndex = lineIndex + 1,
      nextOffset,
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
    for (const p1 in obj) {
      for (const p2 in obj[p1]) {
        if (p2 >= offset && (!shouldLimit || p2 < nextOffset)) {
          // eslint-disable-next-line no-unused-vars
          for (const p3 in obj[p1][p2]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _getStyleDeclaration(lineIndex: number, charIndex: number) {
    if (this._styleMap && !this.isWrapping) {
      const map = this._styleMap[lineIndex];
      if (!map) {
        return null;
      }
      lineIndex = map.line;
      charIndex = map.offset + charIndex;
    }
    return super._getStyleDeclaration(lineIndex, charIndex);
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  _setStyleDeclaration(lineIndex: number, charIndex: number, style: object) {
    const map = this._styleMap[lineIndex];
    lineIndex = map.line;
    charIndex = map.offset + charIndex;

    this.styles[lineIndex][charIndex] = style;
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _deleteStyleDeclaration(lineIndex: number, charIndex: number) {
    const map = this._styleMap[lineIndex];
    lineIndex = map.line;
    charIndex = map.offset + charIndex;
    delete this.styles[lineIndex][charIndex];
  }

  /**
   * probably broken need a fix
   * Returns the real style line that correspond to the wrapped lineIndex line
   * Used just to verify if the line does exist or not.
   * @param {Number} lineIndex
   * @returns {Boolean} if the line exists or not
   * @private
   */
  _getLineStyle(lineIndex: number): boolean {
    const map = this._styleMap[lineIndex];
    return !!this.styles[map.line];
  }

  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @param {Object} style
   * @private
   */
  _setLineStyle(lineIndex: number) {
    const map = this._styleMap[lineIndex];
    this.styles[map.line] = {};
  }

  /**
   * Wraps text using the 'width' property of Textbox. First this function
   * splits text on newlines, so we preserve newlines entered by the user.
   * Then it wraps each line using the width of the Textbox by calling
   * _wrapLine().
   * @param {Array} lines The string array of text that is split into lines
   * @param {Number} desiredWidth width you want to wrap to
   * @returns {Array} Array of lines
   */
  _wrapText(lines: Array<any>, desiredWidth: number): Array<any> {
    const wrapped = [];
    this.isWrapping = true;
    for (let i = 0; i < lines.length; i++) {
      wrapped.push(...this._wrapLine(lines[i], i, desiredWidth));
    }
    this.isWrapping = false;
    return wrapped;
  }

  /**
   * Helper function to measure a string of text, given its lineIndex and charIndex offset
   * It gets called when charBounds are not available yet.
   * Override if necessary
   * Use with {@link Textbox#wordSplit}
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {String} text
   * @param {number} lineIndex
   * @param {number} charOffset
   * @returns {number}
   */
  _measureWord(word, lineIndex: number, charOffset = 0): number {
    let width = 0,
      prevGrapheme;
    const skipLeft = true;
    for (let i = 0, len = word.length; i < len; i++) {
      const box = this._getGraphemeBox(
        word[i],
        lineIndex,
        i + charOffset,
        prevGrapheme,
        skipLeft
      );
      width += box.kernedWidth;
      prevGrapheme = word[i];
    }
    return width;
  }

  /**
   * Override this method to customize word splitting
   * Use with {@link Textbox#_measureWord}
   * @param {string} value
   * @returns {string[]} array of words
   */
  wordSplit(value: string): string[] {
    return value.split(this._wordJoiners);
  }

  /**
   * Wraps a line of text using the width of the Textbox and a context.
   * @param {Array} line The grapheme array that represent the line
   * @param {Number} lineIndex
   * @param {Number} desiredWidth width you want to wrap the line to
   * @param {Number} reservedSpace space to remove from wrapping for custom functionalities
   * @returns {Array} Array of line(s) into which the given text is wrapped
   * to.
   */

  graphemeSplitForRectNotes(textstring: string): string[] {
    const graphemes = [];
    const words = textstring.split(/\b/);
    for (let i = 0; i < words.length; i++) {
      // 检查单词是否全为拉丁字母，长度不大于16
      if (/^[a-zA-Z]{1,16}$/.test(words[i])) {
        graphemes.push(words[i]);
      } else {
        for (let j = 0; j < words[i].length; j++) {
          graphemes.push(words[i][j]);
        }
      }
    }
    return graphemes;
  }

  _wrapLine(
    _line,
    lineIndex: number,
    desiredWidth: number,
    reservedSpace = 0
  ): Array<any> {
    const additionalSpace = this._getWidthOfCharSpacing();
    const splitByGrapheme = this.splitByGrapheme;
    const graphemeLines = [];
    const words = splitByGrapheme
      ? this.graphemeSplitForRectNotes(_line)
      : this.wordSplit(_line);
    const infix = splitByGrapheme ? '' : ' ';

    let lineWidth = 0,
      line = [],
      // spaces in different languages?
      offset = 0,
      infixWidth = 0,
      largestWordWidth = 0,
      lineJustStarted = true;
    // fix a difference between split and graphemeSplit
    if (words.length === 0) {
      words.push([]);
    }
    desiredWidth -= reservedSpace;
    // measure words
    const data = words.map((word) => {
      // if using splitByGrapheme words are already in graphemes.
      word = splitByGrapheme ? word : this.graphemeSplitForRectNotes(word);
      const width = this._measureWord(word, lineIndex, offset);
      largestWordWidth = Math.max(width, largestWordWidth);
      offset += word.length + 1;
      return { word: word, width: width };
    });
    const maxWidth = Math.max(
      desiredWidth,
      largestWordWidth,
      this.dynamicMinWidth
    );
    // layout words
    offset = 0;
    let i;
    for (i = 0; i < words.length; i++) {
      const word = data[i].word;
      const wordWidth = data[i].width;
      offset += word.length;

      lineWidth += infixWidth + wordWidth - additionalSpace;
      if (lineWidth > maxWidth && !lineJustStarted) {
        graphemeLines.push(line);
        line = [];
        lineWidth = wordWidth;
        lineJustStarted = true;
      } else {
        lineWidth += additionalSpace;
      }

      if (!lineJustStarted && !splitByGrapheme) {
        line.push(infix);
      }
      if (word.length > 1) {
        line = line.concat(word.split(''));
      } else {
        line = line.concat(word);
      }

      infixWidth = splitByGrapheme
        ? 0
        : this._measureWord([infix], lineIndex, offset);
      offset++;
      lineJustStarted = false;
    }

    i && graphemeLines.push(line);

    if (largestWordWidth + reservedSpace > this.dynamicMinWidth) {
      this.dynamicMinWidth = largestWordWidth - additionalSpace + reservedSpace;
    }
    return graphemeLines;
  }

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
  missingNewlineOffset(lineIndex) {
    if (this.splitByGrapheme) {
      return this.isEndOfWrapping(lineIndex) ? 1 : 0;
    }
    return 1;
  }

  /**
   * Gets lines of text to render in the Textbox. This function calculates
   * text wrapping on the fly every time it is called.
   * @param {String} text text to split
   * @returns {Array} Array of lines in the Textbox.
   * @override
   */
  _splitTextIntoLines(text: string) {
    const newText = super._splitTextIntoLines(text),
      graphemeLines = this._wrapText(newText.lines, this.width),
      lines = new Array(graphemeLines.length);
    for (let i = 0; i < graphemeLines.length; i++) {
      lines[i] = graphemeLines[i].join('');
    }
    newText.lines = lines;
    newText.graphemeLines = graphemeLines;
    return newText;
  }

  getMinWidth() {
    return Math.max(this.minWidth, this.dynamicMinWidth);
  }

  _removeExtraneousStyles() {
    const linesToKeep = {};
    for (const prop in this._styleMap) {
      if (this._textLines[prop]) {
        linesToKeep[this._styleMap[prop].line] = 1;
      }
    }
    for (const prop in this.styles) {
      if (!linesToKeep[prop]) {
        delete this.styles[prop];
      }
    }
  }

  /**
   * Returns object representation of an instance
   * @method toObject
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude: Array<any>): object {
    return super.toObject(
      [...this.extendPropeties, 'minWidth', 'splitByGrapheme'].concat(
        propertiesToInclude
      )
    );
  }
  /**boardx custom function */

  /* caculate cusor positon in the middle of the textbox */
  getCenteredTop(rectHeight: number) {
    const textHeight = this.height;
    return (rectHeight - textHeight) / 2;
  }

  _render(ctx: CanvasRenderingContext2D) {
    const path: any = this.path;

    path && !path.isNotVisible() && path._render(ctx);
    this._setTextStyles(ctx);
    this._renderTextLinesBackground(ctx);
    this._renderTextDecoration(ctx, 'underline');
    this._renderText(ctx);
    this._renderTextDecoration(ctx, 'overline');
    this._renderTextDecoration(ctx, 'linethrough');
  }

  _renderBackground(ctx: CanvasRenderingContext2D) {
    if (!this.backgroundColor) {
      return;
    }
    const dim = this._getNonTransformedDimensions();
    ctx.fillStyle = this.backgroundColor;

    // ctx.shadowBlur = 20;
    // ctx.shadowOffsetX = 2 * this.scaleX * canvas.getZoom();
    // ctx.shadowOffsetY = 6 * this.scaleY * canvas.getZoom();
    // ctx.shadowColor = 'rgba(0,0,0,0.1)';
    // ctx.shadowColor = 'rgba(0,0,0,1)';

    ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);

    // if there is background color no other shadows
    // should be casted
    // this._removeShadow(ctx);
  }
  _getTopOffset() {
    return -this._getTotalLineHeights() / 2;
  }
  _getTotalLineHeight() {
    return this._textLines.reduce(
      (total, _line, index) => total + this.getHeightOfLine(index),
      0
    );
  }

  _renderText(ctx: CanvasRenderingContext2D) {
    ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
    ctx.shadowColor = '';

    if (this.paintFirst === 'stroke') {
      this._renderTextStroke(ctx);
      this._renderTextFill(ctx);
    } else {
      this._renderTextFill(ctx);
      this._renderTextStroke(ctx);
    }
  }
  drawRoundRectPath(
    cxt: CanvasRenderingContext2D,
    width: number,
    height: number,
    radius: number
  ) {
    cxt.beginPath();
    //从右下角顺时针绘制，弧度从0到1/2PI
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI
    cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

    //上边线
    cxt.lineTo(width - radius, 0);

    //右上角圆弧
    cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);

    //右边线
    cxt.lineTo(width, height - radius);
    cxt.closePath();
  }
}

classRegistry.setClass(RectNotes);
classRegistry.setSVGClass(RectNotes, 'RectNotes');

const TransformPointFromObjectToCanvas = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcOwnMatrix();
  // const mCanvas = object.getViewportTransform();
  // const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const transformedPoint = point.transform(mObject); // transformPoint(point, matrix);
  return transformedPoint;
};

export const TransformPointFromCanvasToObject = (
  object: FabricObject,
  point: Point
) => {
  const mObject = object.calcOwnMatrix();
  // const mCanvas = object.canvas!.viewportTransform;
  // const matrix = multiplyTransformMatrices(mCanvas, mObject);
  const invertedMatrix = invertTransform(mObject);
  const transformedPoint = point.transform(invertedMatrix);
  return transformedPoint;
};
window.TransformPointFromObjectToCanvas = TransformPointFromObjectToCanvas;
window.TransformPointFromCanvasToObject = TransformPointFromCanvasToObject;
