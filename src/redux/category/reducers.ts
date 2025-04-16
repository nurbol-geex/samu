import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {categoryInitialState, CategoryState} from './initialState';

export const setCategoryReducer: CaseReducer<
  CategoryState,
  PayloadAction<Partial<CategoryState>>
> = (state: CategoryState, {payload}) => ({
  ...state,
  ...payload,
});

export const resetCategoryReducer: CaseReducer<
  CategoryState,
  PayloadAction<undefined>
> = () => ({...categoryInitialState});

export const getAllCollectionsRequestReducer: CaseReducer<
  CategoryState,
  PayloadAction<undefined>
> = state => {
  state.isLoading = true;
};

export const getAllCollectionsSuccessReducer: CaseReducer<
  CategoryState,
  PayloadAction<GetAllCollectionsResponseBody>
> = (state: CategoryState, {payload}) => {
  state.collections = [...payload.collections];
};

export const getAllCollectionsFailureReducer: CaseReducer<
  CategoryState,
  PayloadAction<GetAllCollectionsErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};
