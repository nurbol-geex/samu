import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {UPDATE_PROFIlE} from '../constants';
import {updateProfileAPI} from '../../../api/updateProfileAPI';
import {
  updateProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
} from '../slice';
import {getError} from 'src/utils';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import { Route } from 'src/routes/Route';

function* updateProfileSaga({
  payload,
  navigation,
}): Generator<SelectEffect | PutEffect | CallEffect<any>, void, never> {
try {
    yield put(updateProfileRequest());

    const response: Awaited<ReturnType<typeof updateProfileAPI>> = yield call(
      updateProfileAPI,
      payload,
    );
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      navigation.navigate(Route.AccountScreen)
      // showToast('success', json?.message);
      yield put(updateProfileSuccess({updateProfileData: json}));
      return;
    }
    yield put(updateProfileFailure({message: json.message}));
    getError(json);
  } catch (error) {
    showToast('error', error?.message);
    yield put(updateProfileFailure(error));
    getError(error);
  }
}

export function* watchUpdateProfile() {
  yield takeLatest(UPDATE_PROFIlE, updateProfileSaga);
}
