import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFileWord extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFileWord';
    this.objType = 'XFileWord';
  }
}

classRegistry.setClass(XFileWord);
