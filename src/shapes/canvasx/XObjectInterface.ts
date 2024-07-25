export interface XObjectInterface {
  //canvasx specific
  id: string;
  objType: string;
  userId: string;
  clientId: number;
  zIndex: number;
  boardId: string;
  locked: boolean;

  extendedProperties: string[];

  getWidgetMenuList(): string[];
  getWidgetMenuLength(): number;
  getContextMenuList(): string[];
}
