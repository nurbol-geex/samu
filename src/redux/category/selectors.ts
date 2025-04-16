import type {RootState} from '../index';

export const selectCategoryPageContent = (state: RootState) =>
  state.category.pageContent;

export const selectCollections = (state: RootState) =>
  state.category.collections;

export const selectCategoryIsLoading = (state: RootState) =>
  state.category.isLoading;

export const selectCategoryError = (state: RootState) => state.category.error;
