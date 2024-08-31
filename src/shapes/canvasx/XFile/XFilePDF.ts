import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFilePDF extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFilePDF';
    this.objType = 'XFilePDF';
  }
}
classRegistry.setClass(XFilePDF);
