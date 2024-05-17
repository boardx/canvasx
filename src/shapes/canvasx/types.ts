export enum EventName {
  MODIFIED = 'modified',
  CHANGED = 'changed',
  TRIPLECLICK = 'tripleclick',
  DBLCLICK = 'dblclick',
  MOUSEOUT = 'mouseout',
  EDITINGENTERED = 'editing:entered',
  MOUSEOVER = 'mouseover',
  EDITINGEXITED = 'editing:exited',
  INITIALIZE = 'initialize',
  INSERTNEWSTYLEBLOCK = 'insertNewStyleBlock',
  RENDER = '_render',
  SET = 'set',
  OBJECTMOVING = 'object:moving',
  OBJECTMOVED = 'object:moved',
  SELECTIONCREATED = 'selection:created',
  SELECTIONCLEARED = 'selection:cleared',
  SELECTED = 'selected',
  DESELECTED = 'deselected',
  MOUSEDBLCLICK = 'mousedblclick',
  MOUSEUP = 'mouseup',
  MOUSE_UP = 'mouse:up',
  TOUCHSTART = 'touchstart',
  SETSRC = 'setSrc',
  REMOVED = 'removed',
  MOUSEDOWN = 'mousedown',
  MOVING = 'moving',
  SELECTABLE = 'selectable',
  EVENTED = 'evented',
  FILL = 'fill',
  ROTATING = 'rotating',
  SCALING = 'scaling',
  ADDED = 'added',
  OBJECTSCALING = 'object:scaling',
  OBJECTSCALED = 'object:scaled',
  OBJECTROTATING = 'object:rotating',
  OBJECTROTATED = 'object:rotated',
  SELECTIONUPDATED = 'selection:updated',
  DRAGENTER = 'dragenter',
  DRAGLEAVE = 'dragleave',

  CANVAS_MOUSE_DOWN = 'canvas:mousedown',
  CANVAS_MOUSE_DOWN_BEFORE = 'canvas:mousedownbefore',
  CANVAS_MOUSE_MOVE = 'canvas:mousemove',
  CANVAS_MOUSE_UP = 'canvas:mouseup',
  CANVAS_MOUSE_OUT = 'canvas:mouseout',
  CANVAS_SCROLL = 'canvas:scroll',
  DOCUMENT_KEY_UP = 'document:keyup',
  DOCUMENT_KEY_DOWN = 'document:keydown',
  DOCUMENT_MOUSE_DOWN = 'mousedown',
  DOCUMENT_MOUSE_UP = 'mouseup',
  DOCUMENT_MOUSE_MOVE = 'mousemove',
  DOCUMENT_MOUSE_WHEEL = 'wheel',
  DOCUMENT_DRAG_OVER = 'dragover',
  DOCUMENT_PAUSE = 'pause',
  DOCUMENT_RESUME = 'resume',
  DOCUMENT_VISIBILITY_CHANGE = 'visibilitychange',
  DOCUMENT_PASTE = 'paste',
  WINDOW_BEFORE_UNLOAD = 'beforeunload',
  WINDOW_MOUSE_MOVE = 'mousemove',
  WINDOW_GESTURE_START = 'gesturestart',
  WINDOW_GESTURE_CHANGE = 'gesturechange',
  A_CTRL_KEY_DOWN = 'a_ctrl:keydown',
  B_CTRL_KEY_DOWN = 'b_ctrl:keydown',
  D_CTRL_KEY_DOWN = 'd_ctrl:keydown',
  G_CTRL_SHIFT_KEY_DOWN = 'g_ctrl_shift:keydown',
  G_CTRL_KEY_DOWN = 'g_ctrl:keydown',
  T_KEY_DOWN = 't:keydown',
  P_KEY_DOWN = 'p:keydown',
  S_KEY_UP = 's:keyup',
  S_KEY_DOWN = 's:keydown',
  O_KEY_UP = 'o:keyup',
  O_KEY_DOWN = 'o:keydown',
  R_KEY_UP = 'r:keyup',
  R_KEY_DOWN = 'r:keydown',
  F_KEY_UP = 'f:keyup',
  F_KEY_DOWN = 'f:keydown',
  L_KEY_UP = 'l:keyup',
  L_KEY_DOWN = 'l:keydown',

  Z_CTRL_KEY_UP = 'z_ctrl:keyup',

  Z_CTRL_KEY_DOWN = 'z_ctrl:keydown',

  Z_CTRL_SHIFT_KEY_UP = 'z_ctrl_shift:keyup',

  Z_CTRL_SHIFT_KEY_DOWN = 'z_ctrl_shift:keydown',

  SPACE_KEY_UP = 'space:keyup',

  SPACE_KEY_DOWN = 'space:keydown',

  SHIFT_KEY_UP = 'shift:keyup',

  SHIFT_KEY_DOWN = 'shift:keydown',

  SLASH_SHIFT_KEY_DOWN = 'slash_shift:keydown',

  ESC_KEY_DOWN = 'esc:keydown',

  DELETE_KEY_DOWN = 'delete:keydown',

  CTRL_SHIFT_FIVE_KEY_DOWN = 'ctrl_shift_five:keydown',

  CTRL_PLUS_KEY_DOWN = 'ctrl_plus:keydown',

  CTRL_MINUS_KEY_DOWN = 'ctrl_minus:keydown',

  CTRL_ZERO_KEY_DOWN = 'ctrl_zero:keydown',

  UP_DOWN_LEFT_RIGHT_KEY_DOWN = 'up_down_left_right:keydown',

  CANVAS_BEFORE_SELECTION_CLEARED = 'before:selection:cleared',

  CANVAS_SELECTION_UPDATED = 'selection:updated',

  CANVAS_SELECTION_CREATED = 'selection:created',

  SELECTION_CLEARED = 'selection:cleared',

  TEXT_CHANGED = 'text:changed',

  BEFORE_RENDER = 'before:render',

  AFTER_RENDER = 'after:render',

  MOUSE_DOWN_BEFORE = 'mouse:down:before',
  MOUSE_DOWN = 'mouse:down',

  TEXT_EDITING_EXISTED = 'text:editing:exited',

  MOUSE_DBCLICK = 'mouse:dblclick',

  HAMMER_TAP1 = 'tap1',

  HAMMER_DOUBLE_TAP = 'doubletap',

  HAMMER_PAN1_START = 'pan1start',

  HAMMER_PAN1_MOVE = 'pan1move',

  HAMMER_PAN1_END = 'pan1end',

  HAMMER_PAN3 = 'pan3',

  HAMMER_PINCH_START = 'pinchstart',

  HAMMER_PINCH_MOVE = 'pinchmove',

  RETURN_DEFAULT_ZOOMM = 'returndefaultzoom',

  MOUSE_MOVE = 'mouse:move',
  RESIZING = 'resizing',
}

