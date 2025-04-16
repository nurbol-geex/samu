import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {HomeState} from './initialState';

export const getHomeSectionsRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isHomeLoading = true;
};

export const getHomeSectionsSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isHomeLoading = false;
  state.homeSectionData = [...(payload?.sections ?? [])];
};

export const getHomeSectionsFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isHomeLoading = false;
  state.homeError = payload;
};

// Explore
export const getExploreSectionsRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isExploreLoading = true;
};

export const getExploreSectionsSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isExploreLoading = false;
  state.exploreSectionData = [...payload.sections];
};

export const getExploreSectionsFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isExploreLoading = false;
  state.exploreError = payload;
};

// Product Search
export const getProductSearchRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isProductSearchLoading = true;
};

export const getProductSearchSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isProductSearchLoading = false;
  state.productSearchData = Array.isArray(payload.productSearchData)
  ? [...payload.productSearchData]
  : [];
};

export const getProductSearchFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isProductSearchLoading = false;
  state.productSearchError = payload;
};

// Store Details
export const getStoreDetailsRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isStoreDetailsLoading = true;
};

export const getStoreDetailsSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isStoreDetailsLoading = false;
  state.storeDetailsData = payload.storeDetailsData;
};

export const getStoreDetailsFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isStoreDetailsLoading = false;
  state.storeDetailsError = payload;
};

// Store Menu
export const getStoreMenuRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isStoreMenuLoading = true;
};

export const getStoreMenuSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isStoreMenuLoading = false;
  state.storeMenuData = [...(payload?.storeMenuData ?? [])];
};

export const getStoreMenuFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isStoreMenuLoading = false;
  state.storeMenuError = payload;
};

// Store Products
export const getStoreProductRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isStoreProductLoading = true;
};

export const getStoreProductSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isStoreProductLoading = false;
  state.storeProductData = [...(payload?.storeProductData ?? [])];
};

export const getStoreProductFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isStoreProductLoading = false;
  state.storeProductError = payload;
};

// Store Products Details
export const getStoreProductDetailsRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isStoreProductDetailsLoading = true;
};

export const getStoreProductDetailsSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isStoreProductDetailsLoading = false;
  state.storeProductDetailsData = payload.storeProductDetailsData;
};

export const getStoreProductDetailsFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isStoreProductDetailsLoading = false;
  state.storeProductDetailsError = payload;
};

// Products by store id
export const getProductByStoreIdReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isProductByStoreIdLoading = true;
};

export const getProductByStoreIdSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isProductByStoreIdLoading = false;
  state.storeProductData = [...(payload?.productByStoreIdData ?? [])];
};

export const getProductByStoreIdFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isProductByStoreIdLoading = false;
  state.storeProductError = payload;
};
// Store search
export const getSearchStoresRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isSearchStoresLoading = true;
};

export const getSearchStoresSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  state.isSearchStoresLoading = false;
  state.searchStoresData = [...(payload?.searchStoresData ?? [])];
};

export const getSearchStoresFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isSearchStoresLoading = false;
  state.searchStoresError = payload;
};

export const getRecentSearchDataReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  if (!(payload instanceof Error)) {
    if (!state.recentSearchData) {
      state.recentSearchData = [];
    }
    

    state.recentSearchData.push(payload.recentSearchData);
  } else {
    
    console.error('Error fetching recent search data:', payload);
  }
};

//browsegrid
export const getBrowseGridRequestReducer: CaseReducer<
  HomeState,
  PayloadAction<undefined>
> = state => {
  state.isHomeLoading = true;
};

export const getBrowseGridSuccessReducer: CaseReducer<
  HomeState,
  PayloadAction<any>
> = (state: HomeState, {payload}) => {
  console.log(
    'call getBrowseGridSuccessReducer'
  );

  state.isHomeLoading = false;
  state.productGridData = [...(payload?.sections ?? [])];
};

export const getBrowseGridFailureReducer: CaseReducer<
  HomeState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isHomeLoading = false;
  state.homeError = payload;
};
