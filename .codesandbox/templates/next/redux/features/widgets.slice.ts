//** Import Redux
import { createSlice } from '@reduxjs/toolkit';

//** Create systemSlice
export const widgetsSlice = createSlice({
  name: 'widgets',
  initialState: {
    dropdownDisplayed: false,
    connectorShape: 'straight',
    tips: 'none',
    currentHoverObjectId: '',
    multiFontFamily: '',
    objectWidgetStatusChange: false,
    menuFontWeight: '',
    arrowSize: 4,
    menuPosition: null,
    opacityValue: 0,
    customColors: [],
    currentCustomColor: null,
    arrowStroke: '#555555', //'black',
    menuFontFamily: null,
    multiFontSize: '',
    customColorMode: false,
    drawingMode: false,
    menuTouchPosition: null,
    menuTouchDisplay: '',
    menuWidth: 0,
    menuLeft: 0,
    noteSelected: false,
    textSelected: false,
    shapeSelected: false,
    pathSelected: false,
    arrowSelected: false,
    fileSelected: false,
    myTemplateList: null,
    orgTemplateList: null,
    offTemplateList: null,
  },
  reducers: {
    handleSetDropdownDisplayed(state, action) {
      state.dropdownDisplayed = action.payload;
    },
    handleSetConnectorShape(state, action) {
      state.connectorShape = action.payload;
    },
    handleSetTips(state, action) {
      state.tips = action.payload;
    },
    handleSetCurrentHoverObjectId(state, action) {
      state.currentHoverObjectId = action.payload;
    },
    handleSetMultiFontFamily(state, action) {
      state.multiFontFamily = action.payload;
    },
    handleSetObjectWidgetStatusChange(state, action) {
      state.objectWidgetStatusChange = action.payload;
    },
    handleSetMenuFontWeight(state, action) {
      state.menuFontWeight = action.payload;
    },
    handleSetArrowSize(state, action) {
      state.arrowSize = action.payload;
    },
    handleSetMenuPosition(state, action) {
      state.menuPosition = action.payload;
    },
    handleSetOpacityValue(state, action) {
      state.opacityValue = action.payload;
    },
    handleSetCustomColors(state, action) {
      state.customColors = action.payload;
    },
    handleSetCurrentCustomColor(state, action) {
      state.currentCustomColor = action.payload;
    },
    handleSetArrowStroke(state, action) {
      state.arrowStroke = action.payload;
    },
    handleSetMenuFontFamily(state, action) {
      state.menuFontFamily = action.payload;
    },
    handleSetMultiFontSize(state, action) {
      state.multiFontSize = action.payload;
    },
    handleSetCustomColorMode(state, action) {
      state.customColorMode = action.payload;
    },
    handleSetDrawingMode(state, action) {
      state.drawingMode = action.payload;
    },
    handleSetMenuTouchPosition(state, action) {
      state.menuTouchPosition = action.payload;
    },
    handleSetMenuTouchDisplay(state, action) {
      state.menuTouchDisplay = action.payload;
    },
    handleSetMenuWidth(state, action) {
      state.menuWidth = action.payload;
    },
    handleSetMenuLeft(state, action) {
      state.menuLeft = action.payload;
    },
    handleSetNoteSelected(state, action) {
      state.noteSelected = action.payload;
    },
    handleSetTextSelected(state, action) {
      state.textSelected = action.payload;
    },
    handleSetShapeSelected(state, action) {
      state.shapeSelected = action.payload;
    },
    handleSetPathSelected(state, action) {
      state.pathSelected = action.payload;
    },
    handleSetArrowSelected(state, action) {
      state.arrowSelected = action.payload;
    },
    handleSetFileSelected(state, action) {
      state.fileSelected = action.payload;
    },
    handleSetMyTemplateList(state, action) {
      state.myTemplateList = action.payload;
    },
    handleSetOrgTemplateList(state, action) {
      state.orgTemplateList = action.payload;
    },
    handleSetOffTemplateList(state, action) {
      state.offTemplateList = action.payload;
    },
  },
});

export const {
  handleSetDropdownDisplayed,
  handleSetConnectorShape,
  handleSetTips,
  handleSetCurrentHoverObjectId,
  handleSetMultiFontFamily,
  handleSetObjectWidgetStatusChange,
  handleSetMenuFontWeight,
  handleSetArrowSize,
  handleSetMenuPosition,
  handleSetOpacityValue,
  handleSetCustomColors,
  handleSetCurrentCustomColor,
  handleSetArrowStroke,
  handleSetMenuFontFamily,
  handleSetMultiFontSize,
  handleSetCustomColorMode,
  handleSetDrawingMode,
  handleSetMenuTouchPosition,
  handleSetMenuTouchDisplay,
  handleSetMenuWidth,
  handleSetMenuLeft,
  handleSetNoteSelected,
  handleSetTextSelected,
  handleSetShapeSelected,
  handleSetPathSelected,
  handleSetArrowSelected,
  handleSetFileSelected,
  handleSetMyTemplateList,
  handleSetOrgTemplateList,
  handleSetOffTemplateList,
} = widgetsSlice.actions;
export default widgetsSlice.reducer;
