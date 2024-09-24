import { WidgetType } from './widget.type';

export interface WidgetBaseInterface {
  id: string;
  boardId: string;
  backgroundColor: string;
  width: number;
  height: number;
  left: number;
  locked: boolean;
  objType: WidgetType;
  originX: TOriginX;
  originY: TOriginY;
  scaleX: number;
  scaleY: number;
  selectable: boolean;
  top: number;
  userId: string;
  zIndex: number;
  version: string;
  updatedAt: number;
  lastEditedBy: string;
  createdAt: number;
  createdBy: string;
  visible: boolean;
}

export type TOriginX = 'center' | 'left' | 'right' | number;
export type TOriginY = 'center' | 'top' | 'bottom' | number;
