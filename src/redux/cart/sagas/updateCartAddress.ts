import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {
  updateCartAddressRequest,
  updateCartAddressSuccess,
  updateCartAddressFailure,
} from '../../cart/slice';
import {UPDATE_CART_ADDRESS_REQUEST} from '../../cart/constants';
import {updateCartAddressAPI} from 'src/api/CartPageAPI';
import {getError} from 'src/utils';

function* updateCartAddressSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(updateCartAddressRequest());
    const response: Awaited<ReturnType<typeof updateCartAddressAPI>> =
      yield call(updateCartAddressAPI, payload?.data, payload?.cartId);
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(updateCartAddressSuccess({updateCartAddressData: json}));
      return;
    }
    yield put(updateCartAddressFailure({message: json?.message}));
    getError(json);
  } catch (error) {
    yield put(updateCartAddressFailure(error));
    getError(error);
  }
}

export function* watchUpdateCartAddressSections() {
  yield takeLatest(UPDATE_CART_ADDRESS_REQUEST, updateCartAddressSaga);
}
