import { classRegistry } from '../../ClassRegistry';
import { XTextbox as Textbox } from './XTextbox';
import type { TClassProperties, TOriginX, TOriginY } from '../../typedefs';
import { Point } from '../../Point';
import { XConnector } from './XConnector';
import { createRectNotesDefaultControls } from '../../controls/X_commonControls';

import { XObjectInterface } from './XObjectInterface';
// this will be a separated effort
export const rectNotesDefaultValues: Partial<TClassProperties<XRectNotes>> = {
  minWidth: 20,
  dynamicMinWidth: 2,

  splitByGrapheme: true,
  height: 138,
  maxHeight: 138,

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
///@ts-ignore
export class XRectNotes extends Textbox implements XObjectInterface {
  /**selectable
   * Minimum width of textbox, in pixels.
   * @type Number
   * @default
   */
  declare minWidth: number;
  static type = 'XRectNotes';
  objType: string = 'XRectNotes';
  declare locked: boolean;

  declare verticalAlign: string;
  declare originX: TOriginX;
  declare originY: TOriginY;
  declare width: number;
  declare cornerStrokeColor: string;

  declare cornerColor: string;
  declare transparentCorners: boolean;
  declare zIndex: number;
  declare height: number;
  declare maxHeight: number;
  declare connectors: object[];
  declare id: string;

  public extendedProperties = [
    'objType',
    'boardId',
    'userId',
    'timestamp',
    'zIndex',
    'locked',
    'verticalAlign',
    'id',
    'zIndex',
    'emoj',
    'userEmoji',
    'connectors', //the connectors of the object
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

      ...XRectNotes.ownDefaults,
    };
  }
  constructor(
    text: string,
    options: Partial<TClassProperties<XRectNotes>> = {}
  ) {
    super(text, options);
    Object.assign(this, {
      controls: {
        ...createRectNotesDefaultControls(this),
        // mr: { /* add your desired value here */ },
      },
    });
    this.initializeEvent();
  }

  updateConnector(point: any, connector: XConnector, type: string) {
    const controlPoint = this.calculateControlPoint(
      this.getBoundingRect(),
      new Point(point.x, point.y)
    );

    // console.log(
    //   'updateConnector: point:',
    //   point,
    //   'control point:',
    //   controlPoint,
    //   connector,
    //   type
    // );
    //if the connector is from the object, then the startpoint should be updated
    //if the connector is to the object, then the endpoint should be updated

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
      console.log('connectorObj', connectorObj);

      if (this.id === connectorObj.fromObjectId) {
        this.updateConnector(transformedPoint, connectorObj, 'from');
      }

      if (this.id === connectorObj.toObjectId) {
        this.updateConnector(transformedPoint, connectorObj, 'to');
      }
    });
  }

  initializeEvent() {
    this.on('moving', (e) => {
      this.moveOrScaleHandler(e);
    });

    this.on('scaling', (e) => {
      this.moveOrScaleHandler(e);
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
  /*
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
  _getTotalLineHeights() {
    return this._textLines.reduce(
      (total, line, index) => total + this.getHeightOfLine(index),
      0
    );
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

classRegistry.setClass(XRectNotes);
classRegistry.setSVGClass(XRectNotes, 'XRectNotes');
