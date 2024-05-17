import {
  ActiveSelection,
  Canvas,
  FabricObject,
  FabricObjectProps,
  ObjectEvents,
  SerializedObjectProps,
  TMat2D,
  XY,
} from '../../../fabric';
import { AlignmentType, BXCanvasInterface } from './bx-canvas-interface';
import { Group } from '../../shapes/Group';

export class WBCanvas extends Canvas implements BXCanvasInterface {
  zoomToViewAllObjects(): void {
    throw new Error('Method not implemented.');
  }

  zoomToViewObjects(objs: any[]): void {
    throw new Error('Method not implemented.');
  }
  recoverViewportTransformation(baordId: string): void {
    throw new Error('Method not implemented.');
  }
  gobackToPreviousViewport(): void {
    throw new Error('Method not implemented.');
  }
  updateViewportToLocalStorage(vpt: TMat2D): void {
    throw new Error('Method not implemented.');
  }
  mouse: any;
  InitializeCanvas(): void {
    throw new Error('Method not implemented.');
  }
  previousViewportTransform: TMat2D;
  animateToRectWithOffset(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    widthOffset: number,
    heightOffset: number
  ): void {
    throw new Error('Method not implemented.');
  }
  findById(
    id: string
  ): FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  > | null {
    throw new Error('Method not implemented.');
  }

  showBackgroundDots: boolean;

