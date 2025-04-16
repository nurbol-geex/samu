import createSagaMiddleware from '@redux-saga/core';
import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './rootReducer';
import {rootSaga} from './rootSaga';
import {reduxPersistStorage} from './MMKVStorage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import {USER} from './user/constants';
import {SETTINGS} from './settings/constants';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxPersistStorage, // MMKVStorage,
  blacklist: [], // these reduce will not persist data
  whitelist: [USER, SETTINGS, 'addresses'], // these reduce will persist data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,

      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }).concat([...middlewares]),
});

sagaMiddleware.run(rootSaga);

export default store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
