import { TClassProperties } from '../../typedefs';
import { IText } from '../IText/IText';
import { classRegistry } from '../../ClassRegistry';
import { createTextboxDefaultControls } from '../../controls/X_commonControls';
import { EventName, TextAlign, WidgetType, Origin } from './types';
import { Textbox } from '../Textbox';

import { isTransformCentered, getLocalPoint } from '../../controls/util';
// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const textboxDefaultValues: Partial<TClassProperties<X_Textbox>> = {
  minWidth: 20,
  dynamicMinWidth: 2,
  // _wordJoiners: /[ \t\r]/,
  splitByGrapheme: true,
  objType: 'X_Textbox',
};

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export class X_Textbox extends Textbox {
  /**
   * Minimum width of textbox, in pixels.
   * @type Number
   * @default
   */
  declare minWidth: number;

  /* boardx cusotm function */
  declare objType: string;

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
      ...X_Textbox.ownDefaults,
    };
  }
  constructor(text: string, options: any) {
    super(text, options);
    // if (this.objType !== 'WBText' && this.objType !== 'WBTextbox') {
    // this.addControls();
    // }
    this.InitializeEvent();
    this.resetResizeControls();
  }

  // /**
  //  * Unlike superclass's version of this function, Textbox does not update
  //  * its width.
  //  * @private
  //  * @override
  //  */
  // initDimensions() {
  //   if (!this.initialized) {
  //     return;
  //   }
  //   this.isEditing && this.initDelayedCursor();
  //   this._clearCache();
  //   // clear dynamicMinWidth as it will be different after we re-wrap line
  //   this.dynamicMinWidth = 0;
  //   // wrap lines
  //   this._styleMap = this._generateStyleMap(this._splitText());
  //   // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
  //   if (this.dynamicMinWidth > this.width) {
  //     this._set('width', this.dynamicMinWidth);
  //   }
  //   if (this.textAlign.indexOf('justify') !== -1) {
  //     // once text is measured we need to make space fatter to make justified text.
  //     this.enlargeSpaces();
  //   }
  //   // clear cache and re-calculate height
  //   this.height = this.calcTextHeight();
  // }

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

  // /**
  //  * @param {Number} lineIndex
  //  * @param {Number} charIndex
  //  * @private
  //  */
  // _getStyleDeclaration(lineIndex: number, charIndex: number) {
  //   if (this._styleMap && !this.isWrapping) {
  //     const map = this._styleMap[lineIndex];
  //     if (!map) {
  //       return null;
  //     }
  //     lineIndex = map.line;
  //     charIndex = map.offset + charIndex;
  //   }
  //   return super._getStyleDeclaration(lineIndex, charIndex);
  // }

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

  // /**
  //  * Wraps text using the 'width' property of Textbox. First this function
  //  * splits text on newlines, so we preserve newlines entered by the user.
  //  * Then it wraps each line using the width of the Textbox by calling
  //  * _wrapLine().
  //  * @param {Array} lines The string array of text that is split into lines
  //  * @param {Number} desiredWidth width you want to wrap to
  //  * @returns {Array} Array of lines
  //  */
  // _wrapText(lines: Array<any>, desiredWidth: number): Array<any> {
  //   const wrapped = [];
  //   this.isWrapping = true;
  //   for (let i = 0; i < lines.length; i++) {
  //     wrapped.push(...this._wrapLine(lines[i], i, desiredWidth));
  //   }
  //   this.isWrapping = false;
  //   return wrapped;
  // }

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
  _measureWord(word: any, lineIndex: number, charOffset = 0): number {
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

  // _wrapLine(
  //   _line: any,
  //   lineIndex: number,
  //   desiredWidth: number,
  //   reservedSpace = 0
  // ): Array<any> {
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

  /**
   * Gets lines of text to render in the Textbox. This function calculates
   * text wrapping on the fly every time it is called.
   * @param {String} text text to split
   * @returns {Array} Array of lines in the Textbox.
   * @override
   */
  _splitTextIntoLines(text: string) {
    const newText = super._splitTextIntoLines(text);
    if (!this.fromCopy) {
      if (
        (this.objType === 'WBText' || this.objType === 'WBTextbox') &&
        this.textLines &&
        this.textLines.length > 1 &&
        this.isEditing
      ) {
        this.oneLine = false;
      } else {
        this.oneLine = true;
      }
    } else {
      this.oneLine = false;
    }
    if (
      (this.objType === 'WBText' || this.objType === 'WBTextbox') &&
      newText &&
      newText.lines &&
      this.oneLine &&
      this.isEditing
    ) {
      if (newText.lines[0].length > 1) {
        this.width =
          this._measureWord(newText.lines[0], 0, 0) > this.width
            ? this._measureWord(newText.lines[0], 0, 0) + 10
            : this.width;
      }
    }
    const graphemeLines = this._wrapText(newText.lines, this.width);
    const lines = new Array(graphemeLines.length);
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

  // _removeExtraneousStyles() {
  //   const linesToKeep = {};
  //   for (const prop in this._styleMap) {
  //     if (this._textLines[prop]) {
  //       linesToKeep[this._styleMap[prop].line] = 1;
  //     }
  //   }
  //   for (const prop in this.styles) {
  //     if (!linesToKeep[prop]) {
  //       delete this.styles[prop];
  //     }
  //   }
  // }
  // addControls() {
  //   function renderCustomControl(ctx, left, top, fabricObject) {
  //     const styleOverride1 = {
  //       cornerSize: 10,
  //       cornerStrokeColor: this.isHovering ? '#31A4F5' : '#b3cdfd',
  //       cornerColor: this.isHovering ? '#31A4F5' : '#b3cdfd',
  //       lineWidth: 2,
  //     };
  //     renderCircleControl.call(
  //       fabricObject,
  //       ctx,
  //       left,
  //       top,
  //       styleOverride1,
  //       fabricObject
  //     );
  //   }

  //   this.controls.mtaStart = new Control({
  //     x: 0,
  //     y: -0.5,
  //     offsetX: 0,
  //     offsetY: -20,
  //     render: renderCustomControl,
  //     mouseDownHandler: (eventData, transformData) => {
  //       this.controlMousedownProcess(transformData, 0.0, -0.5);
  //       return true;
  //     },
  //     name: 'mtaStart',
  //   });

  //   this.controls.mbaStart = new Control({
  //     x: 0,
  //     y: 0.5,
  //     offsetX: 0,
  //     offsetY: 20,
  //     render: renderCustomControl,
  //     mouseDownHandler: (eventData, transformData) => {
  //       this.controlMousedownProcess(transformData, 0.0, 0.5);
  //       return true;
  //     },
  //     name: 'mbaStart',
  //   });

  //   this.controls.mlaStart = new Control({
  //     x: -0.5,
  //     y: 0,
  //     offsetX: -20,
  //     offsetY: 0,
  //     render: renderCustomControl,
  //     mouseDownHandler: (eventData, transformData) => {
  //       this.controlMousedownProcess(transformData, -0.5, 0.0);
  //       return true;
  //     },
  //     name: 'mlaStart',
  //   });

  //   this.controls.mraStart = new Control({
  //     x: 0.5,
  //     y: 0,
  //     offsetX: 20,
  //     offsetY: 0,
  //     render: renderCustomControl,
  //     mouseDownHandler: (eventData, transformData) => {
  //       this.controlMousedownProcess(transformData, 0.5, 0.0);
  //       return true;
  //     },
  //     name: 'mraStart',
  //   });
  // }

  controlMousedownProcess(transformData: any, rx: any, ry: any) {
    return;
  }
  /**
   * Returns object representation of an instance
   * @method toObject
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */

  getObject() {
    const object = {};

    const keys = [
      'id', // string, the id of the object
      'angle', //  integer, angle for recording rotating
      'backgroundColor', // string,  background color, works when the image is transparent
      'fill', // the font color
      'width', // integer, width of the object
      'height', // integer, height of the object
      'left', // integer left for position
      'lines', // array, the arrows array [{…}]
      'locked', // boolean, lock status for the widget， this is connected to lock
      'lockMovementX', // boolean, lock the verticle movement
      'lockMovementY', // boolean, lock the horizontal movement
      'lockScalingFlip', // boolean,  make it can not be inverted by pulling the width to the negative side
      'objType', // object type
      'originX', // string, Horizontal origin of transformation of an object (one of "left", "right", "center") See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
      'originY', // string, Vertical origin of transformation of an object (one of "top", "bottom", "center") See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
      'scaleX', // nunber, Object scale factor (horizontal)
      'scaleY', // number, Object scale factor (vertical)
      'selectable', // boolean, When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection). But events still fire on it.
      'top', // integer, Top position of an object. Note that by default it's relative to object top. You can change this by setting originY={top/center/bottom}
      'userId', // string, user identity
      'whiteboardId', // whiteboard id, string
      'zIndex', // the index for the object on whiteboard, integer
      'version', // version of the app, string
      'isPanel', // is this a panel, boolean
      'panelObj', // if this is a panel, the id of the panel, string
      'relationship', // array, viewporttransform
      'subObjList', // ["5H9qYfNGt4vizhcuS"] array list id for sub objects
      'fontFamily', // string, font family
      'fontSize', // integer, font size
      'fontWeight', // integer, font weight
      'lineHeight', // integer, font height
      'text', // string, text
      'textAlign', // string, alignment
      'editable',
      'shapeScaleX',
      'shapeScaleY',
      'maxHeight',
      'tempTop',
      'fixedScaleChange',
      'preTop',
    ];
    keys.forEach((key) => {
      //@ts-ignore
      object[key] = this[key];
    });
    return object;
  }

  // toObject(propertiesToInclude: Array<any>): object {
  //   return super.toObject(
  //     ['minWidth', 'splitByGrapheme'].concat(propertiesToInclude)
  //   );
  // }
  /**extend function for fronted */
  checkTextboxChange() {}
  InitializeEvent() {
    const self = this;
    const canvas = this.canvas;

    self.on(EventName.EDITINGENTERED, () => {
      // if it is in draw widget mode, then skip update
      // if (canvas.drawTempWidget) return;

      self.originX = self.textAlign;

      if (self.textAlign === TextAlign.LEFT) {
        self.left -= (self.width * self.scaleX) / 2;
      }

      if (self.textAlign === TextAlign.RIGHT) {
        self.left += (self.width * self.scaleX) / 2;
      }

      if (self.objType === WidgetType.WBText) {
        self.originY = 'top';

        self.top -= (self.height * self.scaleY) / 2;

        self.tempTop = self.top;

        if (self.text === 'Type here...') {
          self.selectAll();

          self.text = '';

          // self.hiddenTextarea.value = '';

          self.dirty = true;

          self.fill = 'rgb(0, 0, 0)';

          canvas?.requestRenderAll();
        }
      }
    });

    self.on(EventName.EDITINGEXITED, () => {
      // if it is in draw widget mode, then skip update
      // if (canvas.drawTempWidget) return;

      // if (self.text === '' && self.objType === WidgetType.WBText) {
      //   canvas.removeWidget(self);

      //   return;
      // }

      self.originX = Origin.Center;

      self.originY = Origin.Center;

      if (self.textAlign === Origin.Left) {
        self.left += (self.width * self.scaleX) / 2;
      }

      if (self.textAlign === Origin.Right) {
        self.left -= (self.width * self.scaleX) / 2;
      }

      if (self.objType === WidgetType.WBText) {
        self.top = self.tempTop + (self.height * self.scaleY) / 2;
        self.tempTop = self.top;
      }
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
  }

  changeWidth(eventData: any, transform: any, x: any, y: any) {
    var target = transform.target,
      localPoint = getLocalPoint(
        transform,
        transform.originX,
        transform.originY,
        x,
        y
      ),
      strokePadding =
        target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth =
        Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding,
      shapeScaleX =
        Math.abs(target.aCoords['tl'].x - target.aCoords['tr'].x) / 138;
    target.set('shapeScaleX', shapeScaleX);
    target.set('width', Math.max(newWidth, 0));

    target.initDimensions();

    target.set('dirty', true);

    if (target.objType === 'WBTextbox' || target.objType === 'WBText') {
      target.set('fixedScaleChange', false);
    }

    if (target.objType !== 'WBText') {
      target.saveData('MODIFIED', ['width']);
    }

    return oldWidth !== newWidth;
  }

  resetResizeControls() {
    const self = this;
    const textAlign = self.textAlign;

    if (
      self.objType === 'WBText' &&
      (textAlign === 'left' || textAlign === 'center')
    ) {
      self.setControlVisible('ml', false);
      self.setControlVisible('mr', true);
    }

    if (self.objType === 'WBText' && textAlign === 'right') {
      self.setControlVisible('ml', true);
      self.setControlVisible('mr', false);
    }
    if (self.canvas) self.canvas.requestRenderAll();
  }
}

classRegistry.setClass(Textbox);
// classRegistry.getSVGClass(Textbox);
