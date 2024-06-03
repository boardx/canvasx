import { createSlice } from '@reduxjs/toolkit';

import store from '../../../redux/store';

type FontFamilyType = 'Inter';
type AlignType = 'left' | 'center' | 'right';
type NoteType = 'rect' | 'circle' | 'square';

export enum WidgetType {
  WBActiveSelection = 'activeSelection',
  XConnector = 'XConnector',
  WBCircle = 'WBCircle',
  XCircleNotes = 'XCircleNotes',
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
  XRectNotes = 'XRectNotes',
  WBRectPanel = 'WBRectPanel',
  WBShape = 'WBShape',
  XShapeNotes = 'XShapeNotes',
  WBTriangle = 'WBTriangle',
  WBUrlImage = 'WBUrlImage',
  XText = 'XText',
  XTextbox = 'XTextbox',
  Common = 'common',
}
interface StickNoteType {
  objType: any;
  noteType: NoteType;
  menuBarOpen: boolean;
  backgroundColor: string;
  color?: string;
  AlignType?: AlignType;
  fontFamily?: FontFamilyType;
}

const BaseStickNote = {
  fontSize: 26,
  fontFamily: 'Inter',
  fontWeight: 400,
  textAlign: 'center',
  text: '',
  fill: '#333333',
  backgroundColor: '#FCEC8A',
  scaleX: 1,
  scaleY: 1,
  isDraw: false,
  angle: 0,
  textBaseline: 'middle',
  emoji: [0, 0, 0, 0, 0],
  selectable: true,
  lockUniScaling: false,
  verticalAlign: 'middle',
  breakWords: true,
  originX: 'center',
  originY: 'center',
};

const RectStickNote = {
  ...BaseStickNote,
  width: 230,
  height: 138,
  maxHeight: 138,
  objType: WidgetType.XRectNotes,
  noteType: 'rect',
};

const SquareStickNote = {
  ...BaseStickNote,
  width: 138,
  height: 138,
  maxHeight: 138,
  objType: WidgetType.XRectNotes,
  noteType: 'square',
};

const CircleStickNote = {
  ...BaseStickNote,
  width: 138,
  height: 138,
  radius: 138,
  maxHeight: 138,
  objType: WidgetType.XCircleNotes,
  noteType: 'circle',
};

export const getStickNoteOptions = (
  noteType: NoteType,
  backgroundColor: string,
  position: any
) => {
  let obj: any = {};
  switch (noteType) {
    case 'rect':
      obj = JSON.parse(JSON.stringify(RectStickNote));
      break;
    case 'circle':
      obj = JSON.parse(JSON.stringify(CircleStickNote));
      break;
    case 'square':
      obj = JSON.parse(JSON.stringify(SquareStickNote));
      break;
    default:
      throw `enter note type: ${noteType} is not support`;
  }

  obj.left = position.x;
  obj.top = position.y;
  obj.backgroundColor = backgroundColor;
  obj.id = Math.random().toString(36).substr(2, 19);
  obj.userId = store.getState().user.userInfo.userId;
  obj.whiteboardId = store.getState().board.board.id;
  obj.timestamp = Date.now();
  obj.zIndex = Date.now() * 100;

  return obj;
};

const initialState: StickNoteType = {
  noteType: 'rect',
  backgroundColor: '#FCEC8A',
  menuBarOpen: false,
  objType: undefined,
};

const stickNote = createSlice({
  name: 'stickNote',
  initialState,
  reducers: {
    updateStickNoteType(state, { payload }) {
      state.noteType = payload;
    },
    updateStickNoteBackgroundColor(state, { payload }) {
      state.backgroundColor = payload;
    },
    updateStickyNoteMenuBarOpenStatus(state, { payload }) {
      state.menuBarOpen = payload;
    },
  },
});

export const {
  updateStickNoteType,
  updateStickNoteBackgroundColor,
  updateStickyNoteMenuBarOpenStatus,
} = stickNote.actions;
export default stickNote.reducer;
