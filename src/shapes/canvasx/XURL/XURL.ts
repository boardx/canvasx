import { classRegistry } from '../../../ClassRegistry';
import { Shadow } from '../../../Shadow';
import { getFabricWindow } from '../../../env';
import { loadImage } from '../../../util/misc/objectEnlive';

import { ImageProps } from '../../Image';
import { FabricObject } from '../../Object/FabricObject';
import { Rect } from '../../Rect';
import { FileObject } from '../type/file';

import { WidgetURLInterface, EntityKeys } from '../type/widget.entity.url';
import { WidgetType } from '../type/widget.type';

export type XURLProps = ImageProps & WidgetURLInterface;

export const XURLDefaultValues: Partial<XURLProps> = {
  originX: 'center',
  originY: 'center',
  cornerColor: 'white',
  cornerStrokeColor: 'gray',
  cornerSize: 10,
  cornerStyle: 'circle',
  transparentCorners: false,
};

export class XURL extends FabricObject implements WidgetURLInterface {
  static objType = 'XURL';
  static type = 'XURL';
  transcription: string;

  _previewImage: HTMLImageElement | null = null;

  public extendedProperties = [
    'id',
    'objType',
    'fileName',
    'transcription',
    'vectorSrc',
    'fileSrc',
    'previewImage',
    'description',
    'userId',
    'clientId',
    'zIndex',
    'locked',
    'boardId',
  ];
  constructor(url: any, options: Partial<XURLProps>) {
    super(options);

    const previewImageURL = options.previewImage?.tmpPath
      ? options.previewImage?.tmpPath
      : '/boardxstatic/fileIcons/weblink.png';

    Object.assign(this, options);

    this.on('mousedblclick', this.onDoubleClick.bind(this));
    this.objType = 'XURL';

    (this.cornerColor = 'white'),
      (this.cornerStrokeColor = 'gray'),
      (this.cornerSize = 15),
      (this.cornerStyle = 'circle'),
      (this.transparentCorners = false),
      (this.shadow = new Shadow({
        color: 'rgba(217, 161, 177, 0.54)',
        offsetX: 1,
        offsetY: 2,
        blur: 4,
        id: 310,
      }));
    this.clipPath = new Rect({
      left: 0,
      top: 0,
      rx: 8,
      ry: 8,
      width: 230,
      height: 248,
      fill: '#000000',
    });
    this.width = 230;
    this.height = 248;
    this.loadPreviewImage(previewImageURL!);
  }
  url: string;
  updatedBy: string;
  updatedByName: string;

  createdByName: string;
  vectorSrc: FileObject;
  fileSrc: FileObject;
  fileName: string;
  previewImage: FileObject;
  boardId: string;
  objType: WidgetType;
  userId: string;
  zIndex: number;
  version: string;
  updatedAt: number;

  createdAt: number;
  createdBy: string;

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

  toObject(propertiesToInclude: Array<any>): any {
    return super.toObject([...this.extendedProperties, ...propertiesToInclude]);
  }
  onDoubleClick() {
    getFabricWindow().open(this.url, '_blank');
  }

  drawObject(ctx: CanvasRenderingContext2D) {
    // Draw solid background to eliminate transparency
    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF'; // Set to white or any preferred color
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.lineWidth = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.moveTo(-this.width / 2, -this.height / 2);
    ctx.stroke();

    const imgWidth = 230;
    const imgHeight = 160;

    if (this._previewImage) {
      this.drawPreviewImage(ctx, imgWidth, imgHeight);
    }

    this.renderTitle(ctx, this.fileName);
    this._renderStroke(ctx);
  }

  private drawPreviewImage(
    ctx: CanvasRenderingContext2D,
    imgWidth: number,
    imgHeight: number
  ) {
    const previewImage = this._previewImage!;
    const imageWidth = previewImage.width;
    const imageHeight = previewImage.height;

    // Calculate aspect ratios
    const imageAspect = imageWidth / imageHeight;
    const canvasAspect = imgWidth / imgHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imageAspect > canvasAspect) {
      // Image is wider than canvas aspect ratio
      drawHeight = imgHeight;
      drawWidth = imageAspect * imgHeight;
      offsetX = (imgWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller than canvas aspect ratio
      drawWidth = imgWidth;
      drawHeight = imgWidth / imageAspect;
      offsetX = 0;
      offsetY = (imgHeight - drawHeight) / 2;
    }

    ctx.save();

    // Set clipping region to the image area
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, imgWidth, imgHeight);
    ctx.clip();

    // Draw the image within the clipping region
    ctx.drawImage(
      previewImage,
      -this.width / 2 + offsetX,
      -this.height / 2 + offsetY,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }

  renderTitle(ctx: any, title: string) {
    const maxWidth = this.width;
    const x = -this.width / 2;
    const y = this.height / 2 - 60;

    // Set font styles
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';

    // White background behind the title
    ctx.fillRect(x, y - 29, maxWidth, 90);
    ctx.fillStyle = '#190FA1';

    // Handle null or empty title
    if (!title && this.fileSrc?.tmpPath) {
      const firstChar = this.fileSrc?.tmpPath.indexOf('.');
      const lastChar = this.fileSrc?.tmpPath.indexOf('.', firstChar + 1);
      title = this.fileSrc?.tmpPath.substring(firstChar + 1, lastChar);
    }

    // Title rendering
    this.wrapText(ctx, title, x + 15, y - 5, maxWidth - 20, 23);

    // URL rendering
    const newurl = this.fileSrc && this.fileSrc?.tmpPath
      ? `${this.fileSrc?.tmpPath.split('/')[0]}/${this.fileSrc.tmpPath.split('/')[1]
      }/${this.fileSrc?.tmpPath.split('/')[2]}`
      : '';
    ctx.font = '12px Inter';
    ctx.fillStyle = 'rgba(35, 41, 48, 0.65)';
    this.wrapText(ctx, newurl, x + 15, y + 45, maxWidth - 20, 25);
  }

  wrapText(
    context: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    let line = '';
    let lineCount = 0;
    const chars = text.split('');
    for (let n = 0; n < chars.length; n++) {
      const testLine = line + chars[n];
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        if (lineCount === 2) {
          line = line.substring(0, line.length - 3) + '...';
          context.fillText(line, x, y);
          return;
        }
        context.fillText(line, x, y);
        line = chars[n];
        y += lineHeight;
        lineCount++;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  async loadPreviewImage(previewImage: string) {
    const url = previewImage;

    const loadedImg = await loadImage(url, {
      crossOrigin: 'anonymous',
    });
    this._previewImage = loadedImg;
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }
}

classRegistry.setClass(XURL);
