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
import {phoneConfirmAPI} from '../../../api/phoneConfirmAPI';
import {
  loginRequest,
  phoneConfirmFailure,
  phoneConfirmSuccess,
  resetUser,
  setUser,
} from '../slice';
import {PHONE_CONFIRM_REQUEST} from '../constants';
import {getDeviceObj, getError} from '../../../utils';
import {getOwnAccountAPI} from '../../../api/getOwnAccountAPI';
import {OneSignal} from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native'; // Import Sentry

function* phoneConfirmSaga({
  payload: {code},
}): Generator<
  | SelectEffect
  | PutEffect
  | CallEffect<PhoneConfirmResponse | Device | GetOwnAccountResponse>,
  void,
  never
> {
  const {phone} = yield select(selectCreateAccountForm);
  const {uuid, resetPasswordRequested} = yield select(selectUser);
  const device = yield call(getDeviceObj);
  yield put(loginRequest());

  try {
    const response: Awaited<ReturnType<typeof phoneConfirmAPI>> = yield call(
      phoneConfirmAPI,
      phone,
      code,
      uuid,
      device,
    );
    const json: PhoneConfirmResponse = yield response.json();
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

      if (json?.user?.id && resetPasswordRequested) {
        RootNavigation.navigate(Route.AuthStack, {
          screen: Route.ResetPasswordScreen,
        });
      }

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
      return;
    }
    yield put(phoneConfirmFailure({message: json.message}));
    console.log('PHONE_CONFIRM_REQUEST2');
    getError(json);
  } catch (error) {
    yield put(phoneConfirmFailure(error));
    getError(error);
  }
}

export function* watchPhoneConfirm() {
  yield takeLatest(PHONE_CONFIRM_REQUEST, phoneConfirmSaga);
}
