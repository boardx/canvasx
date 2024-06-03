import { FabricImage } from '../../Image';

import { ImageProps } from '../../Image';

export type XFileProps = ImageProps & {
  id: string;
};

export const XFileDefaultValues: Partial<XFileProps> = {
  originX: 'center',
  originY: 'center',
};

export class XFile extends FabricImage {
  fileSrc: string = '';

  constructor(src: string, options: Partial<XFileProps>) {
    super(src, options);
    this.set('id', options.id || '');
    this.set('scaleX', 1);
    this.set('scaleY', 1);
    this.set('width', options.width || 200);
    this.set('height', options.height || 200);
    this.set('minWidth', 20);
    this.set('minHeight', 20);
    this.set('maxWidth', 138);
    this.set('maxHeight', 138);
    this.set('verticalAlign', 'middle');
    this.set('textAlign', 'center');
    this.set('originX', 'center');
    this.set('originY', 'center');
  }

  static ownDefaults: Record<string, any> = XFileDefaultValues;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...XFile.ownDefaults,
    };
  }
}
