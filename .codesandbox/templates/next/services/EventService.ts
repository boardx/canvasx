//**Redux Store */
// import { handleSetLexicalSelection } from "../store/domArea";
// import { userApi } from "../redux/UserAPISlice";

//**Services */
import EventNames from './EventNames';
// import { bindEvents } from "../board/canvas/initialize/initializeShortcut";
// import filedropUploadCallback from "../board/components/filedropUploadCallback";
// import { switchInteractionMode } from "../board/canvas/initialize/initializeCanvasEvents";

//**Hammerjs */
// const Hammer = require("hammerjs");

//**rxjs */

import BoardService from './board/BoardService';
import { XCanvas } from '@boardxus/canvasx';

export default class EventService {
  public _eventHandlers: any;

  public _listenTriggerEventsHandlers: any;

  public handleCanvasCutBound: (e: Event) => void;

  public handleCanvasCopyBound: (e: Event) => void;

  static service: EventService;

  static getInstance(): EventService {
    if (EventService.service == null) {
      EventService.service = new EventService();

      // Boardx.Instance.EventService = EventService.service;
    }

    return EventService.service;
  }

  constructor() {
    this._eventHandlers = new Map();

    this._listenTriggerEventsHandlers = false;

    this.listenWindowEvents();

    // this.handleCanvasCutBound = (e: any) => this.handleCanvasCut(e);

    // this.handleCanvasCopyBound = (e: any) => this.handleCanvasCopy(e);
  }

  getEventHandlers() {
    return this._eventHandlers;
  }

  listenWindowEvents() {
    window.addEventListener('resize', (e: any) =>
      this.trigger(EventNames.WINDOW_RESIZE, e)
    );
    window.addEventListener('gesturestart', (e: any) =>
      this.trigger(EventNames.WINDOW_GESTURE_START, e)
    );
    window.addEventListener('gesturechange', (e: any) =>
      this.trigger(EventNames.WINDOW_GESTURE_CHANGE, e)
    );
    window.addEventListener('contextmenu', this.handleContextmenu, true);
  }

  listenCanvasDomEvents() {
    const canvas: XCanvas = BoardService.getInstance().getBoard();
    // const canvasEl = canvas.lowerCanvasEl;

    // switchInteractionMode(canvas.interactionMode);

    //bing shortcut key events
    // bindEvents();
    //listen dragover event on canvas
    document.addEventListener('dragover', this.onCanvasDragOver, true);
    //listen paste event on canvas
    // document.addEventListener("paste", this.handleCanvasPaste, true);
    //listen cut event on canvas
    document.addEventListener('cut', this.handleCanvasCutBound, true);
    //listen copy event on canvas
    document.addEventListener('copy', this.handleCanvasCopyBound, true);

    // uperCanvas.filedrop({
    //   upload: filedropUploadCallback,
    //   error(error: any) {
    //     console.error(error);
    //   },
    // });
  }

  unMountCanvasDomEvents() {
    window.removeEventListener('contextmenu', this.handleContextmenu, true);
    document.removeEventListener('dragover', this.onCanvasDragOver, true);
    // document.removeEventListener("paste", this.handleCanvasPaste, true);
    document.removeEventListener('cut', this.handleCanvasCutBound, true);
    document.removeEventListener('copy', this.handleCanvasCopyBound, true);
  }

