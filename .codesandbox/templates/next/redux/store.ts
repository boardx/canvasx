'use client';
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter.slice';

import systemSlice from './features/system.slice';
import userSlice from './features/user.slice';
import boardSlice from './features/board.slice';
import sideBarSlice from './features/board.sidebar.slice';
import permissionSlice from './features/permission';

import slideSlice from './features/slides.slice';
import modeSlice from './features/mode.slice';
import timerSlice from './features/timer.slice';
import widgetsSlice from './features/widgets.slice';
import widget from './features/widget';
import rescoureSlice from './features/resource.slice';
import contextMenuSlice from './features/contextMenu.slice';
import widgetMenuSlice from './features/widgetMenu.slice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    system: systemSlice,
    user: userSlice,

    board: boardSlice,
    sideBar: sideBarSlice,
    permission: permissionSlice,

    slides: slideSlice,
    mode: modeSlice,
    timer: timerSlice,
    widgets: widgetsSlice,
    widget,
    resource: rescoureSlice,
    contextMenu: contextMenuSlice,
    widgetMenu: widgetMenuSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}),
});

//@ts-ignore
// window.store = store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
