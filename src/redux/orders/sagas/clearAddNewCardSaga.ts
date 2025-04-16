import {
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {CLEAR_ADD_NEW_CARD_DATA} from '../constants';
import {getError} from 'src/utils';
import {clearAddNewCard} from '../slice';

function* clearAddNewCardSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<any>,
  void,
  never
> {
  try {
    yield put(clearAddNewCard({}));
  } catch (error) {
    getError(error);
  }
}

export function* watchClearAddNewCardSection() {
  yield takeLatest(CLEAR_ADD_NEW_CARD_DATA, clearAddNewCardSaga);
}
