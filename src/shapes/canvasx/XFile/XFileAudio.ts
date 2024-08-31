import { XFile } from './XFile';
import { XFileProps } from './XFile';
import { classRegistry } from '../../../ClassRegistry';

export class XFileAudio extends XFile {
  constructor(options: Partial<XFileProps>) {
    super(options);
    this.type = 'XFileAudio';
    this.objType = 'XFileAudio';
  }
}
classRegistry.setClass(XFileAudio);
