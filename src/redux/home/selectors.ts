import type {RootState} from '../index';

export const selectHomeSections = (state: RootState) =>
  state.home.homeSectionData;

export const browesGridData = (state: RootState) =>
  state.home.productGridData;

export const selectHomeSectionsIsLoading = (state: RootState) =>
  state.home.isHomeLoading;

export const selectHomeSectionsError = (state: RootState) =>
  state.home.homeError;

// explore
export const selectExploreSections = (state: RootState) =>
  state.home.exploreSectionData;

export const selectExploreSectionsIsLoading = (state: RootState) =>
  state.home.isExploreLoading;

export const selectExploreSectionsError = (state: RootState) =>
  state.home.exploreError;

// search
export const selectProductSearch = (state: RootState) =>
  state.home.productSearchData;

export const selectProductSearchIsLoading = (state: RootState) =>
  state.home.isProductSearchLoading;

export const selectProductSearchError = (state: RootState) =>
  state.home.productSearchError;

// store details
export const selectStoreDetails = (state: RootState) =>
  state.home.storeDetailsData;

export const selectStoreDetailsIsLoading = (state: RootState) =>
  state.home.isStoreDetailsLoading;

export const selectStoreDetailsError = (state: RootState) =>
  state.home.storeDetailsError;

// store meu
export const selectStoreMenu = (state: RootState) => state.home.storeMenuData;

export const selectStoreMenuIsLoading = (state: RootState) =>
  state.home.isStoreMenuLoading;

export const selectStoreMenuError = (state: RootState) =>
  state.home.storeMenuError;

// store product
export const selectStoreProduct = (state: RootState) =>
  state.home.storeProductData;

export const selectStoreProductIsLoading = (state: RootState) =>
  state.home.isStoreProductLoading;

export const selectStoreProductError = (state: RootState) =>
  state.home.storeProductError;

// store product
export const selectStoreProductDetails = (state: RootState) =>
  state.home.storeProductDetailsData;

export const selectStoreProductDetailsIsLoading = (state: RootState) =>
  state.home.isStoreProductDetailsLoading;

export const selectStoreProductDetailsError = (state: RootState) =>
  state.home.storeProductDetailsError;

export const selectStoreProductByStoreIdIsLoading = (state: RootState) =>
  state.home.isProductByStoreIdLoading;
// store search
export const selectSearchStores = (state: RootState) =>
  state.home.searchStoresData;

export const selectSearchStoreIsLoading = (state: RootState) =>
  state.home.isSearchStoresLoading;

export const selectSearchStoresError = (state: RootState) =>
  state.home.searchStoresError;


export const selectrecentSearchData = (state: RootState) =>
  state.home.recentSearchData;
