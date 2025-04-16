import {
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {selectCreateAccountForm, selectUserUser} from '../selectors';
import {signUpAPI} from '../../../api/signUpAPI';
import {getHelpDeskRequest, setUser, signUpFailure, signUpRequest, signUpSuccess, updateProfileRequest} from '../slice';
import * as RootNavigation from '../../../routes/RootNavigation';
import {Route} from '../../../routes/Route';
import {showToast} from '../../../components/shared/CustomToast/toastUtils';
import {SIGN_UP_REQUEST} from '../constants';
import {AuthenticationType} from '../initialState';
import {getError} from 'src/utils';
import * as Sentry from '@sentry/react-native'; // Import Sentry

function* signUpSaga(): Generator<
  SelectEffect | PutEffect | CallEffect<SignUpResponse>,
  void,
  never
> {
  const {firstName, lastName, dateOfBirth, gender, email, phone, password, confirmationPassword,deviceId} =
  yield select(selectCreateAccountForm);
  yield put(signUpRequest());
  try {
 
    const response: Awaited<ReturnType<typeof signUpAPI>> = yield call(
      signUpAPI,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      password,
      confirmationPassword,
      deviceId
      
    );
    const json = yield response.json();

    if (
      'status' in response &&
      response.status >= 200 &&
      response.status < 300
    ) {
      yield put(signUpSuccess());
      yield put(setUser({authenticationType: AuthenticationType.Register}));
      RootNavigation.navigate(Route.PhoneVerificationStack, {
        screen: Route.PhoneNumberVerificationScreen,
        params:{phone:phone}
      });
      return;
    }
    // if (json.message === 'Account already exists.' && !phoneVerified) {
    //   RootNavigation.push(Route.PhoneNumberVerificationScreen);
    //   return;
    // }
    yield put(signUpFailure({message: json.message}));
    getError(json);
  } catch (error) {
    Sentry.captureException(error?.message);
    yield put(signUpFailure(error));
    getError(error);
  }
}

export function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUpSaga);
}
