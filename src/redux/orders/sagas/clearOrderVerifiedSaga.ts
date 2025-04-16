import {
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {clearOrderVerified} from '../slice';
import {CLEAR_ORDER_VERIFIED} from '../constants';
import {getError} from 'src/utils';

function* clearOrderVerifiedSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<any>,
  void,
  never
> {
  try {
    yield put(clearOrderVerified({}));
  } catch (error) {
    getError(error);
  }
}

export function* watchClearOrderVerifiedSection() {
  yield takeLatest(CLEAR_ORDER_VERIFIED, clearOrderVerifiedSaga);
}
