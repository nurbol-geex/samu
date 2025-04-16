import {
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {SAVED_CARD_DETAILS} from '../constants';
import {cardDetails} from '../slice';
import {getError} from 'src/utils';

function* cardDetailsSaga({
  payload,
}: any): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
  try {
    yield put(cardDetails({cardDetails: payload}));
  } catch (error) {
    getError(error);
  }
}

export function* watchCardDetailsSection() {
  yield takeLatest(SAVED_CARD_DETAILS, cardDetailsSaga);
}
