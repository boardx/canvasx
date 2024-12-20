import { TClassProperties } from '../../typedefs';
import { classRegistry } from '../../ClassRegistry';
import { XTextbase } from './XTextbase';
import { createRectNotesDefaultControls } from '../../controls/X_commonControls';

import { EntityKeys, WidgetCircleNotesInterface } from './type/widget.entity.circlenote';
import { WidgetType } from './type/widget.type';

// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const circleNotesDefaultValues: Partial<TClassProperties<XCircleNotes>> =
{
  minWidth: 20,
  dynamicMinWidth: 2,
  verticalAlign: 'middle',
  lockScalingFlip: true,
  noScaleCache: false,
  _wordJoiners: /[ \t\r]/,
  splitByGrapheme: true,
  objType: 'XCircleNotes',
  height: 138,
  maxHeight: 138,
  width: 138,
  noteType: 'circle',
  radius: 138,
  cornerStrokeColor: 'gray',
  cornerStyle: 'circle',
  cornerColor: 'white',
  transparentCorners: false,
};

export interface CircleNotesProps {
  id: string;
  originX: string;
  originY: string;
  top: number;
  left: number;
  textAlign: string;
  width: number;
  height: number;
  backgroundColor: string;
}

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export class XCircleNotes extends XTextbase implements WidgetCircleNotesInterface {
  /**selectable
   * Minimum width of textbox, in pixels.
   * @type Number
   * @default
   */
  declare minWidth: number;
  declare maxHeight: number;
  declare noteType: string;
  declare radius: number;

  static type: WidgetType = 'XCircleNotes';
  static objType: WidgetType = 'XCircleNotes';

  /* boardx cusotm function */
  declare id: string;

  declare locked: boolean;

  declare boardId: string;

  declare userId: string;

  declare timestamp: Date;

  declare verticalAlign: string;

  declare zIndex: number;

  declare lines: object[];

  declare relationship: object[];

  declare emoj: object[];

  declare userEmoji: object[];

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

  static textLayoutProperties = [...XTextbase.textLayoutProperties, 'width'];

  static ownDefaults: Record<string, any> = circleNotesDefaultValues;

  static getDefaults() {
    return {
      ...super.getDefaults(),

      ...XCircleNotes.ownDefaults,
    };
  }

  constructor(text: string, options: any) {

    super(text, options);
    Object.assign(this, options);
    Object.assign(this, {
      controls: { ...createRectNotesDefaultControls(this) },
    });
    this.objType = 'XCircleNotes';
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
    if (height > 76 && this.fontSize > 2) {
      this.set('fontSize', this.fontSize - 2);
      this._splitTextIntoLines(this.text);
      return;
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

  // /**
  //  * Returns true if object has a style property or has it on a specified line
  //  * @param {Number} lineIndex
  //  * @return {Boolean}
  //  */
  // styleHas(property, lineIndex: number): boolean {
  //   if (this._styleMap && !this.isWrapping) {
  //     const map = this._styleMap[lineIndex];
  //     if (map) {
  //       lineIndex = map.line;
  //     }
  //   }
  //   return super.styleHas(property, lineIndex);
  // }

  // /**
  //  * Returns true if object has no styling or no styling in a line
  //  * @param {Number} lineIndex , lineIndex is on wrapped lines.
  //  * @return {Boolean}
  //  */
  // isEmptyStyles(lineIndex: number): boolean {
  //   if (!this.styles) {
  //     return true;
  //   }
  //   let offset = 0,
  //     nextLineIndex = lineIndex + 1,
  //     nextOffset,
  //     shouldLimit = false;
  //   const map = this._styleMap[lineIndex],
  //     mapNextLine = this._styleMap[lineIndex + 1];
  //   if (map) {
  //     lineIndex = map.line;
  //     offset = map.offset;
  //   }
  //   if (mapNextLine) {
  //     nextLineIndex = mapNextLine.line;
  //     shouldLimit = nextLineIndex === lineIndex;
  //     nextOffset = mapNextLine.offset;
  //   }
  //   const obj =
  //     typeof lineIndex === 'undefined'
  //       ? this.styles
  //       : { line: this.styles[lineIndex] };
  //   for (const p1 in obj) {
  //     for (const p2 in obj[p1]) {
  //       if (p2 >= offset && (!shouldLimit || p2 < nextOffset)) {
  //         // eslint-disable-next-line no-unused-vars
  //         for (const p3 in obj[p1][p2]) {
  //           return false;
  //         }
  //       }
  //     }
  //   }
  //   return true;
  // }

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
      // 检查单词是否全为拉丁字母，长度不大于13，且没有四个或更多的连续相同的字母
      if (
        /^[a-zA-Z]+$/.test(words[i]) &&
        words[i].length <= 13 &&
        !/(\w)\1{3,}/.test(words[i])
      ) {
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
  //     words = splitByGrapheme
  //       ? this.graphemeSplitForRectNotes(_line)
  //       : this.wordSplit(_line),
  //     infix = splitByGrapheme ? '' : ' ';

  //   let lineWidth = 0,
  //     line = [],
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
  //   const data = words.map((word) => {
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

  // /**
  //  * Detect if a line has a linebreak and so we need to account for it when moving
  //  * and counting style.
  //  * @return Number
  //  */
  // missingNewlineOffset(lineIndex) {
  //   if (this.splitByGrapheme) {
  //     return this.isEndOfWrapping(lineIndex) ? 1 : 0;
  //   }
  //   return 1;
  // }

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
  getCenteredTop(rectHeight: any) {
    const textHeight = this.height;
    return (rectHeight - textHeight) / 2;
  }

  _getTopOffset() {
    switch (this.verticalAlign) {
      case 'middle':
        return -this._getTotalLineHeights() / 2;
      case 'bottom':
        return this.height / 2 - this._getTotalLineHeights();
      default:
        return -this.height / 2;
    }
  }

  _getTotalLineHeight() {
    return this._textLines.reduce(
      (total, _line, index) => total + this.getHeightOfLine(index),
      0
    );
  }

  _getTotalLineHeights() {
    return this._textLines.reduce(
      (total, line, index) => total + this.getHeightOfLine(index),
      0
    );
  }

  _render(ctx: any) {
    const path: any = this.path;

    path && !path.isNotVisible() && path._render(ctx);
    this._setTextStyles(ctx);
    this._renderTextLinesBackground(ctx);
    this._renderTextDecoration(ctx, 'underline');
    this._renderText(ctx);
    this._renderTextDecoration(ctx, 'overline');
    this._renderTextDecoration(ctx, 'linethrough');

    // const isEmojiExist = !(
    //   this.emoji === undefined || this.emoji.join() === '0,0,0,0,0'
    // );
    // if (isEmojiExist) {
    //   this.renderEmoji(ctx);
    // }
  }

  // renderEmoji(ctx) {
  //   if (this.emoji === undefined) {
  //     return;
  //   }

  //   let width = 0;
  //   const imageList = [
  //     this.canvas.emoji_thumb,
  //     this.canvas.emoji_love,
  //     this.canvas.emoji_smile,
  //     this.canvas.emoji_shock,
  //     this.canvas.emoji_question,
  //   ];
  //   const imageListArray = [];
  //   const emojiList = [];
  //   for (let i = 0; i < 5; i++) {
  //     if (this.emoji[i] !== 0) {
  //       imageListArray.push(imageList[i]);
  //       emojiList.push(this.emoji[i]);
  //       width += 26.6;
  //     }
  //   }

  //   if (emojiList.length === 0) return;

  //   const x = this.width / 2 - width + this.padding / 2;
  //   const y = this.height / 2 - 18 + this.padding / 2;
  //   ctx.font = '10px Inter ';
  //   ctx.lineJoin = 'round';
  //   ctx.save();
  //   ctx.translate(x - 10, y);
  //   this.drawRoundRectPath(ctx, width, 15, 2);
  //   ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  //   ctx.fill();
  //   ctx.restore();

  //   //ctx.strokeRect(x - 10, y, width, 16);
  //   //ctx.fillRect(x - 10 + 10 / 2, y + 10 / 2, width - 10, 16 - 10);
  //   ctx.fillStyle = '#000';
  //   const isEmojiThumbExist = !(this.canvas.emoji_thumb === undefined);
  //   if (isEmojiThumbExist) {
  //     let modifier = 0;
  //     for (let i = 0; i < imageListArray.length; i++) {
  //       const imageX = this.width / 2 - 33.6 + modifier + 2 + this.padding / 2;
  //       const imageY = this.height / 2 - 15 + this.padding / 2;
  //       const imageW = 10;
  //       const imageH = 10;
  //       ctx.drawImage(imageListArray[i], imageX, imageY, imageW, imageH);
  //       ctx.fillText(
  //         emojiList[i].toString(),
  //         this.width / 2 - 20.6 + modifier + 1 + this.padding / 2,
  //         y + 12
  //       );
  //       modifier -= 23.6;
  //     }
  //   }
  // }
  _renderBackground(ctx: any) {
    if (!this.backgroundColor) {
      return;
    }
    const dim = this._getNonTransformedDimensions();
    ctx.fillStyle = this.backgroundColor;
    ctx.beginPath(); // start new path
    const radius =
      dim.x / 2 + this.padding / this.scaleX / (this.canvas?.getZoom() ?? 1);
    ctx.arc(0, 0, radius, 0, 2 * Math.PI); // draw circle path
    ctx.closePath(); // close path
    ctx.strokeStyle = this.backgroundColor;
    ctx.fillStyle = this.backgroundColor;
    ctx.stroke();
    ctx.fill();
  }
  _renderText(ctx: any) {
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
  _renderTextCommon(ctx: any, method: any) {
    ctx.save();
    let lineHeights = 0;
    const left = this._getLeftOffset();
    const top = this._getTopOffset();

    const offsets = this._applyPatternGradientTransform(
      ctx,
      //@ts-ignore
      method === 'fillText' ? this.fill : this.stroke
    );

    for (let i = 0, len = this._textLines.length; i < len; i++) {
      const heightOfLine = this.getHeightOfLine(i);
      const maxHeight = heightOfLine / this.lineHeight;
      const leftOffset = this._getLineLeftOffset(i);
      this._renderTextLine(
        method,
        ctx,
        this._textLines[i],
        left + leftOffset - offsets.offsetX,
        top + lineHeights + maxHeight - offsets.offsetY,
        i
      );
      lineHeights += heightOfLine;
    }
    ctx.restore();
  }

  _getSVGLeftTopOffsets() {
    return {
      textLeft: -this.width / 2,
      textTop: this._getTopOffset(),
      lineTop: this.getHeightOfLine(0),
    };
  }

  drawRoundRectPath(cxt: any, width: any, height: any, radius: any) {
    cxt.beginPath(0);
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

classRegistry.setClass(XCircleNotes);
classRegistry.setSVGClass(XCircleNotes, 'XCircleNotes');
