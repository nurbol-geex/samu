import type {RootState} from '../index';

export const selectApp = (state: RootState) => state.app;

export const selectAppApp = (state: RootState) => state.app.app;

export const selectAppIsLoading = (state: RootState) => state.app.isLoading;

export const selectAppError = (state: RootState) => state.app.error;
