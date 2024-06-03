export default class EventNames {
  // canvas events
  static CANVAS_MOUSE_DOWN = 'canvas:mousedown';

  static CANVAS_MOUSE_DOWN_BEFORE = 'canvas:mousedownbefore';

  static CANVAS_MOUSE_MOVE = 'canvas:mousemove';

  static CANVAS_MOUSE_UP = 'canvas:mouseup';

  static CANVAS_MOUSE_OUT = 'canvas:mouseout';

  static CANVAS_SCROLL = 'canvas:scroll';


  static CANVAS_BEFORE_SELECTION_CLEARED = 'before:selection:cleared';

  static CANVAS_SELECTION_UPDATED = 'selection:updated';

  static CANVAS_SELECTION_CREATED = 'selection:created';

  static SELECTION_CLEARED = 'selection:cleared';

  static TEXT_CHANGED = 'text:changed';

  static OBJECT_MOVING = 'object:moving';

  static OBJECT_SCALING = 'object:scaling';

  static BEFORE_RENDER = 'before:render';

  static AFTER_RENDER = 'after:render';

  static MOUSE_DOWN_BEFORE = 'mouse:down:before';

  static TEXT_EDITING_EXISTED = 'text:editing:exited';

  static MOUSE_DBCLICK = 'mouse:dblclick';


  //document events
  static DOCUMENT_KEY_UP = 'document:keyup';

  static DOCUMENT_KEY_DOWN = 'document:keydown';

  static DOCUMENT_MOUSE_DOWN = 'mousedown';

  static DOCUMENT_MOUSE_UP = 'mouseup';

  static DOCUMENT_MOUSE_MOVE = 'mousemove';

  static DOCUMENT_MOUSE_WHEEL = 'wheel';

  static DOCUMENT_DRAG_OVER = 'dragover';

  static DOCUMENT_PAUSE = 'pause';

  static DOCUMENT_RESUME = 'resume';

  static DOCUMENT_VISIBILITY_CHANGE = 'visibilitychange';

  static DOCUMENT_PASTE = 'paste';

  static WINDOW_BEFORE_UNLOAD = 'beforeunload';

  static WINDOW_MOUSE_MOVE = 'mousemove';

  static WINDOW_GESTURE_START = 'gesturestart';

  static WINDOW_GESTURE_CHANGE = 'gesturechange';

  static WINDOW_RESIZE = 'resize';

//keyboard events
  static A_CTRL_KEY_DOWN = 'a_ctrl:keydown';

  static B_CTRL_KEY_DOWN = 'b_ctrl:keydown';

  static D_CTRL_KEY_DOWN = 'd_ctrl:keydown';

  static G_CTRL_SHIFT_KEY_DOWN = 'g_ctrl_shift:keydown';

  static G_CTRL_KEY_DOWN = 'g_ctrl:keydown';

  static T_KEY_DOWN = 't:keydown';

  static P_KEY_DOWN = 'p:keydown';

  static S_KEY_UP = 's:keyup';

  static S_KEY_DOWN = 's:keydown';

  static O_KEY_UP = 'o:keyup';

  static O_KEY_DOWN = 'o:keydown';

  static R_KEY_UP = 'r:keyup';

  static R_KEY_DOWN = 'r:keydown';

  static F_KEY_UP = 'f:keyup';

  static F_KEY_DOWN = 'f:keydown';

  static L_KEY_UP = 'l:keyup';

  static L_KEY_DOWN = 'l:keydown';

  static Z_CTRL_KEY_UP = 'z_ctrl:keyup';

  static Z_CTRL_KEY_DOWN = 'z_ctrl:keydown';

  static Z_CTRL_SHIFT_KEY_UP = 'z_ctrl_shift:keyup';

  static Z_CTRL_SHIFT_KEY_DOWN = 'z_ctrl_shift:keydown';

  static SPACE_KEY_UP = 'space:keyup';

  static SPACE_KEY_DOWN = 'space:keydown';

  static SHIFT_KEY_UP = 'shift:keyup';

  static SHIFT_KEY_DOWN = 'shift:keydown';

  static SLASH_SHIFT_KEY_DOWN = 'slash_shift:keydown';

  static ESC_KEY_DOWN = 'esc:keydown';

  static DELETE_KEY_DOWN = 'delete:keydown';

  static CTRL_SHIFT_FIVE_KEY_DOWN = 'ctrl_shift_five:keydown';

  static CTRL_PLUS_KEY_DOWN = 'ctrl_plus:keydown';

  static CTRL_MINUS_KEY_DOWN = 'ctrl_minus:keydown';

  static CTRL_ZERO_KEY_DOWN = 'ctrl_zero:keydown';

  static UP_DOWN_LEFT_RIGHT_KEY_DOWN = 'up_down_left_right:keydown';

  
  static HAMMER_TAP1 = 'tap1';

  static HAMMER_DOUBLE_TAP = 'doubletap';

  static HAMMER_PAN1_START = 'pan1start';

  static HAMMER_PAN1_MOVE = 'pan1move';

  static HAMMER_PAN1_END = 'pan1end';

  static HAMMER_PAN3 = 'pan3';

  static HAMMER_PINCH_START = 'pinchstart';

  static HAMMER_PINCH_MOVE = 'pinchmove';

  static RETURN_DEFAULT_ZOOMM = 'returndefaultzoom';
}
