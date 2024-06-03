//** Import Redux
import { createSlice } from '@reduxjs/toolkit';

//** Create systemSlice
export const slideSlice = createSlice({
  name: 'slides',
  initialState: {
    presentationMode: false, // presentation mode， hide all the other elements
    slidesMode: false, // slides mode， open the slides side bar
    slidesPlay: [], // slides play， the slides that will be played
    slides: [], // all the slides
    currentSlideIndex: 0, // current slide index
    slideCaptureIndex: 1,
    slideCaptureType: 'default',
    slidesMouseLeft: -1, //show showing a lable follow the mouse
    slidesMouseTop: -1, //showing a lable follow the mouse
    screenShotRect: null, // the rect of the selected area
    createSlidesMode: false, // create slides mode, the event will be changed on canvas
    isEnableScreenShot: false, // enable screen shot
    isStartScreenShot: false, // start screen shot
    capturing: false, // is capturing
  },
  reducers: {
    handleSetIsEnableScreenShot(state, action) {
      state.isEnableScreenShot = action.payload;
    },
    handleSetIsStartScreenShot(state, action) {
      state.isStartScreenShot = action.payload;
    },
    handleSetPresentationMode(state, action) {
      state.presentationMode = action.payload;
    },
    handleSetSlidesMode(state, action) {
      state.slidesMode = action.payload;
    },
    handleSetSlidesPlay(state, action) {
      state.slidesPlay = action.payload;
    },
    handleSetSlides(state, action) {
      state.slides = action.payload;
    },
    handleSetCurrentSlideIndex(state, action) {
      state.currentSlideIndex = action.payload;
    },
    handleGoToPreviousSlide(state) {
      if (state.currentSlideIndex > 1) {
        state.currentSlideIndex = state.currentSlideIndex - 1;
      }
    },
    handleGoToNextSlide(state) {
      const currentIndex = state.currentSlideIndex;
      const slidesTotal = state.slides.length;
      if (currentIndex < slidesTotal) {
        state.currentSlideIndex = state.currentSlideIndex + 1;
      }
    },
    handleSetSlideCaptureIndex(state, action) {
      state.slideCaptureIndex = action.payload;
    },
    handleSetSlideCaptureType(state, action) {
      state.slideCaptureType = action.payload;
    },
    handleSetSlidesMouseLeft(state, action) {
      state.slidesMouseLeft = action.payload;
    },
    handleSetSlidesMouseTop(state, action) {
      state.slidesMouseTop = action.payload;
    },
    handleSetScreenShotRect(state, action) {
      state.screenShotRect = action.payload;
    },
    handleSetCreateSlidesMode(state, action) {
      state.createSlidesMode = action.payload;
    },
    handleSetCapturing(state, action) {
      state.capturing = action.payload;
    },
  },
});

export const {
  handleSetPresentationMode,
  handleSetSlidesMode,
  handleSetSlidesPlay,
  handleSetSlides,
  handleSetCurrentSlideIndex,
  handleSetSlideCaptureIndex,
  handleSetSlideCaptureType,
  handleSetSlidesMouseLeft,
  handleSetSlidesMouseTop,
  handleSetScreenShotRect,
  handleSetCreateSlidesMode,
  handleGoToPreviousSlide,
  handleGoToNextSlide,
  handleSetIsEnableScreenShot,
  handleSetIsStartScreenShot,
  handleSetCapturing,
} = slideSlice.actions;
export default slideSlice.reducer;
