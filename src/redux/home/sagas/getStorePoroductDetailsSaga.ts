import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getStoreProductDetailsRequest,
  getStoreProductDetailsSuccess,
  getStoreProductDetailsFailure,
} from '../slice';
import {GET_STORE_PRODUCT_DETAILS_REQUEST} from '../constants';
import {getStoreProductDetailsAPI} from 'src/api/Stores';
import {getError} from 'src/utils';

function* getStoreProductDetailsSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getStoreProductDetailsRequest());
    const response: Awaited<ReturnType<typeof getStoreProductDetailsAPI>> =
      yield call(getStoreProductDetailsAPI, payload.productId);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(
        getStoreProductDetailsSuccess({storeProductDetailsData: json || {}}),
      );
      return;
    }
    yield put(getStoreProductDetailsFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getStoreProductDetailsFailure(error));
    getError(error);
  }
}

export function* watchGetStoreProductDetailsSections() {
  yield takeLatest(
    GET_STORE_PRODUCT_DETAILS_REQUEST,
    getStoreProductDetailsSaga,
  );
}
