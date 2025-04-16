import {
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {saveLocalCartRequest} from '../slice';
import {SAVE_LOCAL_CART} from '../constants';
import {getError} from 'src/utils';

function* saveLocalCartSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(saveLocalCartRequest(payload));
  } catch (error) {
    getError(error);
  }
}

export function* watchSaveLocalCartSection() {
  yield takeLatest(SAVE_LOCAL_CART, saveLocalCartSaga);
}
