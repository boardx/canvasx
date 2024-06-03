import { createSlice } from '@reduxjs/toolkit';

type ModeType =
  | 'pan'
  | 'default'
  | 'draw'
  | 'stickNote'
  | 'eraser'
  | 'line'
  | 'presentation'
  | 'slide'
  | 'createTemplate'
  | 'shapeNote'
  | 'comment'
  | 'onboarding'
  | 'resource'
  | 'followMe'
  | 'text'
  | 'feedback'
  | 'file';

type Point = {
  x: number;
  y: number;
};
interface IModeState {
  type: ModeType;
  absolutePoint: Point;
}

const initialState: IModeState = {
  type: 'default',
  absolutePoint: { x: 0, y: 0 },
};

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    changeMode(state, { payload }: { payload: ModeType }) {
      state.type = payload;
    },
    updateAbsolutePoint(state, { payload }) {
      state.absolutePoint = payload;
    },
  },
});

export default modeSlice.reducer;
export const { changeMode, updateAbsolutePoint } = modeSlice.actions;
