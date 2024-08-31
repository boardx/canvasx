import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFileZip extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFileZip';
    this.objType = 'XFileZip';
  }
}

classRegistry.setClass(XFileZip);
