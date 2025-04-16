import {
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {selectCreateAccountForm} from '../selectors';
import {loginWithEmailAPI} from '../../../api/loginWithEmailAPI';
import {loginFailure, loginRequest, loginSuccess} from '../slice';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {EMAIL_LOGIN_REQUEST} from '../constants';

function* emailLoginSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<LoginWithEmailResponse>,
  void,
  never
> {
  const {email, password} = yield select(selectCreateAccountForm);
  yield put(loginRequest());
  try {
    const response: Awaited<ReturnType<typeof loginWithEmailAPI>> = yield call(
      loginWithEmailAPI,
      email,
      password,
    );
    const json = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      console.log('jsonssss: ', json);

      yield put(loginSuccess({accessToken: json.accessToken, refreshToken: json.refreshToken}));
      // maybe needs to check for steps first
      RootNavigation.navigate(Route.BottomStack, {});
      return;
    }
    yield put(loginFailure({message: json.message}));
    showToast('error', 'Error', json.message);
  } catch (error) {
    yield put(loginFailure(error));
    showToast('error', 'Error', 'An error has occurred');
  }
}

export function* watchEmailLogin() {
  yield takeLatest(EMAIL_LOGIN_REQUEST, emailLoginSaga);
}