  listenCanvasActionEvents() {
    const canvas: XCanvas = BoardService.getInstance().getBoard();
    if (!canvas) return;

    //mouse on canvas action events
    canvas.on('mouse:up', (e: any) =>
      this.trigger(EventNames.CANVAS_MOUSE_UP, e)
    );
    canvas.on('mouse:down', (e: any) =>
      this.trigger(EventNames.CANVAS_MOUSE_DOWN, e)
    );
    canvas.on('mouse:move', (e: any) =>
      this.trigger(EventNames.CANVAS_MOUSE_MOVE, e)
    );
    canvas.on('mouse:out', (e: any) =>
      this.trigger(EventNames.CANVAS_MOUSE_OUT, e)
    );
    canvas.on('mouse:down:before', (e: any) =>
      this.trigger(EventNames.CANVAS_MOUSE_DOWN_BEFORE, e)
    );
    canvas.on('mouse:dblclick', (e: any) =>
      this.trigger(EventNames.MOUSE_DBCLICK, e)
    );

    //canvas selection events
    canvas.on('before:selection:cleared', (e: any) =>
      this.trigger(EventNames.CANVAS_BEFORE_SELECTION_CLEARED, e)
    );
    canvas.on('selection:updated', (e: any) =>
      this.trigger(EventNames.CANVAS_SELECTION_UPDATED, e)
    );
    canvas.on('selection:created', (e: any) =>
      this.trigger(EventNames.CANVAS_SELECTION_CREATED, e)
    );
    canvas.on('selection:cleared', (e: any) =>
      this.trigger(EventNames.SELECTION_CLEARED, e)
    );

    //canvas object action events
    canvas.on('object:moving', (e: any) =>
      this.trigger(EventNames.OBJECT_MOVING, e)
    );
    canvas.on('object:scaling', (e: any) =>
      this.trigger(EventNames.OBJECT_SCALING, e)
    );

    //canvas text events
    canvas.on('text:changed', (e: any) =>
      this.trigger(EventNames.TEXT_CHANGED, e)
    );
    canvas.on('text:editing:exited', (e: any) =>
      this.trigger(EventNames.TEXT_EDITING_EXISTED, e)
    );

    //render text events
    canvas.on('before:render', (e: any) =>
      this.trigger(EventNames.BEFORE_RENDER, e)
    );
    canvas.on('after:render', (e: any) =>
      this.trigger(EventNames.AFTER_RENDER, e)
    );
  }
  listenTriggerEvents() {
    if (!this._listenTriggerEventsHandlers) {
      let listenDom = document.getElementById('boardEntity');

      //document event in board
      document.addEventListener('keydown', (e: any) =>
        this.trigger(EventNames.DOCUMENT_KEY_DOWN, e)
      );
      document.addEventListener('keyup', (e: any) =>
        this.trigger(EventNames.DOCUMENT_KEY_UP, e)
      );
      document.addEventListener('resume', (e: any) =>
        this.trigger(EventNames.DOCUMENT_RESUME, e)
      );
      document.addEventListener('visibilitychange', (e: any) =>
        this.trigger(EventNames.DOCUMENT_VISIBILITY_CHANGE, e)
      );

      listenDom?.addEventListener(
        'mousewheel',
        (e: any) => {
          this.blockZoomOnBrowser(e);
        },
        {
          passive: false,
        }
      );
      this._listenTriggerEventsHandlers = true;
    }
  }
  // listenHammerEvents() {
  //   const canvas: XCanvas = BoardService.getInstance().getBoard();
  //   const hammer = new Hammer.Manager(canvas.upperCanvasEl, {});
  //   const pan1 = new Hammer.Pan({ event: 'pan1', pointers: 1, threshold: 1 }); // One finger move/drag
  //   const pinch = new Hammer.Pinch({
  //     event: 'pinch',
  //     pointers: 2,
  //     threshold: 0,
  //   }); // two finger zoom

  //   const tap1 = new Hammer.Tap({ event: 'tap1', pointers: 1, threshold: 1 }); // one finger tap/click

  //   pan1.dropRecognizeWith(pinch);
  //   pan1.requireFailure(pinch);
  //   const doubletap = new Hammer.Tap({
  //     pointers: 1,
  //     threshold: 2,
  //     posThreshold: 20,
  //     event: 'doubletap',
  //     taps: 2,
  //   }); // One finger double tap/ click
  //   pan1.dropRecognizeWith(doubletap);
  //   pan1.requireFailure(doubletap);
  //   pinch.dropRecognizeWith(doubletap);
  //   pinch.requireFailure(doubletap);
  //   // Tap recognizer with minimal 2 taps

  //   const press = new Hammer.Press({
  //     event: 'press',
  //     pointers: 1,
  //     threshold: 9,
  //     time: 300,
  //   });

  //   hammer.add(press);
  //   hammer.add(pan1);
  //   hammer.add(pinch);
  //   hammer.add(doubletap);
  //   hammer.add(tap1);
  //   hammer.get('pan1').set({ enable: true });
  //   hammer.on('tap1', (e: any) => this.trigger(EventNames.HAMMER_TAP1, e));
  //   hammer.on('doubletap', (e: any) =>
  //     this.trigger(EventNames.HAMMER_DOUBLE_TAP, e)
  //   );
  //   const press$ = fromEvent(hammer, 'press');
  //   const panStart$ = fromEvent(hammer, 'pan1start');
  //   const mousemove$ = fromEvent(hammer, 'pan1move');
  //   const mouseup$ = fromEvent(hammer, 'pan1end');

  //   let mode = 'static';

  //   panStart$
  //     .pipe(
  //       tap((e: any) => {
  //         if (!e.srcEvent.path || e.srcEvent.path.length == 0) {
  //           let target = e.target;
  //           e.srcEvent.path = [];
  //           while (target.parentNode !== null) {
  //             e.srcEvent.path.push(target);
  //             target = target.parentNode;
  //           }
  //           e.srcEvent.path.push(document, window);
  //         }
  //         this.trigger(EventNames.HAMMER_PAN1_START, e);
  //       }),
  //       switchMap((_) =>
  //         mousemove$.pipe(
  //           tap((e: any) => {
  //             if (!e.srcEvent.path || e.srcEvent.path.length == 0) {
  //               let target = e.target;
  //               e.srcEvent.path = [];
  //               while (target.parentNode !== null) {
  //                 e.srcEvent.path.push(target);
  //                 target = target.parentNode;
  //               }
  //               e.srcEvent.path.push(document, window);
  //             }
  //             if (mode === 'press') {
  //               return;
  //             }
  //             if (canvas.getActiveObject()) return;
  //             mode = 'pan';
  //             canvas.selection = false;
  //             canvas.isEnablePanMoving = true;
  //             this.trigger(EventNames.HAMMER_PAN1_MOVE, e);
  //           }),
  //           takeUntil(mouseup$)
  //         )
  //       )
  //     )
  //     .subscribe();

