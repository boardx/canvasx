import { createSlice } from '@reduxjs/toolkit';

type BurshWidthRange = 4 | 8 | 12;

interface IDrawState {
  brushWidth: BurshWidthRange;
  brushColor: string;
}

const initialState: IDrawState = {
  brushWidth: 4,
  brushColor: 'rgba(133,133,133, 1)'
};

const draw = createSlice({
  name: 'defaultDraw',
  initialState,
  reducers: {
    updateDrawColor(state, { payload }) {
      state.brushColor = payload;
    },

    updateDrawWidth(state, { payload }) {
      state.brushWidth = payload;
    }
  }
});

export const { updateDrawColor, updateDrawWidth } = draw.actions;
export default draw.reducer;