  toUpdateNewObjectRemote: any[];
  toUpdateRemovedObjectRemote: any[];
  syncObjectChangeToRemote(id: string, data: any): void {
    throw new Error('Method not implemented.');
  }
  syncRemovedObjectToRemote(id: string): void {
    throw new Error('Method not implemented.');
  }
  syncNewObjectToRemote(data: any): void {
    throw new Error('Method not implemented.');
  }
  removeById(id: string): void {
    throw new Error('Method not implemented.');
  }
  selectAllWidgets(): void {
    throw new Error('Method not implemented.');
  }
  resetCoordsOnScreen(): void {
    throw new Error('Method not implemented.');
  }
  getCenterPointOfScreen(): { x: number; y: number } {
    throw new Error('Method not implemented.');
  }
  getAbsoluteCoords(object: any): { left: number; top: number } {
    throw new Error('Method not implemented.');
  }
  getCurCanvasSize() {
    throw new Error('Method not implemented.');
  }
  getContentArea() {
    throw new Error('Method not implemented.');
  }
  toDataURLContent(multiplier: number): string {
    throw new Error('Method not implemented.');
  }
  captureThumbnail(): string {
    throw new Error('Method not implemented.');
  }
  getObjectByID(id: string) {
    throw new Error('Method not implemented.');
  }
  getMyLastAddedObject(objType: string) {
    throw new Error('Method not implemented.');
  }
  loadData(widgets: any[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  planNewLayout(objects: any[], numOfColumns: number): void {
    throw new Error('Method not implemented.');
  }
  clearData(): void {
    throw new Error('Method not implemented.');
  }
  getNewPositionNextToActiveObject(direction: string): {
    x: number;
    y: number;
  } {
    throw new Error('Method not implemented.');
  }
  translateWidget(language: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  duplicateWidget(direction: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  stopAnimateObjectToPositionStatus: boolean;
  stopAnimateToRectStatus: boolean;
  anyChanges: boolean;
  thumbnail: string;
  toUpdateObjectRemote: any[];
  lastMouseData: any;
  animateToRectForSlide(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any
  ): void {
    throw new Error('Method not implemented.');
  }
  animateObjectToPosition(currentObj: any, left: number, top: number): void {
    throw new Error('Method not implemented.');
  }
  stopAnimateObjectToPosition(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    canvas: WBCanvas
  ): void {
    throw new Error('Method not implemented.');
  }
  animateToRect(
    width: number,
    height: number,
    vpt: any,
    vpCenter: any,
    canvas: WBCanvas
  ): void {
    throw new Error('Method not implemented.');
  }
  animateToVpt(vpt: any, vpCenter: any, canvas: WBCanvas): void {
    throw new Error('Method not implemented.');
  }
  zoomToObject(obj: FabricObject, canvas: WBCanvas): void {
    throw new Error('Method not implemented.');
  }
  zoomToCenterPoint(vpCenter: { x: number; y: number }, zoom: number): void {
    throw new Error('Method not implemented.');
  }
  updateViewport(): void {
    throw new Error('Method not implemented.');
  }
  onObjectModifiedUpdateArrowsSave(
    object: FabricObject,
    canvas: WBCanvas
  ): void;
  onObjectModifiedUpdateArrowsSave(
    object: FabricObject,
    canvas: WBCanvas
  ): void;
  onObjectModifiedUpdateArrowsSave(object: unknown, canvas: unknown): void {
    throw new Error('Method not implemented.');
  }
  onRefreshArrowAfterScale(arrowId: string): FabricObject;
  onRefreshArrowAfterScale(arrowId: string, canvas: WBCanvas): void;
  onRefreshArrowAfterScale(arrowId: string, canvas: WBCanvas): void;
  onRefreshArrowAfterScale(
    arrowId: unknown,
    canvas?: unknown
  ): void | FabricObject {
    throw new Error('Method not implemented.');
  }
  resetConnector(object: FabricObject, canvas: WBCanvas): void {
    throw new Error('Method not implemented.');
  }

  onObjectModifyUpdateArrows(object: FabricObject): void {
    throw new Error('Method not implemented.');
  }
  onObjectMoveUpdateArrowsSave(object: FabricObject): void {
    throw new Error('Method not implemented.');
  }
  updateConnectorsRemovedWidget(obj: FabricObject): void {
    throw new Error('Method not implemented.');
  }
  updateWhiteboardThumbnail(): void {
    throw new Error('Method not implemented.');
  }
  zindexArrBetween(lowz: number, highz: number, size: number): number[] {
    throw new Error('Method not implemented.');
  }
  createUniqueZIndex(inputZindex: number, tohigher: number): number {
    throw new Error('Method not implemented.');
  }
  createTopZIndex(): number {
    throw new Error('Method not implemented.');
  }
  sortByZIndex(): void {
    throw new Error('Method not implemented.');
  }
  _getIntersectedObjects(object: FabricObject): FabricObject[] {
    throw new Error('Method not implemented.');
  }
  getTopObjectByPointer(
    point: XY,
    ismouseup: boolean,
    isFrom: string
  ): FabricObject | null {
    throw new Error('Method not implemented.');
  }
  uploadFilesToWhiteboard(
    files: FileList,
    left: number,
    top: number,
    useFileName: string
  ): void {
    throw new Error('Method not implemented.');
  }
  ungroup(object: Group): Promise<void> {
    throw new Error('Method not implemented.');
  }
  group(group: ActiveSelection): Promise<void> {
    throw new Error('Method not implemented.');
  }
  alignGroupObjects(
    curentObject: FabricObject,
    alignment: AlignmentType
  ): void {
    throw new Error('Method not implemented.');
  }
  bindGroup(objectArr: [], callback: () => void): void {
    throw new Error('Method not implemented.');
  }
  resetBackgoundImage(): void {
    throw new Error('Method not implemented.');
  }
  checkIfResetBackground(): void {
    throw new Error('Method not implemented.');
  }
  getNextObjectByPoint(point: XY, width: number, height: number) {
    throw new Error('Method not implemented.');
  }
  getObjectsAroundPointByDistance(point: XY): FabricObject[] {
    throw new Error('Method not implemented.');
  }
  getObjectsAroundObjectByDistance(object: FabricObject): any[] {
    throw new Error('Method not implemented.');
  }
  getPositionOnScreenFromCanvas(left: number, top: number): XY {
    throw new Error('Method not implemented.');
  }
  getPositionOnCanvas(left: number, top: number): XY {
    throw new Error('Method not implemented.');
  }
}
