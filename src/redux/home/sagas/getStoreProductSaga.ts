import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  getStoreProductRequest,
  getStoreProductSuccess,
  getStoreProductFailure,
} from '../slice';
import {GET_STORE_PRODUCT_REQUEST} from '../constants';
import {getStoreProductAPI} from 'src/api/Stores';
import {getError} from 'src/utils';

function* getStoreProductSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(getStoreProductRequest());
    const response: Awaited<ReturnType<typeof getStoreProductAPI>> = yield call(
      getStoreProductAPI,
      payload.storeId,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(getStoreProductSuccess({storeProductData: json?.products}));
      return;
    }
    yield put(getStoreProductFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(getStoreProductFailure(error));
    getError(error);
  }
}

export function* watchGetStoreProductSections() {
  yield takeLatest(GET_STORE_PRODUCT_REQUEST, getStoreProductSaga);
}
