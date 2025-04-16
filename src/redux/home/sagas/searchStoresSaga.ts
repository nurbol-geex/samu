import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getSearchStoresRequest,
  getSearchStoresSuccess,
  getSearchStoresFailure,
} from '../slice';
import {SEARCH_STORES} from '../constants';
import {searchStoresAPI} from 'src/api/Stores';
import {getError} from 'src/utils';

function* searchStoresSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getSearchStoresRequest());
    const response: Awaited<ReturnType<typeof searchStoresAPI>> = yield call(
      searchStoresAPI,
      payload?.keyword,
      payload?.longitude,
      payload?.latitude,
      payload?.options,
    );
    const json: any = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        getSearchStoresSuccess({searchStoresData: json?.sections || []}),
      );
      return;
    }
    yield put(getSearchStoresFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getSearchStoresFailure(error));
    getError(error);
  }
}

export function* watchSearchStoresSections() {
  yield takeLatest(SEARCH_STORES, searchStoresSaga);
}
