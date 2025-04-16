import {createSlice} from '@reduxjs/toolkit';
import {HomeInitialSate} from './initialState';
import {
  getHomeSectionsRequestReducer,
  getHomeSectionsSuccessReducer,
  getHomeSectionsFailureReducer,
  getExploreSectionsRequestReducer,
  getExploreSectionsSuccessReducer,
  getExploreSectionsFailureReducer,
  getProductSearchRequestReducer,
  getProductSearchSuccessReducer,
  getProductSearchFailureReducer,
  getStoreDetailsRequestReducer,
  getStoreDetailsSuccessReducer,
  getStoreDetailsFailureReducer,
  getStoreMenuRequestReducer,
  getStoreMenuSuccessReducer,
  getStoreMenuFailureReducer,
  getStoreProductRequestReducer,
  getStoreProductSuccessReducer,
  getStoreProductFailureReducer,
  getStoreProductDetailsRequestReducer,
  getStoreProductDetailsSuccessReducer,
  getStoreProductDetailsFailureReducer,
  getProductByStoreIdReducer,
  getProductByStoreIdSuccessReducer,
  getProductByStoreIdFailureReducer,
  getSearchStoresRequestReducer,
  getSearchStoresSuccessReducer,
  getSearchStoresFailureReducer,
  getRecentSearchDataReducer,
  getBrowseGridFailureReducer,
  getBrowseGridRequestReducer,
  getBrowseGridSuccessReducer
} from './reducers';
import {HOME} from './constants';

export const homeSlice = createSlice({
  name: HOME,
  initialState: HomeInitialSate,
  reducers: {
    getRecentSearchDataRequest: getRecentSearchDataReducer,
    getHomeSectionsRequest: getHomeSectionsRequestReducer,
    getHomeSectionsSuccess: getHomeSectionsSuccessReducer,
    getHomeSectionsFailure: getHomeSectionsFailureReducer,
    getExploreSectionsRequest: getExploreSectionsRequestReducer,
    getExploreSectionsSuccess: getExploreSectionsSuccessReducer,
    getExploreSectionsFailure: getExploreSectionsFailureReducer,
    getProductSearchRequest: getProductSearchRequestReducer,
    getProductSearchSuccess: getProductSearchSuccessReducer,
    getProductSearchFailure: getProductSearchFailureReducer,
    getStoreDetailsRequest: getStoreDetailsRequestReducer,
    getStoreDetailsSuccess: getStoreDetailsSuccessReducer,
    getStoreDetailsFailure: getStoreDetailsFailureReducer,

    getStoreMenuRequest: getStoreMenuRequestReducer,
    getStoreMenuSuccess: getStoreMenuSuccessReducer,
    getStoreMenuFailure: getStoreMenuFailureReducer,

    getStoreProductRequest: getStoreProductRequestReducer,
    getStoreProductSuccess: getStoreProductSuccessReducer,
    getStoreProductFailure: getStoreProductFailureReducer,

    getStoreProductDetailsRequest: getStoreProductDetailsRequestReducer,
    getStoreProductDetailsSuccess: getStoreProductDetailsSuccessReducer,
    getStoreProductDetailsFailure: getStoreProductDetailsFailureReducer,

    getProductByStoreIdRequest: getProductByStoreIdReducer,
    getProductByStoreIdSuccess: getProductByStoreIdSuccessReducer,
    getProductByStoreIdFailure: getProductByStoreIdFailureReducer,
    getSearchStoresRequest: getSearchStoresRequestReducer,
    getSearchStoresSuccess: getSearchStoresSuccessReducer,
    getSearchStoresFailure: getSearchStoresFailureReducer,

    getProductGridRequest:getBrowseGridRequestReducer,
    getProductGridSuccess:getBrowseGridSuccessReducer,
    getProductGridFailure: getBrowseGridFailureReducer,

  },
});

export const {
  getProductGridFailure,
  getProductGridSuccess,
  getProductGridRequest,
  getRecentSearchDataRequest,
  getHomeSectionsRequest,
  getHomeSectionsSuccess,
  getHomeSectionsFailure,
  getExploreSectionsRequest,
  getExploreSectionsSuccess,
  getExploreSectionsFailure,
  getProductSearchRequest,
  getProductSearchSuccess,
  getProductSearchFailure,
  getStoreDetailsRequest,
  getStoreDetailsSuccess,
  getStoreDetailsFailure,
  getStoreMenuRequest,
  getStoreMenuSuccess,
  getStoreMenuFailure,

  getStoreProductRequest,
  getStoreProductSuccess,
  getStoreProductFailure,

  getStoreProductDetailsRequest,
  getStoreProductDetailsSuccess,
  getStoreProductDetailsFailure,

  getProductByStoreIdRequest,
  getProductByStoreIdSuccess,
  getProductByStoreIdFailure,
  getSearchStoresRequest,
  getSearchStoresSuccess,
  getSearchStoresFailure,
} = homeSlice.actions;
export default homeSlice.reducer;

