import { FabricObject } from '../../shapes/Object/FabricObject';
import { FabricObjectProps } from '../../shapes/Object/types';
import { ObjectEvents } from '../../EventTypeDefs';
import { SerializedObjectProps } from '../../shapes/Object/types';

import { Canvas } from '../Canvas';
import { Point } from '../../Point';

interface ConnectorControlPoints {
  mtaStart: Point | null;
  mbaStart: Point | null;
  mlaStart: Point | null;
  mraStart: Point | null;
}

const DEFAULT_SELECTION_COLOR = 'rgba(179, 205, 253, 0.5)';
const DEFAULT_SELECTION_BORDER_COLOR = '#31A4F5';
const DEFAULT_MOVE_CURSOR = 'default';
const TARGET_FIND_TOLERANCE = 8;

export class XCanvas extends Canvas {
  uniformScaling = true;
  interactionMode = 'mouse';
  isEnablePanMoving = false;
  selectionFullyContained = false;
  skipOffscreen = true;
  preserveObjectStacking = true;
  targetFindTolerance = TARGET_FIND_TOLERANCE;
  stopAnimateToRectStatus = false;
  stopAnimateObjectToPositionStatus = false;
  moveCursor = DEFAULT_MOVE_CURSOR;
  selectionColor = DEFAULT_SELECTION_COLOR;
  selectionBorderColor = DEFAULT_SELECTION_BORDER_COLOR;
  selectionLineWidth = 1;
  fireMiddleClick = true;
  showBackgroundDots = true;
  whiteboardWidth = 1920 * 5;
  whiteboardHeight = 1080 * 6;
  isEnableTouchMoving = false;
  conextMenuObject: Record<string, any> = {};
  notesDrawCanvas: HTMLCanvasElement | null = null;
  widgetPadding = 5;
  connectorStart: Point | null = null;
  connectorArrow: any = null;
  vAlignLineTimer: NodeJS.Timeout | null = null;
  hAlignLineTimer: NodeJS.Timeout | null = null;
  isDrawingMode = false;
  isErasingMode = false;
  group_zIndex: number | null = null;
  defaultNote: Record<string, any> = {};
  boundHandlerMouseMove: ((e: any) => void) | null = null;
  dockingWidget: FabricObject | null = null;
  instanceOfConnector: any = null;
  startPointOfConnector: Point | null = null;
  endPointOfConnector: Point | null = null;
  inConnectingMode = false;
  toUpdateNewObjectRemote: any[] = [];
  toUpdateRemovedObjectRemote: any[] = [];
  anyChanges = false;
  thumbnail = '';
  toUpdateObjectRemote: any[] = [];
  lastMouseData: any;
  _numOfColumns = 0;
  hoveringControl = '';

  findById(
    id: string
  ): FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
  > | null {
    return (
      this.getObjects().find((widget: FabricObject) => widget.id === id) || null
    );
  }

  getAbsoluteCoords(object: any): { left: number; top: number } {
    return {
      left: object.left + this._offset.left,
      top: object.top + this._offset.top,
    };
  }

  clearData(): void {
    while (this._objects.length > 0) {
      this.remove(this._objects.pop()!);
    }
  }

  translateWidget(language: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  zoomToViewAllObjects(): number {
    return 1;
  }
}
