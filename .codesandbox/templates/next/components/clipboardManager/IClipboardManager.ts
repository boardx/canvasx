import { ClipboardData } from './ClipboardData';
export interface IClipboardManager {
  copy(data: ClipboardData, canvas: any): any;
  paste(data: any, canvas: any): any;
  clear(): void;
}
