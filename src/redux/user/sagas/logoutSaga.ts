import {put, PutEffect, SelectEffect, takeLatest} from 'redux-saga/effects';
import {LOGOUT} from '../constants';
import {resetUser} from '../slice';

function* logoutSaga(): Generator<SelectEffect | PutEffect, void, never> {
  yield put(resetUser());
}

export function* watchLogout() {
  yield takeLatest(LOGOUT, logoutSaga);
}
