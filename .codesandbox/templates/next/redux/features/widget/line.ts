import { createSlice } from '@reduxjs/toolkit';

export type LineType = 'line' | 'lineArrow';
export type LineWidth = 4 | 8 | 12;

interface IArrowState {
  lineType: LineType;
  width?: LineWidth;
  color?: string;
}

const initialState: IArrowState = {
  lineType: 'line',
  width: 4,
  color: '#555555'
};

const draw = createSlice({
  name: 'defaultDraw',
  initialState,
  reducers: {
    updateLineType(state, {payload}) {
      state.lineType = payload
    }
  },
});

export const { updateLineType } = draw.actions;
export default draw.reducer;
