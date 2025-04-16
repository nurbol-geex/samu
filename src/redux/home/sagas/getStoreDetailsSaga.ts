import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getStoreDetailsRequest,
  getStoreDetailsSuccess,
  getStoreDetailsFailure,
} from '../slice';
import {GET_STORE_DETAILS_REQUEST} from '../constants';
import {getStoreDetailsAPI} from 'src/api/Stores';
import {getError} from 'src/utils';

function* getStoreDetailsSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getStoreDetailsRequest());
    const response: Awaited<ReturnType<typeof getStoreDetailsAPI>> = yield call(
      getStoreDetailsAPI,
      payload.storeId,
      payload?.longitude,
      payload?.latitude,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getStoreDetailsSuccess({storeDetailsData: json || {}}));
      return;
    }
    yield put(getStoreDetailsFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getStoreDetailsFailure(error));
    getError(error);
  }
}

export function* watchGetStoreDetailsSections() {
  yield takeLatest(GET_STORE_DETAILS_REQUEST, getStoreDetailsSaga);
}
