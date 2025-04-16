import {
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {clearCart} from '../slice';
import {CLEAR_LOCAL_CART} from '../constants';
import {getError} from 'src/utils';

function* clearLocalCartSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<any>,
  void,
  never
> {
  try {
    yield put(clearCart({}));
  } catch (error) {
    getError(error);
  }
}

export function* watchClearLocalCartSection() {
  yield takeLatest(CLEAR_LOCAL_CART, clearLocalCartSaga);
}
