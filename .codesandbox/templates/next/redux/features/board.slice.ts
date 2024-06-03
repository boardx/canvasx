import { createSlice } from '@reduxjs/toolkit';

enum BoardState {
  LOADING = 'loading',
  ERROR = 'error',
  READY = 'ready',
  ONBOARDING = 'onBoarding',
  COMMENTING = 'commenting',
  FOLLOWME = 'followMe',
  ARROWCREATING = 'arrowCreating',
  PRESENTATION = 'presentation',
  CREATESLIDE = 'createSlide',
  DRAWING = 'drawing',
  DRAWINGERASE = 'drawingErase',
  DRAWTOCREATE = 'drawToCreate',
}

export const boardSlice = createSlice({
  name: 'board',
  initialState: {
    //boardInfo
    interactionMode: '',
    board: {
      id: '',
      name: '',
      roomId: '',
      teamId: '',
      follow: {
        followUserNo: '',
        followMode: '',
        followUserId: '',
        followUserName: '',
      },
      slides: {},
    },
    boardId: '',
    boardName: '',
    boardInfo: {},
    isPanMode: false,
    noteMode: false,
    initCanvas: false,
    //view hooks
    updatingBoard: 0,

    boardStatus: BoardState.LOADING,

    hideUserList: false,
    hideHeader: false,
    hideBoardMenu: false,
    hideRightSideBar: false,

    showMoreMenu: false,

    drawColorPopUp: false,
    moreMenuTouchOpen: false,
    menuDisplay: true,
    cropMode: false,
    showTutorial: false,
    openCreateStickyNoteTips: false,
    boardPanelClicked: false,
    //premission
    orgAdmin: '',

    //cursor status
    cursorColorOfPen: 'rgb(0, 0, 0)',
    classForCursor: null,

    //Tutorial
    boardVisitorTutorial2: 'unselected',
    //**undo redo */
    undoAvailable: false,
    redoAvailable: false,
    //**lock status */
    currentLockStatus: false,
    //**zoom */
    zoomFactor: null,
    //**widgets */
    getOptions: [],
    currentAlign: null,
    widgetMenuTouchList: [],
    widgetMenuList: [],
    boardMenuEvents: [],
    drawToCreateWidget: null,
    cursorColorOfPenWidth: 4,
    drawingEraseMode: false,
    showRightBottomIcon: true,
    //**followme */
    followMode: false,
    followMe: false,
    stopFollowOtherUserFlag: false,
    //follow me
    followViewport: null,
    followViewportUser: null,
    connectorMode: false,
    connectorModifyMode: false,
    //**arrowMode */
    arrowMode: false,
    aiChat: [],
    //**ai chat */
    showRecordButton: false,
    showRecordingImg: false,
    showAiChatLoading: false,
    showMobileAiChatLoading: false,
    isReading: false,
    //**markdown */
    showLexical: false,
    lexicalInner: [],
    //**captureThumbnail */
    captureThumbnail: null,
    captureThumbnailBoardName: null,
    //** feedback */
    feedbackContent: null,
    //** timer */
    //**slidecapture */
    slideCapture: { startPointX: 0, startPointY: 0 },
  },
  reducers: {
    handleSetInteractionMode(state, action) {
      state.interactionMode = action.payload;
    },
    handleSetInitCanvas(state, action) {
      state.initCanvas = action.payload;
    },
    handleSetHideRightSideBar(state, action) {
      state.hideRightSideBar = action.payload;
    },
    handleSetHideBoardUserList(state, action) {
      state.hideUserList = action.payload;
    },
    handleSetHideBoardMenu(state, action) {
      state.hideBoardMenu = action.payload;
    },
    handleChangeBoardState(state, action) {
      state.boardStatus = action.payload;
    },
    handleSetAIChat(state, action) {
      state.aiChat = action.payload;
    },
    handleSetShowAiChatLoading(state, action) {
      state.showAiChatLoading = action.payload;
    },
    handleSetShowMobileAiChatLoading(state, action) {
      state.showMobileAiChatLoading = action.payload;
    },
    handleSetConnectorModifyMode(state, action) {
      state.connectorModifyMode = action.payload;
    },
    handleSetConnectorMode(state, action) {
      state.connectorMode = action.payload;
    },
    handleSetIsPanMode(state, action) {
      state.isPanMode = action.payload;
    },
    handleChangeStopFollowOtherUserFlag(state, action) {
      state.stopFollowOtherUserFlag = action.payload;
    },
    handleChangeFollowMe(state, action) {
      state.followMe = action.payload;
    },
    handleChangeFollowViewportUser(state, action) {
      state.followViewportUser = action.payload;
    },
    handleChangeViewport(state, action) {
      state.followViewport = action.payload;
    },
    handleSetBoard(state, action) {
      state.board = action.payload;
    },
    handleWidgetMenuDisplay(state, action) {
      state.menuDisplay = action.payload;
    },

    handleShowRightBottom(state, action) {
      state.showRightBottomIcon = action.payload;
    },
    handleSetBoardId(state, action) {
      state.boardId = action.payload;
    },
    handleSetBoardInfo(state, action) {
      state.boardInfo = action.payload;
    },
    handleSetBoardName(state, action) {
      state.boardName = action.payload;
    },

    // handleSetOrgAdmin(state, action) {
    //   state.orgAdmin = action.payload
    // },

    handleSetHideHeader(state, action) {
      state.hideHeader = action.payload;
    },
    handleSetShowMoreMenu(state, action) {
      state.showMoreMenu = action.payload;
    },
    handleSetCursorColorOfPen(state, action) {
      state.cursorColorOfPen = action.payload;
    },
    handleSetClassForCursor(state, action) {
      state.classForCursor = action.payload;
    },

    handleSetBoardVisitorTutorial2(state, action) {
      state.boardVisitorTutorial2 = action.payload;
    },
    handleSetUndoAvailable(state, action) {
      state.undoAvailable = action.payload;
    },
    handleSetRedoAvailable(state, action) {
      state.redoAvailable = action.payload;
    },
    handleSetCurrentLockStatus(state, action) {
      state.currentLockStatus = action.payload;
    },
    handleSetZoomFactor(state, action) {
      state.zoomFactor = action.payload;
    },
    handleSetGetOptions(state, action) {
      state.getOptions = action.payload;
    },
    handleSetCurrentAlign(state, action) {
      state.currentAlign = action.payload;
    },
    handleSetDrawColorPopUp(state, action) {
      state.drawColorPopUp = action.payload;
    },
    handleSetWidgetMenuTouchList(state, action) {
      state.widgetMenuTouchList = action.payload;
    },
    handleSetWidgetMenuList(state, action) {
      state.widgetMenuList = action.payload;
    },
    handleSetMoreMenuTouchOpen(state, action) {
      state.moreMenuTouchOpen = action.payload;
    },

    handleSetCropMode(state, action) {
      state.cropMode = action.payload;
    },
    handleSetFollowMode(state, action) {
      state.followMode = action.payload;
    },
    handleSetShowTutorial(state, action) {
      state.showTutorial = action.payload;
    },
    handleSetOpenCreateStickyNoteTips(state, action) {
      state.openCreateStickyNoteTips = action.payload;
    },
    handleSetBoardMenuEvents(state, action) {
      state.boardMenuEvents = action.payload;
    },
    handleSetBoardMenuEventsPushNewEvent(state, action) {
      state.boardMenuEvents = action.payload;
    },
    handleSetArrowMode(state, action) {
      state.arrowMode = action.payload;
    },
    handleSetBoardPanelClicked(state, action) {
      state.boardPanelClicked = action.payload;
    },
    handleSetDrawToCreateWidget(state, action) {
      state.drawToCreateWidget = action.payload;
    },
    handleSetCursorColorOfPenWidth(state, action) {
      state.cursorColorOfPenWidth = action.payload;
    },
    handleSetDrawingEraseMode(state, action) {
      state.drawingEraseMode = action.payload;
    },
    handleSetNoteMode(state, action) {
      state.noteMode = action.payload;
    },
    handleSetShowRecordButton(state, action) {
      state.showRecordButton = action.payload;
    },
    handleSetShowRecordingImg(state, action) {
      state.showRecordingImg = action.payload;
    },
    handleSetShowLexical(state, action) {
      state.showLexical = action.payload;
    },
    handleSetCaptureThumbnail(state, action) {
      state.captureThumbnail = action.payload;
    },
    handleSetCaptureThumbnailBoardName(state, action) {
      state.captureThumbnailBoardName = action.payload;
    },
    handleSetFeedbackContent(state, action) {
      state.feedbackContent = action.payload;
    },
    handleSetLexicalInner(state, action) {
      state.lexicalInner = action.payload;
    },
    handleSetSlideCapture(state, action) {
      state.slideCapture = action.payload;
    },
    handleSetIsReading(state, action) {
      state.isReading = action.payload;
    },
    handleSetUpdatingBoard(state, action) {
      state.updatingBoard = state.updatingBoard + action.payload;
    },
  },
});

