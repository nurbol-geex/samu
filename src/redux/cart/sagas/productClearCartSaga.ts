import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';

import {CLEAR_CART_REQUEST} from '../../cart/constants';
import {productClearCartAPI} from 'src/api/CartPageAPI';
import {clearCart} from '../slice';
import {getError} from 'src/utils';

function* productClearCartSaga({
  payload,
  getResponse,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    const response: Awaited<ReturnType<typeof productClearCartAPI>> =
      yield call(productClearCartAPI, payload.cartId);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      // showToast('success', json?.message);
      yield put(clearCart({}));
      getResponse(json?.message);
      return;
    }
    getError(json);
  } catch (error) {
    console.log('error', error);
    getError(error);
  }
}

export function* watchClearCartSections() {
  yield takeLatest(CLEAR_CART_REQUEST, productClearCartSaga);
}
