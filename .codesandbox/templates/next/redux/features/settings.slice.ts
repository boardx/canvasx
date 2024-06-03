import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    disconnectTimeSec: 0,
    disconnectVoids: [],
  },
  reducers: {
    handleSetDisconnectTimeSec(state, action) {
      state.disconnectTimeSec = action.payload;
    },
    handleSetDisconnectVoids(state, action) {
      state.disconnectVoids = action.payload;
    },
  },
});

export const { handleSetDisconnectTimeSec, handleSetDisconnectVoids } =
  settingsSlice.actions;
export default settingsSlice;
