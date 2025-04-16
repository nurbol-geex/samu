import { createSlice } from '@reduxjs/toolkit';
import { appInitialState } from './initialState';
import { APP } from './constants';
import { setAppReducer, resetAppReducer, setUserCancelledReducer, resetUserCancelledReducer } from './reducers';

export const appSlice = createSlice({
  name: APP,
  initialState: appInitialState,
  reducers: {
    setApp: setAppReducer,
    resetApp: resetAppReducer,
    setUserCancelled: setUserCancelledReducer, // Add the cancel action
    resetUserCancelled: resetUserCancelledReducer, // Add the reset action
  },
});

export const { setApp, resetApp, setUserCancelled, resetUserCancelled } = appSlice.actions;

export default appSlice.reducer;
