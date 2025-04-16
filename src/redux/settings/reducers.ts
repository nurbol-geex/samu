import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {SettingState} from './initialState';

export const setSetttingOnBoard: CaseReducer<
  SettingState,
  PayloadAction<undefined>
> = () => ({isOnBoard: true});
