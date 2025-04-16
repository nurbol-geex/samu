import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {appInitialState, AppState} from './initialState';

export const setAppReducer: CaseReducer<
  AppState,
  PayloadAction<Partial<AppState>>
> = (state: AppState, {payload}) => ({
  ...state,
  ...payload,
});

export const resetAppReducer: CaseReducer<
  AppState,
  PayloadAction<undefined>
> = () => ({...appInitialState});

export const resetUserCancelledReducer: CaseReducer<
  AppState,
  PayloadAction<undefined>
> = state => {
  // Reset userCancelled to false
  state.userCancelled = false;
};

export const setUserCancelledReducer: CaseReducer<
  AppState,
  PayloadAction<boolean>
> = (state, {payload}) => {
  // Set userCancelled to the value passed in the payload
  state.userCancelled = payload;
};
