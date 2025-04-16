import {createSlice} from '@reduxjs/toolkit';
import {appInitialState} from './initialState';
import {SETTINGS} from './constants';
import {setSetttingOnBoard} from './reducers';

export const settingsSlice = createSlice({
  name: SETTINGS,
  initialState: appInitialState,
  reducers: {
    setOnboard: setSetttingOnBoard,
  },
});

export const {setOnboard} = settingsSlice.actions;
export default settingsSlice.reducer;
