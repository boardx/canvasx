import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFileVideo extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFileVideo';
    this.objType = 'XFileVideo';
  }
}

classRegistry.setClass(XFileVideo);
