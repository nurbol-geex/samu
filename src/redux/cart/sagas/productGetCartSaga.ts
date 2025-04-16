import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  ProductGetCartRequest,
  ProductGetCartSuccess,
  ProductGetCartFailure,
} from '../../cart/slice';
import {GET_PRODUCT_GET_CART_REQUEST} from '../../cart/constants';
import {productGetCartAPI} from 'src/api/CartPageAPI';
import {getError} from 'src/utils';

function* productGetCartSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(ProductGetCartRequest());
    const response: Awaited<ReturnType<typeof productGetCartAPI>> = yield call(
      productGetCartAPI,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(ProductGetCartSuccess({productGetCartData: json}));
      return;
    }
    yield put(ProductGetCartFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(ProductGetCartFailure(error));
    getError(error);
  }
}

export function* watchGetCartSections() {
  yield takeLatest(GET_PRODUCT_GET_CART_REQUEST, productGetCartSaga);
}
