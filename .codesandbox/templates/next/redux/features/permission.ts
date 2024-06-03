import { createSlice } from '@reduxjs/toolkit';

export const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    blockRoom: 'block',
    share: 'all',
    disabledShareSelect: false,
  },
  reducers: {
    handleSetBlockRoom(state, action) {
      state.blockRoom = action.payload;
    },
    handleSetShare(state, action) {
      state.share = action.payload;
    },
    handleSetDisabledShareSelect(state, action) {
      state.disabledShareSelect = action.payload;
    },
  },
});

export const {
  handleSetBlockRoom,
  handleSetShare,
  handleSetDisabledShareSelect,
} = permissionSlice.actions;
export default permissionSlice.reducer;
