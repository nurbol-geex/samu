import {
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {selectCreateAccountForm, selectUser} from '../selectors';
import {loginRequest, phoneConfirmFailure, phoneConfirmSuccess, setUser} from '../slice';
import {LOGIN_PHONE_CONFIRM_REQUEST} from '../constants';
import {loginPhoneConfirmAPI} from '../../../api/loginPhoneConfirmAPI';
import {getOwnAccountAPI} from '../../../api/getOwnAccountAPI';
import {getDeviceObj, getError} from '../../../utils';
import {OneSignal} from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native'; // Import Sentry


function* loginPhoneConfirmSaga({
  payload: {code},
}): Generator<
  | SelectEffect
  | PutEffect
  | CallEffect<LoginPhoneConfirmResponse | Device | GetOwnAccountResponse>,
  void,
  never
> {
  const {phone} = yield select(selectCreateAccountForm);
  const {uuid} = yield select(selectUser);
  const device = yield call(getDeviceObj);
  yield put(loginRequest());

  try {
    const response: Awaited<ReturnType<typeof loginPhoneConfirmAPI>> =
      yield call(loginPhoneConfirmAPI, phone, code, uuid, device);

    const json: LoginPhoneConfirmResponse = yield response.json();
    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      OneSignal.login(json?.user?.id);
      Sentry.setUser({ id: json?.user?.id, phone:json?.user?.phone ,username: json?.user?.firstName + " " + json?.user?.lastName, email:json?.user?.email })
      yield put(
        phoneConfirmSuccess({
          user: json.user,
          accessToken: json.accessToken,
          phone,
        }),
      );

      try {
        const response: Awaited<ReturnType<typeof getOwnAccountAPI>> =
          yield call(getOwnAccountAPI);
        const json = yield response.json();
        if (
          'status' in response &&
          response.status >= 200 &&
          response.status < 300
        ) {
          setUser({
            id: json?.id || '',
            firstName: json?.firstName || '',
            lastName: json?.lastName || '',
            dateOfBirth: json?.dateOfBirth || '',
            gender: json?.gender || '',
            email: json?.email || '',
            phone: json?.phone || '',
            emailVerified: !!json?.emailVerified,
            phoneVerified: !!json?.phoneVerified,
          });
        } else {
          getError(json);
        }
      } catch (error) {
        getError(error);
      }

      RootNavigation.navigate(Route.BottomStack, {});
      return;
    }

    yield put(phoneConfirmFailure({message: json.message}));
    console.log('LOGIN_PHONE_CONFIRM_REQUEST1');
    getError(json);
  } catch (error) {
    console.log('LOGIN_PHONE_CONFIRM_REQUEST2');
    yield put(phoneConfirmFailure(error));
    getError(error);
  }
}

export function* watchLoginPhoneConfirm() {
  yield takeLatest(LOGIN_PHONE_CONFIRM_REQUEST, loginPhoneConfirmSaga);
}