export const {
  handleSetInteractionMode,
  handleSetBoard,
  handleSetBoardId,
  handleSetBoardInfo,
  handleSetBoardName,
  handleSetHideBoardUserList,
  handleSetHideBoardMenu,
  handleSetHideRightSideBar,
  handleSetInitCanvas,
  handleSetCursorColorOfPen,
  handleSetClassForCursor,
  handleSetBoardVisitorTutorial2,
  handleSetHideHeader,
  handleSetUndoAvailable,
  handleSetRedoAvailable,
  handleSetShowMoreMenu,
  handleSetCurrentLockStatus,
  handleSetZoomFactor,
  handleSetGetOptions,
  handleSetCurrentAlign,
  handleSetDrawColorPopUp,
  handleSetWidgetMenuTouchList,
  handleSetMoreMenuTouchOpen,
  handleSetWidgetMenuList,
  handleWidgetMenuDisplay,
  handleChangeFollowMe,
  handleChangeFollowViewportUser,
  handleChangeViewport,
  handleSetCropMode,
  handleSetFollowMode,
  handleSetShowTutorial,
  handleSetOpenCreateStickyNoteTips,
  handleSetBoardMenuEvents,
  handleChangeStopFollowOtherUserFlag,
  handleSetIsPanMode,
  handleSetConnectorMode,
  handleSetConnectorModifyMode,
  handleSetArrowMode,
  handleSetBoardPanelClicked,
  handleSetDrawToCreateWidget,
  handleSetCursorColorOfPenWidth,
  handleSetDrawingEraseMode,
  handleSetNoteMode,
  handleSetAIChat,
  handleSetShowRecordButton,
  handleSetShowRecordingImg,
  handleSetShowAiChatLoading,
  handleSetShowMobileAiChatLoading,
  handleSetShowLexical,
  handleSetCaptureThumbnail,
  handleSetCaptureThumbnailBoardName,
  handleSetFeedbackContent,
  handleSetLexicalInner,
  handleSetSlideCapture,
  handleSetIsReading,
  handleSetUpdatingBoard,
} = boardSlice.actions;
export default boardSlice.reducer;
