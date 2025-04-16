import {createSlice} from '@reduxjs/toolkit';
import {categoryInitialState} from './initialState';
import {
  setCategoryReducer,
  resetCategoryReducer,
  getAllCollectionsRequestReducer,
  getAllCollectionsSuccessReducer,
  getAllCollectionsFailureReducer,
} from './reducers';
import {CATEGORY} from './constants';

export const categorySlice = createSlice({
  name: CATEGORY,
  initialState: categoryInitialState,
  reducers: {
    setCategory: setCategoryReducer,
    resetCategory: resetCategoryReducer,
    getAllCollectionsRequest: getAllCollectionsRequestReducer,
    getAllCollectionsSuccess: getAllCollectionsSuccessReducer,
    getAllCollectionsFailure: getAllCollectionsFailureReducer,
  },
});

export const {
  setCategory,
  getAllCollectionsRequest,
  getAllCollectionsSuccess,
  getAllCollectionsFailure,
  resetCategory,
} = categorySlice.actions;
export default categorySlice.reducer;
