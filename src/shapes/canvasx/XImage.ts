import type { BaseFilter } from '../../filters/BaseFilter';
import { SHARED_ATTRIBUTES } from '../../parser/attributes';
import { TSize } from '../../typedefs';
import { findScaleToCover, findScaleToFit } from '../../util/misc/findScaleTo';
import { parsePreserveAspectRatioAttribute } from '../../util/misc/svgParsing';
import { classRegistry } from '../../ClassRegistry';
import { TOptions } from '../../typedefs';
import type { FabricObjectProps, SerializedObjectProps } from '../Object/types';
import type { ObjectEvents } from '../../EventTypeDefs';
// @todo Would be nice to have filtering code not imported directly.

import { WidgetImageInterface, EntityKeys } from './type/widget.entity.image';
import { FabricImage } from '../Image';
import { WidgetType } from './type/widget.type';
import { FileObject } from './type/file';


export type ImageSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement;

interface UniqueImageProps {
  srcFromAttribute: boolean;
  minimumScaleTrigger: number;
  cropX: number;
  cropY: number;
  imageSmoothing: boolean;
  crossOrigin: string | null;
  filters: BaseFilter[];
  resizeFilter?: BaseFilter;
}

export const imageDefaultValues: Partial<UniqueImageProps> &
  Partial<FabricObjectProps> = {
  strokeWidth: 0,
  srcFromAttribute: false,
  minimumScaleTrigger: 0.5,
  cropX: 0,
  cropY: 0,
  imageSmoothing: true,
  crossOrigin: 'anonymous',
  originX: 'center',
  originY: 'center',
};

export interface SerializedImageProps extends SerializedObjectProps {
  src: string;
  crossOrigin: string | null;
  filters: any[];
  resizeFilter?: any;
  cropX: number;
  cropY: number;
}

export interface ImageProps extends FabricObjectProps, UniqueImageProps { }

const IMAGE_PROPS = ['cropX', 'cropY'] as const;

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#images}
 */
export class XImage<
  Props extends TOptions<ImageProps> = Partial<ImageProps>,
  SProps extends SerializedImageProps = SerializedImageProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricImage implements WidgetImageInterface {

  cropWidth: number;
  cropHeight: number;
  previewImage: FileObject;
  imageSrc: FileObject;
  version: string;
  updatedAt: number;
  lastEditedBy: string;
  createdAt: number;
  createdBy: string;
  boardId: string;
  objType: WidgetType;
  userId: string;
  zIndex: number;
  /* boardx cusotm function */

  static type: WidgetType = 'XImage';
  static objType: WidgetType = 'XImage';

  constructor(image: any, options: any) {
    super(image, options);
    Object.assign(this, options);

  }
  markdownText: string;
  lastEditedByName: string;
  createdByName: string;


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
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = this.imageSmoothing;
    if (this.isMoving !== true && this.resizeFilter && this._needsResize()) {
      this.applyResizeFilters();
    }
    this._stroke(ctx);
    this._renderPaintInOrder(ctx);
    //this.resizeImageAccordingToZoomAndOnScreen();
  }

  /**
   * Decide if the object should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * This is the special image version where we would like to avoid caching where possible.
   * Essentially images do not benefit from caching. They may require caching, and in that
   * case we do it. Also caching an image usually ends in a loss of details.
   * A full performance audit should be done.
   * @return {Boolean}
   */
  shouldCache() {
    return this.needsItsOwnCache();
  }

  /**
   * needed to check if image needs resize
   * @private
   */
  _needsResize() {
    const scale = this.getTotalObjectScaling();
    return scale.x !== this._lastScaleX || scale.y !== this._lastScaleY;
  }

  /**
   * @private
   * @deprecated unused
   */
  _resetWidthHeight() {
    this.set(this.getOriginalSize());
  }

  /**
   * @private
   * Set the width and the height of the image object, using the element or the
   * options.
   */
  _setWidthHeight({ width, height }: Partial<TSize> = {}) {
    const size = this.getOriginalSize();
    this.width = width || size.width;
    this.height = height || size.height;
  }

  /**
   * Calculate offset for center and scale factor for the image in order to respect
   * the preserveAspectRatio attribute
   * @private
   */
  parsePreserveAspectRatioAttribute() {
    const pAR = parsePreserveAspectRatioAttribute(
      this.preserveAspectRatio || ''
    ),
      pWidth = this.width,
      pHeight = this.height,
      parsedAttributes = { width: pWidth, height: pHeight };
    let rWidth = this._element.width,
      rHeight = this._element.height,
      scaleX = 1,
      scaleY = 1,
      offsetLeft = 0,
      offsetTop = 0,
      cropX = 0,
      cropY = 0,
      offset;

    if (pAR && (pAR.alignX !== 'none' || pAR.alignY !== 'none')) {
      if (pAR.meetOrSlice === 'meet') {
        scaleX = scaleY = findScaleToFit(this._element, parsedAttributes);
        offset = (pWidth - rWidth * scaleX) / 2;
        if (pAR.alignX === 'Min') {
          offsetLeft = -offset;
        }
        if (pAR.alignX === 'Max') {
          offsetLeft = offset;
        }
        offset = (pHeight - rHeight * scaleY) / 2;
        if (pAR.alignY === 'Min') {
          offsetTop = -offset;
        }
        if (pAR.alignY === 'Max') {
          offsetTop = offset;
        }
      }
      if (pAR.meetOrSlice === 'slice') {
        scaleX = scaleY = findScaleToCover(this._element, parsedAttributes);
        offset = rWidth - pWidth / scaleX;
        if (pAR.alignX === 'Mid') {
          cropX = offset / 2;
        }
        if (pAR.alignX === 'Max') {
          cropX = offset;
        }
        offset = rHeight - pHeight / scaleY;
        if (pAR.alignY === 'Mid') {
          cropY = offset / 2;
        }
        if (pAR.alignY === 'Max') {
          cropY = offset;
        }
        rWidth = pWidth / scaleX;
        rHeight = pHeight / scaleY;
      }
    } else {
      scaleX = pWidth / rWidth;
      scaleY = pHeight / rHeight;
    }
    return {
      width: rWidth,
      height: rHeight,
      scaleX,
      scaleY,
      offsetLeft,
      offsetTop,
      cropX,
      cropY,
    };
  }

  /**
   * Default CSS class name for canvas
   * @static
   * @type String
   * @default
   */
  static CSS_CANVAS = 'canvas-img';

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Image.fromElement})
   * @static
   * @see {@link http://www.w3.org/TR/SVG/struct.html#ImageElement}
   */
  static ATTRIBUTE_NAMES = [
    ...SHARED_ATTRIBUTES,
    'x',
    'y',
    'width',
    'height',
    'preserveAspectRatio',
    'xlink:href',
    'crossOrigin',
    'image-rendering',
  ];

  _stopEvent(e: any) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }

  cloneWidget() {
    return this.toObject();
  }
}

classRegistry.setClass(XImage);
classRegistry.setSVGClass(XImage);