export enum TextAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  JUSTIFY = 'justify',
  JUSTIFYLEFT = 'justify-left',
  JUSTIFYCENTER = 'justify-center',
  JUSTIFYRIGHT = 'justify-right',
}
export enum WidgetType {
  WBActiveSelection = 'activeSelection',
  WBArrow = 'WBArrow',
  WBCircle = 'WBCircle',
  WBCircleNotes = 'WBCircleNotes',
  WBFile = 'WBFile',
  WBGroup = 'WBGroup',
  WBImage = 'WBImage',
  WBIText = 'WBIText',
  WBObject = 'WBObject',
  WBPath = 'WBPath',
  WBPolyline = 'WBPolyline',
  WBLine = 'WBLine',
  WBRdRectPanel = 'WBRdRectPanel',
  WBRect = 'WBRect',
  WBRectNotes = 'WBRectNotes',
  WBRectPanel = 'WBRectPanel',
  WBShape = 'WBShape',
  WBShapeNotes = 'WBShapeNotes',
  WBTriangle = 'WBTriangle',
  WBUrlImage = 'WBUrlImage',
  WBText = 'WBText',
  WBTextbox = 'WBTextbox',
  Common = 'common',
}

export enum NoteType {
  RECT = 'rect',
  SQUARE = 'square',
  CIRCLE = 'circle',
  TEXT = 'text',
}

export enum Origin {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}
export enum ModifiedField {
  Width = 'width',
  Height = 'height',
  Left = 'left',
  Top = 'top',
  ShapeScalex = 'shapeScaleX',
  ScaleX = 'scaleX',
  ScaleY = 'scaleY',
  FlipX = 'flipX',
  FLipY = 'flipY',
  MaxHeight = 'maxHeight',
  FixedScaleChange = 'fixedScaleChange',
  Lines = 'lines',
  PanelObj = 'panelObj',
  Relationship = 'relationship',
  ZIndex = 'zIndex',
  x1 = 'x1',
  x2 = 'x2',
  y1 = 'y1',
  y2 = 'y2',
  ConnectorStart = 'connectorStart',
  ConnectorEnd = 'connectorEnd',
  Fill = 'fill',
  Text = 'text',
}
export enum SaveAction {
  MOVED = 'MOVED',
  SCALED = 'SCALED',
  ADDED = 'ADDED',
  PASTE = 'PASTE',
  REMOVED = 'REMOVED',
  MODIFIED = 'MODIFIED',
  UNBIND = 'UNBIND',
  BIND = 'BIND',
  ROTATED = 'ROTATED',
}
