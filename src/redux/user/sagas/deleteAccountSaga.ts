import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {DELETE_ACCOUNT} from '../constants';
import {deleteAccountAPI} from '../../../api/deleteAccountAPI';
import {deleteAccountFailure, deleteAccountSuccess, resetUser} from '../slice';
import {getError} from 'src/utils';

function* deleteAccountSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<DeleteAccountResponseBody>,
  void,
  never
> {
  try {
    const response: Awaited<ReturnType<typeof deleteAccountAPI>> = yield call(
      deleteAccountAPI,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(resetUser());
      yield put(deleteAccountSuccess());
      return;
    }
    yield put(deleteAccountFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(deleteAccountFailure(error));
    getError(error);
  }
}

export function* watchDeleteAccount() {
  yield takeLatest(DELETE_ACCOUNT, deleteAccountSaga);
}