  //   press$
  //     .pipe(
  //       tap((e: any) => {
  //         mode = 'press';
  //         canvas.selection = true;
  //         canvas.isEnablePanMoving = false;
  //         this.trigger(EventNames.HAMMER_PAN1_START, e);
  //       }),
  //       switchMap((_) =>
  //         mousemove$.pipe(
  //           tap((e: any) => {
  //             this.trigger(EventNames.HAMMER_PAN1_MOVE, e);
  //           }),
  //           takeUntil(mouseup$)
  //         )
  //       )
  //     )
  //     .subscribe();

  //   mouseup$.subscribe((e: any) => {
  //     this.trigger(EventNames.HAMMER_PAN1_END, { ...e, mode }); // Hammer automatically created this event based on 'pan1'
  //     mode = 'static';
  //     canvas.selection = true;
  //     canvas.isEnablePanMoving = false;
  //   });
  //   hammer.on('pinchstart', (e: any) => {
  //     canvas.selection = false;
  //     this.trigger(EventNames.HAMMER_PINCH_START, e);
  //   }); // Hammer defined : start of two finger zoom

  //   hammer.on('pinchmove', (e: any) =>
  //     this.trigger(EventNames.HAMMER_PINCH_MOVE, e)
  //   ); // Hammer defined : move/process of two finger zoom

  //   hammer.on('pinchend', () => {
  //     canvas.selection = true;
  //   });
  // }

  register(eventName: string, handlerFunction: any) {
    if (!this._eventHandlers.has(eventName)) {
      this._eventHandlers.set(eventName, [handlerFunction]); // 直接在创建新数组时添加当前处理函数
    } else {
      const index = this._eventHandlers.get(eventName).indexOf(handlerFunction);
      if (index < 0) {
        // 如果之前没有添加过当前处理函数，才将其添加
        this._eventHandlers.get(eventName).push(handlerFunction);
      }
    }
  }

  unregister(eventName: string, handlerFunction: any) {
    if (!this._eventHandlers.has(eventName)) {
      this._eventHandlers.set(eventName, []);
    }

    const index = this._eventHandlers.get(eventName).indexOf(handlerFunction);

    if (index > -1) {
      this._eventHandlers.get(eventName).splice(index, 1);
    }
  }

  trigger(eventName: string, e: any) {
    if (!this._eventHandlers.has(eventName)) {
      return;
    }

    /* prevent handler be unreigstered at other places */
    const handlers = [...this._eventHandlers.get(eventName)];

    handlers.forEach((handlerMethod) => {
      handlerMethod(e);
    });
  }

  unregisterAllEvents() {
    const canvas: XCanvas = BoardService.getInstance().getBoard();

    if (canvas) {
      canvas.off();
    } // remove all event listeners from the canvas element

    this._eventHandlers.clear(); // clear the _eventHandlers map
  }

  blockZoomOnBrowser(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();

      this.trigger(EventNames.DOCUMENT_MOUSE_WHEEL, e);
    }
  }

  //dragover function
  onCanvasDragOver(e: DragEvent) {
    const canvas: XCanvas = BoardService.getInstance().getBoard();
    const dragX = e.pageX;
    const dragY = e.pageY;
    canvas.lastMousePosition = { x: dragX, y: dragY };
    canvas.dragOverEvent = e;
  }

  handleContextmenu(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const isCanvasElement = target.classList.contains('canvas-element');

    if (target.tagName === 'CANVAS') {
      e.preventDefault();
    }
  }

  // addOnlineUserToBoard(boardId: string) {
  //   const user = store.getState().user.userInfo;
  //   const token = localStorage.getItem("token")
  //     ? localStorage.getItem("token")
  //     : "vistorToken";

  //   const userNo = Boardx.awareness?.clientID;
  //   const addData = {
  //     userId: user.userId,
  //     username: user.userName,
  //     avatar: user.avatar,
  //     name: user.name,
  //     t: Date.now(),
  //     userNo: userNo,
  //     createdAt: new Date(),
  //   };

  //   // if (boardId && user && token) {
  //   //   server.call('addOnlineUser', user, boardId, token).then((res:any) => {

  //   //     store.dispatch(handleSetLastSessionId(res));

  //   //   });
  //   // }
  // }
}
