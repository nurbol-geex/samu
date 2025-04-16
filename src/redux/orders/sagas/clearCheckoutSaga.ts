import {
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {clearCheckout} from '../slice';
import {CLEAR_CHECKOUT} from '../constants';
import {getError} from 'src/utils';

function* clearCheckoutSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<any>,
  void,
  never
> {
  try {
    yield put(clearCheckout({}));
  } catch (error) {
    getError(error);
  }
}

export function* watchClearCheckoutSection() {
  yield takeLatest(CLEAR_CHECKOUT, clearCheckoutSaga);
}
