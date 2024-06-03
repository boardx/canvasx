//** Import Redux
import { createSlice } from '@reduxjs/toolkit';

//** Create sliderSlice
export const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState: {
    sideBar: false,
    sideBarMode: 'none',
    commentSideBar: false,
    tutorialSideBar: false,
    slideSideBar: false,
    openResources: false,
    openShortcut: false,
    openTour: false,
    openResourceHelpfulHints: false,
    openTimerTutorials: false,
    openAiTutorials: false,
    marginRightHeaderAppBar: 15,
    marginRightMiniMapContainer: 92,
    marginRightSupport: 28,
    openChatUI: false,
    marginRightBottomAppBar: 0,
    boardAIChatBar: false,
  },
  reducers: {
    handleOpenChatUI(state, action) {
      state.openChatUI = action.payload;
    },
    handleOpenCommentSideBar(state, action) {
      state.sideBar = true;
      state.sideBarMode = 'comment';
      state.commentSideBar = true;
      state.tutorialSideBar = false;
      state.slideSideBar = false;
      state.marginRightHeaderAppBar = 365;
      state.marginRightMiniMapContainer = 455;
      state.marginRightSupport = 385;
    },
    handleCloseSideBar(state, action) {
      state.sideBar = false;
      state.sideBarMode = 'none';
      state.commentSideBar = false;
      state.tutorialSideBar = false;
      state.slideSideBar = false;
      state.marginRightHeaderAppBar = 15;
      state.marginRightMiniMapContainer = 92;
      state.marginRightSupport = 28;
    },
    handleOpenTutorialSideBar(state, action) {
      state.sideBar = true;
      state.sideBarMode = 'support';
      state.commentSideBar = false;
      state.slideSideBar = false;
      state.tutorialSideBar = true;
      state.marginRightHeaderAppBar = 510;
      state.marginRightMiniMapContainer = 568;
      state.marginRightSupport = 510;
    },
    handleOpenSlideSideBar(state, action) {
      state.sideBar = true;
      state.sideBarMode = 'slide';
      state.commentSideBar = false;
      state.slideSideBar = true;
      state.tutorialSideBar = false;
      state.marginRightHeaderAppBar = 278;
      state.marginRightMiniMapContainer = 345;
      state.marginRightSupport = 280;
    },
    handleSetOpenResources(state, action) {
      state.openResources = action.payload;
    },
    handleSetOpenShortcut(state, action) {
      state.openShortcut = action.payload;
    },
    handleSetOpenTour(state, action) {
      state.openTour = action.payload;
    },
    handSetOpenResourceHelpfulHints(state, action) {
      state.openResourceHelpfulHints = action.payload;
    },
    handleSetOpenTimerTutorials(state, action) {
      state.openTimerTutorials = action.payload;
    },
    handleSetOpenAiTutorials(state, action) {
      state.openAiTutorials = action.payload;
    },
    handleSetBoardAIChatBar(state, action) {
      state.boardAIChatBar = action.payload;
    },
  },
});

export const {
  handleOpenCommentSideBar,
  handleOpenTutorialSideBar,
  handleOpenSlideSideBar,
  handleCloseSideBar,
  handleSetOpenResources,
  handleSetOpenShortcut,
  handleSetOpenTour,
  handSetOpenResourceHelpfulHints,
  handleSetOpenTimerTutorials,
  handleSetOpenAiTutorials,
  handleOpenChatUI,
  handleSetBoardAIChatBar,
} = sideBarSlice.actions;
export default sideBarSlice.reducer;
