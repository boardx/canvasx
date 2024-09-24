import { classRegistry } from '../../../ClassRegistry';
import { getFabricDocument } from '../../../env';
import { TClassProperties, TFiller } from '../../../typedefs';
import { XTextbox } from '../XTextbox';

import { shapeList } from './types';
import { shapeType } from './types';

import { WidgetShapeNotesInterface, EntityKeys } from '../type/widget.entity.shapenote';
import { createShapeNotesDefaultControls } from '../../../controls/X_commonControls';
import { WidgetType } from '../type/widget.type';



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

  if (!shapeObj) {
    return shapeList[0] as shapeInfo;
  } else {
    return shapeObj as shapeInfo; // Update the type of shapeObj to shapeInfo
  }
}

export const XShapeNotesDefaultValues: Partial<TClassProperties<XShapeNotes>> =
{

};


export class XShapeNotes extends XTextbox implements WidgetShapeNotesInterface {
  static type: WidgetType = 'XShapeNotes';
  static objType: WidgetType = 'XShapeNotes';

  bgShape: shapeInfo | null;
  verticalAlign: string;
  maxHeight: number;
  minHeight: number;
  shapeName: shapeType;


  constructor(text: string, options: Partial<WidgetShapeNotesInterface>) {
    super(text, options);
    this.bgShape = options.shapeName ? getShapeInfo(options.shapeName) : null;
    this.width = (options.width || 200) * (options.scaleX || 1);
    this.height = (options.height || 200) * (options.scaleY || 1);
    this.scaleX = 1;
    this.scaleY = 1;
    this.id = options.id || '';
    this.verticalAlign = this.bgShape?.verticalAlign || 'middle';
    this.textAlign = this.bgShape?.textAlign || 'center';
    this.shapeName = options.shapeName || 'rect';
    this.fontSize = options.fontSize || 14;
    this.fontFamily = options.fontFamily || 'Inter';
    this.fontWeight = options.fontWeight || 'normal';
    this.lineHeight = options.lineHeight || 1.5;
    this.text = text;

    this.minWidth = 20;
    this.minHeight = 20;
    this.dynamicMinWidth = 2;
    this.lockScalingFlip = true;
    this.noScaleCache = false;
    this._wordJoiners = /[ \t\r]/;
    this.splitByGrapheme = true;
    this.objType = 'XShapeNotes';
    this.textAlign = 'center';
    this.centeredScaling = false;
    this.cornerColor = 'white';
    this.cornerStrokeColor = 'gray';
    this.cornerSize = 10;
    this.cornerStyle = 'circle';
    this.transparentCorners = false;
    this.verticalAlign = 'middle';

    this.maxHeight = options.maxHeight || 138;

    this.resetSplitByGrapheme();
    Object.assign(this, {
      controls: { ...createShapeNotesDefaultControls(this) },
    });

    this.on('scaling', this.handleScaling);
    this.on('modified', this.handleModified);
    this.on('changed', this.handleModified);
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
