import { classRegistry } from '../../../ClassRegistry';
import { Shadow } from '../../../Shadow';
import { getFabricWindow } from '../../../env';
import { loadImage } from '../../../util/misc/objectEnlive';

import { ImageProps } from '../../Image';
import { FabricObject } from '../../Object/FabricObject';
import { Rect } from '../../Rect';

import { WidgetMenuList } from '../MenuType';
import { XObjectInterface } from '../XObjectInterface';

export type XURLProps = ImageProps & {
  id: string;
  text: string;
  transcription: string;
  vectorSrc: string;
  fileSrc: string;
  fileName: string;
  description: string;
  previewImage: string;
  userId: string;
  clientId: number;
  zIndex: number;
  locked: boolean;
  boardId: string;
};

export const XURLDefaultValues: Partial<XURLProps> = {
  originX: 'center',
  originY: 'center',
  cornerColor: 'white',
  cornerStrokeColor: 'gray',
  cornerSize: 10,
  cornerStyle: 'circle',
  transparentCorners: false,
};

export class XURL extends FabricObject implements XObjectInterface {
  static objType = 'XURL';
  static type = 'XURL';
  transcription: string;
  vectorSrc: string;
  fileSrc: string;
  fileName: string;
  previewImage: string;
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
  constructor(options: Partial<XURLProps>) {
    super(options);

    const previewImage = options.previewImage
      ? options.previewImage
      : '/fileIcons/weblink.png'; //this.getFileIconURL(options.fileName!);

    this.set('id', options.id || '');
    this.set('fileName', options.fileName || '');
    this.set('transcription', options.transcription || '');
    this.set('vectorSrc', options.vectorSrc || '');
    this.set('fileSrc', options.fileSrc || '');
    this.set('previewImage', previewImage || '');
    this.set('description', options.description || '');
    this.set('userId', options.userId || '');
    this.set('clientId', options.clientId || 0);
    this.set('zIndex', options.zIndex || 0);
    this.set('locked', options.locked || false);
    this.set('boardId', options.boardId || '');

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
    this.loadPreviewImage(previewImage, options.fileName!);
  }

  getContextMenuList() {
    let menuList;
    if (this.locked) {
      menuList = [
        'Bring forward',
        'Bring to front',
        'Send backward',
        'Send to back',
      ];
    } else {
      menuList = [
        'Bring forward',
        'Bring to front',
        'Send backward',
        'Send to back',
        'Duplicate',
        'Copy',
        'Paste',
        'Cut',
        'Delete',
      ];
    }

    if (this.locked) {
      menuList.push('Unlock');
    } else {
      menuList.push('Lock');
    }
    return menuList;
  }

  // static getDefaults() {
  //   return {
  //     ...super.getDefaults(),
  //     ...XFile.ownDefaults,
  //     ...XFileDefaultValues,
  //   };
  // }
  toObject(propertiesToInclude: Array<any>): any {
    return super.toObject([...this.extendedProperties, ...propertiesToInclude]);
  }
  onDoubleClick() {
    getFabricWindow().open(this.fileSrc, '_blank');
  }
  getWidgetMenuList(): WidgetMenuList {
    const menuList: WidgetMenuList = [];
    if (this.locked) {
      menuList.push('objectLock');
    } else {
      menuList.push('more');
      menuList.push('objectLock');
      menuList.push('delete');
      menuList.push('fileName');
      menuList.push('borderLineIcon');
    }
    return menuList;
  }
  getWidgetMenuLength() {
    if (this.locked) return 50;
    return 60;
  }

  drawObject(ctx: CanvasRenderingContext2D) {
    let elementToDraw = null;
    // draw border
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0)';
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

