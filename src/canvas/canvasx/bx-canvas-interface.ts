import { Group } from '../../shapes/Group';
import { FabricObject } from '../../shapes/Object/Object';
import { TMat2D } from '../../typedefs';
import { WBCanvas } from './bx-canvas';
import { ActiveSelection } from '../../shapes/ActiveSelection';
import type { XY } from '../../Point';

export interface BXCanvasInterface {
  mouse: any;
  stopAnimateObjectToPositionStatus: boolean;
  stopAnimateToRectStatus: boolean;
  anyChanges: boolean;
  thumbnail: string;
  toUpdateObjectRemote: any[];
  lastMouseData: any;
  toUpdateNewObjectRemote: any[];
  toUpdateRemovedObjectRemote: any[];
  showBackgroundDots: boolean;
  previousViewportTransform: TMat2D;
  zoomToViewAllObjects(): void;
  zoomToViewObjects(objs: any[]): void;
  zoomToCenterPoint(vpCenter: { x: number; y: number }, zoom: number): void;
  recoverViewportTransformation(baordId: string): void;
  gobackToPreviousViewport(): void;
  updateViewportToLocalStorage(vpt: TMat2D): void;

  getObjectsAroundPointByDistance(point: XY): FabricObject[];

  InitializeCanvas(): void;
  animateToRectForSlide(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any
  ): void;
  animateObjectToPosition(
    currentObj: any, // The object we want to animate
    left: number, // The desired left-offset for the object after the animation
    top: number // The desired top-offset for the object after the animation
  ): void;
  stopAnimateObjectToPosition(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    canvas: WBCanvas
  ): void;

  animateToRect(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    canvas: WBCanvas
  ): void;

  animateToVpt(vpt: any, vpCenter: any, canvas: WBCanvas): void;
  zoomToObject(obj: FabricObject, canvas: WBCanvas): void;
  zoomToCenterPoint(vpCenter: { x: number; y: number }, zoom: number): void;
  updateViewport(): void;

  onObjectModifiedUpdateArrowsSave(
    object: FabricObject,
    canvas: WBCanvas
  ): void;

  onRefreshArrowAfterScale(arrowId: string): FabricObject;
  resetConnector(object: FabricObject, canvas: WBCanvas): void;

  onObjectModifiedUpdateArrowsSave(
    object: FabricObject,
    canvas: WBCanvas
  ): void;
  onRefreshArrowAfterScale(arrowId: string, canvas: WBCanvas): void;

  onRefreshArrowAfterScale(arrowId: string, canvas: WBCanvas): void;
  onObjectModifyUpdateArrows(object: FabricObject): void;
  onObjectMoveUpdateArrowsSave(object: FabricObject): void;
  updateConnectorsRemovedWidget(obj: FabricObject): void;
  updateWhiteboardThumbnail(): void;

  zindexArrBetween(lowz: number, highz: number, size: number): number[];
  createUniqueZIndex(inputZindex: number, tohigher: number): number;
  createTopZIndex(): number;
  sortByZIndex(): void;
  _getIntersectedObjects(object: FabricObject): FabricObject[];
  getTopObjectByPointer(
    point: XY,
    ismouseup: boolean,
    isFrom: string
  ): FabricObject | null;

  uploadFilesToWhiteboard(
    files: FileList,
    left: number,
    top: number,
    useFileName: string
  ): void;

  ungroup(object: Group): Promise<void>;
  group(group: ActiveSelection): Promise<void>;
  alignGroupObjects(curentObject: FabricObject, alignment: AlignmentType): void;
  bindGroup(objectArr: [], callback: () => void): void;

  resetBackgoundImage(): void;
  checkIfResetBackground(): void;

  getNextObjectByPoint(point: XY, width: number, height: number): any;
  getObjectsAroundPointByDistance(point: XY): FabricObject[];
  getObjectsAroundObjectByDistance(object: FabricObject): any[];
  getPositionOnScreenFromCanvas(left: number, top: number): XY;
  getPositionOnCanvas(left: number, top: number): XY;

  syncObjectChangeToRemote(id: string, data: any): void;
  syncRemovedObjectToRemote(id: string): void;
  syncNewObjectToRemote(data: any): void;
  animateToRectWithOffset(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    widthOffset: number,
    heightOffset: number
  ): void;
  removeById(id: string): void;
  selectAllWidgets(): void;
  resetCoordsOnScreen(): void;
  getCenterPointOfScreen(): { x: number; y: number };
  getAbsoluteCoords(object: any): { left: number; top: number };
  getCurCanvasSize(): any;
  getContentArea(): any;
  toDataURLContent(multiplier: number): string;
  captureThumbnail(): string;
  getObjectByID(id: string): any;
  getMyLastAddedObject(objType: string): any;
  loadData(widgets: any[]): Promise<boolean>;
  planNewLayout(objects: any[], numOfColumns: number): void;
  clearData(): void;
  getNewPositionNextToActiveObject(direction: string): { x: number; y: number };
  translateWidget(language: string): Promise<void>;
  duplicateWidget(direction: string): Promise<void>;
  findById(id: string): FabricObject | null;
}
export type AlignmentType =
  | 'VLeft'
  | 'VRight'
  | 'VCenter'
  | 'DistrH'
  | 'HTop'
  | 'HBottom'
  | 'HCenter'
  | 'DistrV';
