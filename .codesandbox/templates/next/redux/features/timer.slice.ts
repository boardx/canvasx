import { createSlice } from '@reduxjs/toolkit';

export const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    remoteTimer: {
      leftTime: 0,
      totalTime: 0,
      timerStatus: 0,
      timerOwner: '',
      timerStartTime: null,
      pauseTime: null,
      timeTemp: 0,
      boardId: '',
    },
    selected: false,
    leftTimeMarker: 0,
    progressMarker: 0,
    musicOn: false,
    iconColorOn: false,
    showTimerPopover: false,
    leftTimeTemp: null,
    timerLeftTimeMarker: 0,
    timerMode: false,
    timerProgressMarker: 0,
    isMusicOn: false,
    timerOutReminder: false,
    timerIconColorOn: false,
    selectTimer: false,
    timerStatus: 0,
    timerOwner: '',
    totalTime: 0,
    boardId: '',
    id: '',
    audio: false,
    timerStartTime: null,
    pauseTime: null,
    timeTemp: 0,
  },
  reducers: {
    handleSetTimer(state, action) {
      state.remoteTimer = action.payload;
    },
    handleChangeSelectedTimer(state, action) {
      state.selected = action.payload;
    },
    handleSetLeftTimeMarker(state, action) {
      state.leftTimeMarker = action.payload;
    },
    handleSetProgressMarker(state, action) {
      state.progressMarker = action.payload;
    },
    handleSetMusicOn(state, action) {
      state.musicOn = action.payload;
    },
    handleSetIconColorOn(state, action) {
      state.iconColorOn = action.payload;
    },
    handleShowTimerPopover(state, action) {
      state.showTimerPopover = action.payload;
    },
    handleSetLeftTimeTemp(state, action) {
      state.leftTimeTemp = action.payload;
    },
    handleSetTimerMode(state, action) {
      state.timerMode = action.payload;
    },
    handleSetTimerLeftTimeMarker(state, action) {
      state.timerLeftTimeMarker = action.payload;
    },
    handleSetShowTimerPopover(state, action) {
      state.showTimerPopover = action.payload;
    },
    handleSetTimerProgressMarker(state, action) {
      state.timerProgressMarker = action.payload;
    },
    handleSetIsMusicOn(state, action) {
      state.isMusicOn = action.payload;
    },
    handleSetTimerOutReminder(state, action) {
      state.timerOutReminder = action.payload;
    },
    handleSetTimerIconColorOn(state, action) {
      state.timerIconColorOn = action.payload;
    },
    handleSetSelectTimer(state, action) {
      state.selectTimer = action.payload;
    },
    handleSetAudio(state, action) {
      state.audio = action.payload;
    },
    handleSetTimerStaus(state, action) {
      state.timerStatus = action.payload;
    },
    handleSetTimerStartTime(state, action) {
      state.timerStartTime = action.payload;
    },
    handleSetPauseTime(state, action) {
      state.pauseTime = action.payload;
    },
    handleSetTimeTemp(state, action) {
      state.timeTemp = action.payload;
    },
  },
});

export const {
  handleChangeSelectedTimer,
  handleSetIconColorOn,
  handleSetLeftTimeMarker,
  handleSetProgressMarker,
  handleSetMusicOn,
  handleShowTimerPopover,
  handleSetLeftTimeTemp,
  handleSetTimerLeftTimeMarker,
  handleSetTimerMode,
  handleSetTimerProgressMarker,
  handleSetIsMusicOn,
  handleSetTimerOutReminder,
  handleSetTimerIconColorOn,
  handleSetSelectTimer,
  handleSetShowTimerPopover,
  handleSetAudio,
  handleSetTimerStaus,
  handleSetTimerStartTime,
  handleSetPauseTime,
  handleSetTimer,
  handleSetTimeTemp,
} = timerSlice.actions;
export default timerSlice.reducer;