    // if (this.fileName.substring(this.fileName.lastIndexOf('.') + 1) !== FileEmum.PDF) {
    this.renderTitle(ctx, this.fileName);
    // }
    this._renderStroke(ctx);
  }
  private drawPreviewImage(
    ctx: CanvasRenderingContext2D,
    imgWidth: number,
    imgHeight: number
  ) {
    const previewImage = this._previewImage!;
    const imageRatio = previewImage.width / previewImage.height;
    const canvasRatio = imgWidth / imgHeight;

    let drawWidth = imgWidth;
    let drawHeight = imgHeight;
    let drawX = -this.width / 2;
    let drawY = -this.height / 2;

    if (imageRatio > canvasRatio) {
      // Image is wider than the canvas
      drawHeight = imgWidth / imageRatio;
      drawY += (imgHeight - drawHeight) / 2;
    } else {
      // Image is taller than the canvas
      drawWidth = imgHeight * imageRatio;
      drawX += (imgWidth - drawWidth) / 2;
    }

    ctx.drawImage(previewImage, drawX, drawY, drawWidth, drawHeight);
  }

  renderTitle(ctx: any, title: string) {
    const maxWidth = this.width;
    const x = -this.width / 2;
    const y = this.height / 2 - 60;

    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';

    // white board behind the title
    ctx.fillRect(x, y - 29, maxWidth, 90);
    ctx.fillStyle = '#190FA1';

    // helper function to convert string
    const GB2312UnicodeConverter = {
      ToUnicode(str: string) {
        return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
      },
      ToGB2312(str: string) {
        return unescape(str.replace(/\\u/gi, '%u'));
      },
    };
    // Handle non-unicode or non-utf8 coding string
    const unicodeTitle = GB2312UnicodeConverter.ToUnicode(title);

    // handle the situation that the website's title is null
    if (title === null || unicodeTitle.indexOf('\\ufffd') !== -1 || !title) {
      const firstChar = this.fileSrc.indexOf('.');
      const lastChar = this.fileSrc.indexOf('.', firstChar + 1);
      this.fileName = this.fileSrc.substring(firstChar + 1, lastChar);
    }

    // title setting
    this.wrapText(ctx, title, x + 15, y - 5, maxWidth - 20, 23);

    // url setting
    const newurl = this.fileSrc
      ? `${this.fileSrc.split('/')[0]}/${this.fileSrc.split('/')[1]}/${
          this.fileSrc.split('/')[2]
        }`
      : '';
    ctx.font = '12px Inter';
    ctx.fillStyle = 'rgba(35, 41, 48, 0.65)';
    // gray square in front of website
    this.wrapText(ctx, newurl, x + 15, y + 45, maxWidth - 20, 25);
  }

  // changeFileImgUrl(targetSrc: string) {
  //   this.setSrc(targetSrc, { crossOrigin: 'anonymous' });
  // }

  wrapText(
    context: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    let words: any = [];
    if (text) words = text.split(' ');

    let line = '';
    let lineCount = 1;
    let tempLine = '';
    let _y = y;

    // handle non-English char
    if (escape(text).indexOf('%u') < 0) {
      // only the English char
      for (let n = 0; n < words.length; n++) {
        if (lineCount === 3) return;
        if (n !== 0) tempLine = `${line.slice(0, -3)}...`;
        const testLine = `${line + words[n]} `;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          if (lineCount === 2) {
            line = tempLine;
          }
          context.fillText(line, x, _y);
          line = `${words[n]} `;
          _y += lineHeight;
          lineCount++;
        } else {
          line = testLine;
        }
      }
    } else {
      for (let n = 0; n < text.length; n++) {
        if (lineCount === 3) return;
        if (n !== 0) tempLine = `${line.slice(0, -2)}...`;
        const testLine = `${line + text[n]}`;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          if (lineCount === 2) {
            line = tempLine;
          }
          context.fillText(line, x, _y);
          line = `${text[n]}`;
          _y += lineHeight;
          lineCount++;
        } else {
          line = testLine;
        }
      }
    }
    if (lineCount < 3) context.fillText(line, x, _y);
  }

  async loadPreviewImage(previewImage: string, fileName: string) {
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
