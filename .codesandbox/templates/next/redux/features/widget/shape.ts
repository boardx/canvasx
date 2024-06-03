import { createSlice } from '@reduxjs/toolkit';

interface IShapeState {
  type: string;
}

const initialState: IShapeState = {
  type: 'rect',
};

const shape = createSlice({
  name: 'defaultShape',
  initialState,
  reducers: {
    updateShapeType(state, { payload }) {
      state.type = payload;
    },
  },
});

export const { updateShapeType } = shape.actions;
export default shape.reducer;
