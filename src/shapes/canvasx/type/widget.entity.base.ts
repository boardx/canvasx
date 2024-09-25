import { WidgetType } from './widget.type';

export interface WidgetBaseInterface {
  id: string;
  boardId: string;
  backgroundColor: string;
  width: number;
  height: number;
  left: number;
  top: number;
  locked: boolean;
  objType: WidgetType;
  originX: TOriginX;
  originY: TOriginY;
  scaleX: number;
  scaleY: number;
  selectable: boolean;
  zIndex: number;
  version: string;
  updatedAt: number;
  updatedBy: string;
  updatedByName: string;
  createdAt: number;
  createdBy: string;
  createdByName: string;
  visible: boolean;
}

export type TOriginX = 'center' | 'left' | 'right' | number;
export type TOriginY = 'center' | 'top' | 'bottom' | number;
