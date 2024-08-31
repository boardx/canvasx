import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFilePPT extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFilePPT';
    this.objType = 'XFilePPT';
  }
}

classRegistry.setClass(XFilePPT);
