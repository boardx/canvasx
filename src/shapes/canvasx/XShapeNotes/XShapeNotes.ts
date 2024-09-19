import { classRegistry } from '../../../ClassRegistry';
import { getFabricDocument } from '../../../env';
import { TClassProperties, TFiller } from '../../../typedefs';
import { XTextbox } from '../XTextbox';

import { shapeList } from './types';
import { shapeType } from './types';

import { XObjectInterface } from '../XObjectInterface';
import { createShapeNotesDefaultControls } from '../../../controls/X_commonControls';

export type shapeInfo = {
  name: shapeType;
  path: string;
  offsetX: number;
  offsetY: number;
  verticalAlign: 'middle' | 'top' | 'bottom';
  textAlign: 'center' | 'left' | 'right';
  textMaxHeight?: number;
  textMaxWidth?: number;
};

function getShapeInfo(shape: string): shapeInfo | null {
  const shapeObj = shapeList.find((item) => item.name === shape);
  console.log('### shapeObj:', shapeObj);
  if (!shapeObj) {
    return shapeList[0] as shapeInfo;
  } else {
    return shapeObj as shapeInfo; // Update the type of shapeObj to shapeInfo
  }
}

export const XShapeNotesDefaultValues: Partial<TClassProperties<XShapeNotes>> =
  {
    minWidth: 20,
    minHeight: 20,
    dynamicMinWidth: 2,
    lockScalingFlip: true,
    noScaleCache: false,
    _wordJoiners: /[ \t\r]/,
    splitByGrapheme: true,
    objType: 'XShapeNotes',
    textAlign: 'center',
    centeredScaling: false,
    cornerColor: 'white',
    cornerStrokeColor: 'gray',
    cornerSize: 10,
    cornerStyle: 'circle',
    transparentCorners: false,
  };

interface XShapeNotesProps {
  shapeName: string;
  id: string;
  originX: string;
  originY: string;
  top: number;
  left: number;
  textAlign: string;
  width: number;
  height: number;
  backgroundColor: string;
  scaleX: number;
  scaleY: number;
  stroke: string;
  strokeWidth: number;
  zIndex: number;
  locked: boolean;
  boardId: string;
  userId: string;
  clientId: number;
  timestamp: number;
}

export class XShapeNotes extends XTextbox implements XObjectInterface {
  bgShape: shapeInfo | null;
  verticalAlign = 'middle';
  maxHeight: number = 138;
  minHeight: number = 20;

  static type = 'XShapeNotes';
  objType = 'XShapeNotes';

  constructor(text: string, options: Partial<XShapeNotesProps>) {
    super(text, options);

    this.bgShape = options.shapeName ? getShapeInfo(options.shapeName) : null;
    this.width = (options.width || 200) * (options.scaleX || 1);
    this.height = (options.height || 200) * (options.scaleY || 1);
    this.scaleX = 1;
    this.scaleY = 1;
    this.id = options.id || '';
    this.verticalAlign = this.bgShape?.verticalAlign || 'middle';
    this.textAlign = this.bgShape?.textAlign || 'center';

    this.resetSplitByGrapheme();
    Object.assign(this, {
      controls: { ...createShapeNotesDefaultControls(this) },
    });

    this.on('scaling', this.handleScaling);
    this.on('modified', this.handleModified);
    this.on('changed', this.handleModified);
  }
  extendedProperties = [
    'shapeName',
    'id',
    'objType',
    'zIndex',
    'locked',
    'boardId',
    'userId',
    'clientId',
    'timestamp',
  ];

  handleModified() {
    this.canvas!.uniformScaling = false;
    this.resetSplitByGrapheme();
    this.canvas!.renderAll();
  }

  resetSplitByGrapheme() {
    const chineseRegex = /[\u4e00-\u9fa5]/; // Regex to match Chinese characters
    const text = this.text;
    const includesChinese = chineseRegex.test(text);
    this.splitByGrapheme = includesChinese;
  }

  static ownDefaults: Record<string, any> = XShapeNotesDefaultValues;

  static getDefaults() {
    return {
      ...super.getDefaults(),

      ...XShapeNotes.ownDefaults,
    };
  }

  handleScaling(event: any) {
    this.canvas!.uniformScaling = false;

    const newScaleX = this.get('scaleX');
    const newScaleY = this.get('scaleY');

    this.width *= newScaleX;
    this.height *= newScaleY;

    if (this.width < this.minWidth) {
      this.width = this.minWidth;
    }
    if (this.height < this.minHeight) {
      this.height = this.minHeight;
    }

    this.set({
      scaleX: 1,
      scaleY: 1,
    });

    this.initDimensions();
    this.setCoords();
    this.dirty = true;
    this.canvas?.renderAll();
  }

  _renderBackground(ctx: any) {
    if (!this.backgroundColor) {
      return;
    }
    const dim = this._getNonTransformedDimensions();
    ctx.fillStyle = this.backgroundColor;

    ctx.save();

    const svgPath = new Path2D(this.bgShape?.path || '');
    const m = getFabricDocument()
      .createElementNS('http://www.w3.org/2000/svg', 'svg')
      .createSVGMatrix();
    m.a = this.width / 100;
    m.b = 0;
    m.c = 0;
    m.d = this.height / 100;
    m.e = 0;
    m.f = 0;
    const path = new Path2D();
    path.addPath(svgPath, m);
    ctx.strokeStyle = this.stroke;
    ctx.stroke(path);
    ctx.fillStyle = this.backgroundColor;
    ctx.fill(path);
    ctx.restore();
  }

  _getTopOffset() {
    switch (this.verticalAlign) {
      case 'middle':
        return -this._getTotalLineHeight() / 2;
      case 'bottom':
        return this.height / 2 - this._getTotalLineHeight();
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

  _renderTextCommon(ctx: any, method: any) {
    ctx.save();
    let lineHeights = 0;
    const left = this._getLeftOffset() + this.bgShape?.offsetX!;
    const top = this._getTopOffset() + this.bgShape?.offsetY!;
    const offsets = this._applyPatternGradientTransform(
      ctx,
      ((method === 'fillText' ? this.fill : this.stroke) as TFiller) ||
        this.fill!
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

  initDimensions() {
    if (!this.initialized) {
      return;
    }
    this.isEditing && this.initDelayedCursor();
    this._clearCache();
    this.dynamicMinWidth = 0;
    this._styleMap = this._generateStyleMap(this._splitText());
    if (this.dynamicMinWidth > this.width) {
      this.set('fontSize', this.fontSize - 2);
      this._splitTextIntoLines(this.text);
      return;
    }
    if (this.textAlign.indexOf('justify') !== -1) {
      this.enlargeSpaces();
    }
    const height = this.calcTextHeight();
    if (height > this.height && this.fontSize > 6) {
      this.set('fontSize', this.fontSize - 2);
      this._splitTextIntoLines(this.text);
      return;
    }

    return this.height;
  }

  _getTotalLineHeights() {
    return this._textLines.reduce(
      (total, _line, index) => total + this.getHeightOfLine(index),
      0
    );
  }

  graphemeSplitForRectNotes(textstring: string): string[] {
    const graphemes = [];
    const words = textstring.split(/\b/);
    for (let i = 0; i < words.length; i++) {
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
}

classRegistry.setClass(XShapeNotes);
