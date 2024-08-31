import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFileExcel extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFileExcel';
    this.objType = 'XFileExcel';
  }
}
classRegistry.setClass(XFileExcel);
